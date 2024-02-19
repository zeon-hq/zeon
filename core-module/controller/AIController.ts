import axios from "axios";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { generateId } from "../utils/utils";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
export default class AIController {
    public static async injestPdf(req: Request, res: Response) {


        const pinecone = new Pinecone({
            environment: process.env.PINECONE_ENVIRONMENT ?? '', //this is in the dashboard
            apiKey: process.env.PINECONE_API_KEY ?? '',
        });


        const { url, workspaceId, channelId } = req.body;
        const fileName = `${workspaceId}_${channelId}_${generateId(6)}.pdf`;

        const tempPdfPath = path.join(__dirname, fileName);
        // start
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(tempPdfPath);
        response.data.pipe(writer);

        async function writeData(writer:any) {
            try {
                // Assuming 'data' needs to be written using 'writer'
                // This is where you'd typically write data, e.g., writer.write(data);
        
                await new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });
        
                console.log('Write finished successfully');
            } catch (error) {
                console.error('Error during write:', error);
            }
        }

        await writeData(writer);
        console.log('dsfd');
        
        // new Promise((resolve, reject) => {
        //     writer.on('finish', resolve);
        //     writer.on('error', reject);
        // });

        const loader = new PDFLoader(tempPdfPath);
        const rawDocs = await loader.load();

        /* Split text into chunks */
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const docs = await textSplitter.splitDocuments(rawDocs);

        const embeddings = new OpenAIEmbeddings();
        const index = pinecone.Index(process.env.PINECONE_INDEX_NAME); //change to your own index name

        const test = await PineconeStore.fromDocuments(docs, embeddings, {
            pineconeIndex: index,
            namespace: process.env.PINECONE_NAME_SPACE,
            textKey: 'text',
        });

        fs.unlinkSync(tempPdfPath);
        // console.log('Temporary PDF file deleted.');

        // get pdf file, or any type of file


        // store the mongo about the file metadata

        // start the injest process vectoring

        // https://www.youtube.com/watch?v=EFM-xutgAvY&t=914s
        // calculate cost


        // store it in the vector db

        // end
    }

    public static async listfiles(req: Request, res: Response) {
        // start

        // get the list of files along with the vectoring status

        // end
    }

    public static async deleteFile(req: Request, res: Response) {
        // start

        // delete the file from the vector db

        // delete from the file storage system

        // delete from the mongo

        // end
    }
}