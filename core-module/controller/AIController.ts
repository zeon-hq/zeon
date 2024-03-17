import axios from "axios";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { generateId } from "../utils/utils";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { Chroma } from "langchain/vectorstores/chroma";
import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "@langchain/openai";
import { makeChain } from "../utils/AIUtils";
import type { Document } from 'langchain/document';
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

export default class AIController {

  public static async injestPdf(req: Request, res: Response) {
    try {
      const { url, workspaceId, channelId } = req.body;

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

   
      await writeData(writer);


      const loader = new PDFLoader(tempPdfPath);
      const rawDocs = await loader.load();

      /* Split text into chunks */
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const docs = await textSplitter.splitDocuments(rawDocs);

      const embeddings = new OpenAIEmbeddings();

      const vectorStore = await Chroma.fromDocuments(docs, embeddings, {
        collectionName: "state_of_the_union",
        url: "http://100.111.35.56:9876", // Optional, will default to this value
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
      const model = new OpenAI();
      

      const vectorStore = await Chroma.fromExistingCollection(
        new OpenAIEmbeddings(),
        { 
          collectionName: "state_of_the_union" ,
          url: "http://100.111.35.56:9876", // Optional, will default to this value
        }
      );

      const chain = ConversationalRetrievalQAChain.fromLLM(
        model,
        vectorStore.asRetriever()
      );

      /* Ask it a question */
      // const question = "What is backend";
      const res = await chain.call({ question, chat_history: [] });
      console.log(res);


      res.status(200).json({ text: res });
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