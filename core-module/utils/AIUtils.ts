import { ConversationalRetrievalQAChain } from 'langchain/chains';
import type { Document } from 'langchain/document';
import { OpenAI } from '@langchain/openai';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { modelName } from "../constant/AIConstant";
import { temperature } from "../constant/AIConstant";
const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const QA_PROMPT = `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

{context}

Question: {question}
Helpful answer in markdown:`;

const combineDocumentsFn = (docs: Document[], separator = '\n\n') => {
  const serializedDocs = docs.map((doc) => doc.pageContent);
  return serializedDocs.join(separator);
};

export const makeChain = (vectorstore: Chroma, workspaceId:string, channelId:string) => {
  console.log(`[AIUtils.makeChain] invoking openAI, workspaceId:${workspaceId}, channalId:${channelId}`);

  const model = new OpenAI({
    temperature: temperature, // increase temepreature to get more creative answers
    modelName: modelName, //change this to gpt-4 if you have access
  });

  console.log(`[AIUtils.makeChain] ConversationalRetrievalQAChain from LLM`)
  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(),
    {
      qaTemplate: QA_PROMPT,
      questionGeneratorTemplate: CONDENSE_PROMPT,
      returnSourceDocuments: true, //The number of source documents returned is 4 by default
    },
  );
  return chain;
};


export const writeData = async (writer: any) => {
  try {
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
    console.log("Write finished successfully");
  } catch (error) {
    console.error("Error during write:", error);
  }
}

export const getCollectionName = (workspaceId: string, channelId: string) => {
  return `${workspaceId}-${channelId}`;
}