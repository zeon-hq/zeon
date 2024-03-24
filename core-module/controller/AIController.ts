import { OpenAIEmbeddings } from "@langchain/openai";
import axios from "axios";
import { Request, Response } from "express";
import fs from "fs";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAI } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import path from "path";
import KnowledgeBaseModel, { IKnowledgeBaseFileUploadProgress } from "../schema/KnowledgeBaseModel";
import { makeChain } from "../utils/AIUtils";
import { generateId } from "../utils/utils";
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


export enum IInjectFileType {
  DIRECT_FILE_UPLOAD = "DIRECT_FILE_UPLOAD",
  FILE_URL = "FILE_URL",
}

export default class AIController {

  public static async injestPdf(req: Request, res: Response) {
    try {
      // possible ways of injesting the content are
      // uplaoding the file directly
      // pdf, txt, docx
      // uplading the pdf in the url
      // website url 

      // things convered -> upload pdf file, pass the file url
      const { url, workspaceId, channelId, uploadType } = req.body;
      const fileId = generateId(6);

      let loader;
      let tempPdfPath;
      let fileName;

      // upload to s3


      // s3 file upload
      await KnowledgeBaseModel.create({fileId, workspaceId, channelId,fileName, s3FileUrls: '', progress: IKnowledgeBaseFileUploadProgress.UPLOADED_TO_S3});

      
      if (uploadType === IInjectFileType.DIRECT_FILE_UPLOAD) {
        fileName = req.file.filename;
        tempPdfPath = path.join(__dirname, fileName);
      } else if (uploadType === IInjectFileType.FILE_URL) {
        fileName = `${workspaceId}_${channelId}_${generateId(6)}.pdf`;
        tempPdfPath = path.join(__dirname, fileName);
              // start
      const response = await axios({
        method: "GET",
        url: url,
        responseType: "stream",
      });

      const writer = fs.createWriteStream(tempPdfPath);
      response.data.pipe(writer);
      await writeData(writer);
      }

      loader = new PDFLoader(tempPdfPath);

      const rawDocs = await loader.load();
      await KnowledgeBaseModel.updateOne({fileId, channelId, workspaceId}, {progress: IKnowledgeBaseFileUploadProgress.INJECT_STARTED});
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

      await KnowledgeBaseModel.updateOne({fileId, channelId, workspaceId}, {progress: IKnowledgeBaseFileUploadProgress.INJECT_COMPLETED});
      fs.unlinkSync(tempPdfPath);

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
      const sanitizedQuestion = question.trim().replaceAll('\n', ' ');
      /* create vectorstore*/
      const vectorStore = await Chroma.fromExistingCollection(
        new OpenAIEmbeddings({}),
        {
          collectionName: "state_of_the_union",
          url: "http://100.111.35.56:9876",
        },
      );

      //create chain
      const chain = makeChain(vectorStore);
      //Ask a question using chat history

      const response = await chain.call({
        question: sanitizedQuestion,
        chat_history: history || [],
      });

      console.log('response', response);
      res.status(200).json(response);
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

  public static async getUploadedFileList(req: Request, res: Response) {
    try {
      const { channelId, workspaceId } = req.params;

      const files = await KnowledgeBaseModel.find({channelId, workspaceId});

      return res.status(200).json({
        code: "200",
        message: `AI Files fetched`,
        data: files,
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

  public static async deleteFile(req: Request, res: Response) {
    try {
      const { fileId } = req.params;
      const {channelId, workspaceId} = req.body;

      const file = await KnowledgeBaseModel.findOneAndDelete({fileId, channelId, workspaceId});

      // delete the file from s3
      // TODO:

      return res.status(200).json({
        code: "200",
        message: `AI File deleted`,
        data: file,
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

  public static async downloadFile(req: Request, res: Response) {
    try {
      const { fileId } = req.params;
      const {channelId, workspaceId} = req.body;

      const file = await KnowledgeBaseModel.findOne({fileId, channelId, workspaceId});

      if (!file) {
        return res.status(404).json({
          code: "404",
          message: `AI File not found`,
        });
      }

      // download the file from s3
      

      return res.status(200).json({
        code: "200",
        message: `AI File downloaded`,
        data: file,
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
}