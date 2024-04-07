import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChromaClient } from 'chromadb';
import { Request, Response } from "express";
import { chromaDbUrl } from "../constant/AIConstant";
import KnowledgeBaseModel from "../schema/KnowledgeBaseModel";
import AIService from "../service/AIService";
import { makeChain } from "../utils/AIUtils";
import { generateId } from "../utils/utils";

const secretAccessKey = process.env.SECRET_ACCESS_KEY as string;
const accessKeyId = process.env.ACCESS_KEY as string;
const bucketName = process.env.BUCKET_NAME as string;
const region = process.env.REGION as string;

const chromaRawClient = new ChromaClient({
  path:chromaDbUrl
});

const s3 = new S3Client({
  credentials: {
    secretAccessKey,
    accessKeyId,
  },
  region
})

const embeddings = new OpenAIEmbeddings();


export enum IInjectFileType {
  DIRECT_FILE_UPLOAD = "DIRECT_FILE_UPLOAD",
  FILE_URL = "FILE_URL",
}

export default class AIController {

  public static async injestPdf(req: Request, res: Response) {
    try {

      // things convered -> upload pdf file, pass the file url
      const { url, workspaceId, channelId } = req.body;
      // collection name is the channelId-workspaceId
      const collectionName = `${workspaceId}-${channelId}`;

      await AIService.createCollectionIfNotExist(collectionName);
      
      await AIService.fileToVector(url, workspaceId, channelId);
  
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

public static async testFuns(req: Request, res: Response) {
  try {
    const test = await chromaRawClient.reset()
    console.log('test', test);
    
} catch (error) {
  console.log('error message', error?.message);
}

  return res.status(200).json({
    message: "5"
  })
}
}