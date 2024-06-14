import { ConversationalRetrievalQAChain } from 'langchain/chains';
import type { Document } from 'langchain/document';
import { OpenAI } from '@langchain/openai';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { modelName } from "../constant/AIConstant";
import { temperature } from "../constant/AIConstant";
export const guardRailKeyword = "human_intervention_needed";

const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const humanInterventionText = `If the question is not related to the context, respond with the word "${guardRailKeyword}"`

const QA_PROMPT = `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
.

{context}

Question: {question}
Helpful answer in markdown:
This is some further context about knowledge that the AI assistant might need to answer the question.
Return the response in markdown format. Dont add h1 or h2 tags. Add h3, bullet points, new lines and links as needed.
Dont mention context in the response. Just answer the question. Also, dont add headings like "Answer" or "Solution" in the response. Only add headings if the or it is needed.
`;

const getQAPrompt = ({string, enableHumanHandover}:{string:string, enableHumanHandover:boolean}) => {
  const prompt = `${QA_PROMPT} ${string} ${enableHumanHandover ? humanInterventionText : ""}`;
  return prompt;
}


export const makeChain = (vectorstore: Chroma, workspaceId:string, channelId:string, customPrompt:string, enableHumanHandover:boolean) => {
  console.log(`[AIUtils.makeChain] invoking openAI, workspaceId:${workspaceId}, channalId:${channelId}`);

  const model = new OpenAI({
    temperature: temperature, // increase temepreature to get more creative answers
    modelName: modelName, //change this to gpt-4 if you have access
  });

  console.log(`[AIUtils.makeChain] ConversationalRetrievalQAChain from LLM`)
  const llmPayload = {
    qaTemplate: getQAPrompt({string: customPrompt || "", enableHumanHandover: enableHumanHandover}),
    questionGeneratorTemplate: CONDENSE_PROMPT,
    returnSourceDocuments: true, //The number of source documents returned is 4 by default
  };
  const chain = ConversationalRetrievalQAChain.fromLLM(model, vectorstore.asRetriever(), llmPayload);
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