import { OpenAIEmbeddings } from "@langchain/openai";
import axios from "axios";
import { Request, Response } from "express";
import fs from "fs";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import path from "path";
import KnowledgeBaseModel, { IKnowledgeBaseFileUploadStatus } from "../schema/KnowledgeBaseModel";
import { makeChain } from "../utils/AIUtils";
import { generateId } from "../utils/utils";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

const secretAccessKey = process.env.SECRET_ACCESS_KEY as string;
const accessKeyId = process.env.ACCESS_KEY as string;
const bucketName = process.env.BUCKET_NAME as string;
const region = process.env.REGION as string;

const chromaDbUrl = "http://100.111.35.56:9876";

const s3 = new S3Client({
  credentials: {
    secretAccessKey,
    accessKeyId,
  },
  region
})

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

const embeddings = new OpenAIEmbeddings();
export default class AIController {

  public static async injestPdf(req: Request, res: Response) {
    try {
      // possible ways of injesting the content are
      // uplaoding the file directly
      // pdf, txt, docx
      // uplading the pdf in the url
      // website url 

      // things convered -> upload pdf file, pass the file url
      const { url, workspaceId, channelId } = req.body;
      // collection name is the channelId-workspaceId
      const collectionName = `${workspaceId}-${channelId}`;
      const fileId = generateId(6);

      let loader;
      let tempPdfPath;
      let fileName;

      const fileUrl = url[0]?.url
      fileName = url[0]?.name;

      // s3 file upload
      await KnowledgeBaseModel.create({fileId, workspaceId, channelId, fileName, s3FileUrls: fileUrl, status: IKnowledgeBaseFileUploadStatus.INJECT_STARTED});
      
        tempPdfPath = path.join(__dirname, fileName);
              // start
      const response = await axios({
        method: "GET",
        url: fileUrl,
        responseType: "stream",
      });

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

      await KnowledgeBaseModel.updateOne({fileId, channelId, workspaceId}, {status: IKnowledgeBaseFileUploadStatus.INJECT_COMPLETED});
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
      const { question, history, workspaceId, channelId} = req.body;
      const collectionName = `${workspaceId}-${channelId}`;
      const sanitizedQuestion = question.trim().replaceAll('\n', ' ');
      /* create vectorstore*/
      const vectorStore = await Chroma.fromExistingCollection(
        embeddings,
        {
          collectionName,
          url: chromaDbUrl,
        },
      );

      //create chain
      const chain = makeChain(vectorStore);
      //Ask a question using chat history

      const response = await chain.call({
        question: sanitizedQuestion,
        chat_history: history || [],
      });

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
      const { fileId, channelId, workspaceId } = req.params;
      // const {channelId, workspaceId} = req.body;

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

public static async uploadFiles (req: Request, res: Response) {
  try {
    const uploadedUrls = await Promise.all(((req.files || []) as any[])?.map(async (file: any) => {
      const tempId = generateId(6);
      const fileName = `${file.originalname}-${tempId}`;
      
      const commandPayload = {
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      }

      const command = new PutObjectCommand(commandPayload);
      await s3.send(command);
      return { url:`https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`,
     fileName: file.originalname,
     mimeType: file.mimetype
    };
    }));

    return res.status(200).json({
      message: "Logos uploaded",
      uploadedUrls: uploadedUrls // This is an array of URLs
    })

  } catch (error) {
    console.log('error message', error?.message);
    return res.status(500).json({
      message: error?.message,
    })
  }
}
}