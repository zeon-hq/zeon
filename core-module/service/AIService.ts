import "web-streams-polyfill/dist/polyfill.es6.js";
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
            console.log(`[AIService.fileToVector] No of files, ${url.length}, workspaceId ${workspaceId}, channelId: ${channelId}`);
            const collectionName = getCollectionName(workspaceId, channelId);
            for (let index = 0; index < url.length; index++) {
                const urlData = url[index];

                const fileId = generateId(6);

                let loader;
                let tempPdfPath;
                const fileName = urlData?.name;
                const fileUrl = urlData?.url

                await KnowledgeBaseModel.create({ fileId, workspaceId, channelId, fileName, s3FileUrls: fileUrl, status: IKnowledgeBaseFileUploadStatus.INJECT_STARTED });
                tempPdfPath = path.join(__dirname, fileName);


                // start
                console.log(`Getting stream from the file url: ${fileUrl}, fileName: ${fileName}`)
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

                    console.log(`[AIService.fileToVector] vectoring document, ${fileName}, workspaceId:${workspaceId}, channelId:${channelId}, url:${fileUrl}`);
                    const ids = await vectorStore.addDocuments(docs);

                    await KnowledgeBaseModel.updateOne({ fileId, channelId, workspaceId }, { status: IKnowledgeBaseFileUploadStatus.INJECT_COMPLETED, chromaDocIds: ids });

                    console.log(`[AIService.fileToVector] deleting the file, ${fileName}, workspaceId:${workspaceId}, channelId:${channelId}, url:${fileUrl}`);
                    fs.unlinkSync(tempPdfPath);

                } else {
                    console.error(`Error in getting stream for the file, fileUrl: ${fileUrl}`)
                }

            }

        } catch (error) {
            console.error(`[AIService.fileToVector] Error in file injesting, ${error.message}`)
        }
    }

    public static createCollectionIfNotExist = async (collectionName: string) => {
        try {
            console.log(`[AIService.createCollectionIfNotExist checking, if the collection is existed]', ${collectionName}`)
            await chromaRawClient.getCollection({ name: collectionName })
        } catch (error) {
            // Create vector store and index the docs
            console.log(`[AIService.createCollectionIfNotExist] creating collection, ${collectionName}`)
            await chromaRawClient.createCollection({
                name: collectionName
            });
        }
    }

    public static removeInjestedFile = async (fileId: string, channelId: string, workspaceId: string) => {
        const collectionName = getCollectionName(workspaceId, channelId);
        const vectorStore = await Chroma.fromExistingCollection(
            embeddings,
            {
                collectionName,
                url: chromaDbUrl
            }
        )
        const file = await KnowledgeBaseModel.findOneAndDelete({ fileId, channelId, workspaceId });
        //@ts-ignore
        if (file?.chromaDocIds) {
            //@ts-ignore
            await vectorStore.delete({ ids: file?.chromaDocIds || [] });
        }
    }
}