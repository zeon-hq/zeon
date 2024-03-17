import axios from "axios";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { generateId } from "../utils/utils";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { makeChain } from "../utils/AIUtils";
import type { Document } from 'langchain/document';
export default class AIController {

  public static async injestPdf(req: Request, res: Response) {
    try {
      const { url, workspaceId, channelId } = req.body;

      const pinecone = new Pinecone({
        environment: process.env.PINECONE_ENVIRONMENT ?? "", //this is in the dashboard
        apiKey: process.env.PINECONE_API_KEY ?? "",
      });

      const fileName = `${workspaceId}_${channelId}_${generateId(6)}.pdf`;

      const tempPdfPath = path.join(__dirname, fileName);
      // start
      const response = await axios({
        method: "GET",
        url: url,
        responseType: "stream",
      });

      const writer = fs.createWriteStream(tempPdfPath);
      response.data.pipe(writer);

      async function writeData(writer: any) {
        try {
          // Assuming 'data' needs to be written using 'writer'
          // This is where you'd typically write data, e.g., writer.write(data);

          await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
          });

          console.log("Write finished successfully");
        } catch (error) {
          console.error("Error during write:", error);
        }
      }

      await writeData(writer);
      console.log("dsfd");



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
        textKey: "text",
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

      return res.status(200).json({
        code: "200",
        message: `AI file injested`,
      });
    } catch (e) {
      if (e.response) {
        return res.status(e.response.status).json({
          code: e.response.data ? e.response.data.code : e.response.status,
          message: e.response.data ? e.response.data.message : e.message,
          data: e.response.data ? e.response.data.data : null,
        });
      } else {
        return res.status(500).json({
          code: "500",
          message: e.message,
        });
      }
    }
  }

  public static async getInjestPdf(req: Request, res: Response) {
    try {
      const { question, history } = req.body;

      // OpenAI recommends replacing newlines with spaces for best results
      const sanitizedQuestion = question.trim().replaceAll('\n', ' ');
      const pinecone = new Pinecone({
        environment: process.env.PINECONE_ENVIRONMENT ?? "", //this is in the dashboard
        apiKey: process.env.PINECONE_API_KEY ?? "",
      });


      const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

      /* create vectorstore*/
      const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings({}),
        {
          pineconeIndex: index,
          textKey: 'text',
          namespace: process.env.PINECONE_NAME_SPACE, //namespace comes from your config folder
        },
      );

      // Use a callback to get intermediate sources from the middle of the chain
      let resolveWithDocuments: (value: Document[]) => void;
      const documentPromise = new Promise<Document[]>((resolve) => {
        resolveWithDocuments = resolve;
      });
      const retriever = vectorStore.asRetriever({
        callbacks: [
          {
            // DocumentInterface[]
            handleRetrieverEnd(documents:Document[]) {
              resolveWithDocuments(documents);
            },
          },
        ],
      });

      //create chain
      const chain = makeChain(retriever);

      const pastMessages = history
        .map((message: [string, string]) => {
          return [`Human: ${message[0]}`, `Assistant: ${message[1]}`].join('\n');
        })
        .join('\n');
      console.log(pastMessages);

      //Ask a question using chat history
      const response = await chain.invoke({
        question: sanitizedQuestion,
        chat_history: pastMessages,
      });

      const sourceDocuments = await documentPromise;

      console.log('response', response);
      res.status(200).json({ text: response, sourceDocuments });
    } catch (e) {
      if (e.response) {
        return res.status(e.response.status).json({
          code: e.response.data ? e.response.data.code : e.response.status,
          message: e.response.data ? e.response.data.message : e.message,
          data: e.response.data ? e.response.data.data : null,
        });
      } else {
        return res.status(500).json({
          code: "500",
          message: e.message,
        });
      }
    }
  }
}