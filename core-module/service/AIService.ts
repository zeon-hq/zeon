
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import axios from "axios";
import { ChromaClient } from 'chromadb';
import fs from "fs";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import path from "path";
import { chromaDbUrl } from '../constant/AIConstant';
import KnowledgeBaseModel, { IKnowledgeBaseFileUploadStatus } from "../schema/KnowledgeBaseModel";
import { getCollectionName, writeData } from "../utils/AIUtils";
import { generateId } from '../utils/utils';

const chromaRawClient = new ChromaClient({
    path: chromaDbUrl
});

const embeddings = new OpenAIEmbeddings();
export default class AIService {
    public static fileToVector = async (url: any, workspaceId: string, channelId: string) => {
        try {
            const collectionName = getCollectionName(workspaceId, channelId);
            for (let index = 0; index < url.length; index++) {
                const urlData = url[index];

                const fileId = generateId(6);

                let loader;
                let tempPdfPath;
                let fileName;
                const fileUrl = urlData?.url
                fileName = urlData?.name;

                await KnowledgeBaseModel.create({ fileId, workspaceId, channelId, fileName, s3FileUrls: fileUrl, status: IKnowledgeBaseFileUploadStatus.INJECT_STARTED });
                tempPdfPath = path.join(__dirname, fileName);


                // start
                const response = await axios({
                    method: "GET",
                    url: fileUrl,
                    responseType: "stream",
                });

                if (response.status == 200) {

                const writer = fs.createWriteStream(tempPdfPath);
                response.data.pipe(writer);
                await writeData(writer);

                loader = new PDFLoader(tempPdfPath);

                const rawDocs = await loader.load();
                /* Split text into chunks */
                const textSplitter = new RecursiveCharacterTextSplitter({
                    chunkSize: 1000,
                    chunkOverlap: 200,
                });

                const docs = await textSplitter.splitDocuments(rawDocs);

                const vectorStore = await Chroma.fromExistingCollection(
                    embeddings,
                    {
                        collectionName,
                        url: chromaDbUrl
                    }
                )

                await vectorStore.addDocuments(docs);

                await KnowledgeBaseModel.updateOne({ fileId, channelId, workspaceId }, { status: IKnowledgeBaseFileUploadStatus.INJECT_COMPLETED });
                fs.unlinkSync(tempPdfPath);

            } else {
                console.error(`Error in getting stream for the file, fileUrl: ${fileUrl}`)
            }

            }

        } catch (error) {

        }
    }

    public static createCollectionIfNotExist = async (collectionName: string) => {
        try {
            await chromaRawClient.getCollection({ name: collectionName })
        } catch (error) {
            // Create vector store and index the docs
            await chromaRawClient.createCollection({
                name: collectionName
            });
        }
    }
}