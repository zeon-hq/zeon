import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import axios from "axios";
import { ChromaClient } from 'chromadb';
import fs from "fs";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import path from "path";
import { chromaDbUrl } from '../constant/AIConstant';
import { ZeonServices } from "../types/types";
import KnowledgeBaseModel, { IKnowledgeBaseFileUploadStatus } from "../schema/KnowledgeBaseModel";
import { getCollectionName, writeData } from "../utils/AIUtils";
import { generateId } from '../utils/utils';
import Logger from "../functions/logger";

const logger = new Logger(ZeonServices.CORE);

const chromaRawClient = new ChromaClient({
    path: chromaDbUrl
});

const embeddings = new OpenAIEmbeddings();
export default class AIService {
    public static fileToVector = async (url: any, workspaceId: string, channelId: string) => {
        try {
            logger.info({ message: `[AIService.fileToVector] No of files, ${url.length}, workspaceId ${workspaceId}, channelId: ${channelId}` });
            const collectionName = getCollectionName(workspaceId, channelId);
            for (let index = 0; index < url.length; index++) {
                const urlData = url[index];

                const fileId = generateId(6);

                const fileName = urlData?.name;
                const fileUrl = urlData?.url

                await KnowledgeBaseModel.create({ fileId, workspaceId, channelId, fileName, s3FileUrls: fileUrl, status: IKnowledgeBaseFileUploadStatus.INJECT_STARTED });
                AIService.injestFile(fileName, fileUrl, collectionName, channelId, workspaceId, fileId);
            }

        } catch (error) {
            console.error(`[AIService.fileToVector] Error in file injesting, ${error.message}`)
            logger.error({ message: `[AIService.fileToVector] Error in file injesting`, payload: `${error.message}` });
        }
    }

    public static injestFile = async (fileName: string, fileUrl: string, collectionName: string, channelId: string, workspaceId: string, fileId: string) => {
        let tempPdfPath = path.join(__dirname, fileName);


        logger.info({ message: `Getting stream from the file url: ${fileUrl}, fileName: ${fileName}` });
        const response = await axios({
            method: "GET",
            url: fileUrl,
            responseType: "stream",
        });

        if (response.status == 200) {
            const writer = fs.createWriteStream(tempPdfPath);
            response.data.pipe(writer);
            await writeData(writer);

            let loader = new PDFLoader(tempPdfPath);

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

            logger.info({ message: `[AIService.fileToVector] vectoring document, ${fileName}, workspaceId:${workspaceId}, channelId:${channelId}, url:${fileUrl}` });
            const ids = await vectorStore.addDocuments(docs);

            await KnowledgeBaseModel.updateOne({ fileId, channelId, workspaceId }, { status: IKnowledgeBaseFileUploadStatus.INJECT_COMPLETED, chromaDocIds: ids });

            logger.info({ message: `[AIService.fileToVector] deleting the file, ${fileName}, workspaceId:${workspaceId}, channelId:${channelId}, url:${fileUrl}` });
            fs.unlinkSync(tempPdfPath);
        } else {
            logger.error({ message: `Error in getting stream for the file, fileUrl: ${fileUrl}` });
        }
    }


    public static createCollectionIfNotExist = async (collectionName: string) => {
        try {
            logger.info({ message: `[AIService.createCollectionIfNotExist checking, if the collection is existed]', ${collectionName}` })
            await chromaRawClient.getCollection({ name: collectionName })
        } catch (error) {
            // Create vector store and index the docs
            logger.info({ message: `[AIService.createCollectionIfNotExist] creating collection, ${collectionName}` })
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