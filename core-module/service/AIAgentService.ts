import { WebSocket } from "ws";
import speech from "@google-cloud/speech";
import AIController from "../controller/AIController";
import { debounce } from "lodash";
import { generateId } from "../utils/utils";
import { ElevenLabsClient } from "elevenlabs";
import { type Readable } from "stream";
import { getAgent } from "../functions/aiAgent";

const request = {
  config: {
    encoding: "MULAW",
    sampleRateHertz: 8000,
    languageCode: "en-GB",
  },
  interimResults: true,
};

export default class AIAgentService {
  private history: string[] = [];

  private workspaceId: string;

  private channelId: string;

  private agentId: string;

  private voiceId: string;

  private self = this;

  private client = new speech.SpeechClient();

  private elevenLabsClient: ElevenLabsClient;

  constructor(agentId: string) {
    this.agentId = agentId;
  }

  private streamToArrayBuffer(readableStream: Readable) {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      readableStream.on("data", (chunk) => {
        chunks.push(chunk);
      });

      readableStream.on("end", () => {
        resolve(Buffer.concat(chunks).buffer);
      });

      readableStream.on("error", reject);
    });
  }

  public handleIncomingCall = async (wss: WebSocket) => {
    console.log("Incoming Call Handler Initiated [AI Agent]");

    // fetch workspaceId, channelId, userId from agentId
    getAgent(this.agentId).then((agent) => {
      this.workspaceId = agent.workspaceId;
      this.channelId = agent.channelId;
      this.voiceId = agent.voiceId;
      this.elevenLabsClient = new ElevenLabsClient({
        apiKey: agent.elevenLabsApiKey,
      });
    });

    let recognizeStream: any = null;
    let isStreamDestroyed = false;

    let self = this;

    const sendToAIController = async (completeTranscription: string) => {
      const aiQuestionLogId = generateId(6);

      try {
        const aiResponse = await AIController.getInjestFileHelper(
          completeTranscription,
          self.history,
          self.workspaceId,
          self.channelId,
          aiQuestionLogId
        );

        return aiResponse?.text;
      } catch (error) {
        console.error("Error from AI Controller:", error);
      }

      // Add the question to history after sending
      self.history.push(completeTranscription);
    };

    wss.on("message", function incoming(message: any) {
      const msg = JSON.parse(String(message));
      switch (msg.event) {
        case "connected":
          console.log(`A new call has connected.`);
          break;
        case "start":
          console.log(`Starting Media Stream ${msg.streamSid}`);
          // Create Stream to the Google Speech to Text API
          recognizeStream = self.client
            .streamingRecognize(request as any)
            .on("error", console.error)
            .on("data", async (data: any) => {
              if (data.results[0] && data.results[0].isFinal) {
                const transcription =
                  data.results[0].alternatives[0].transcript.trim();
                console.log(`Final Transcription: ${transcription}`);

                const responseText = await sendToAIController(transcription);

                const response =
                  await self.elevenLabsClient.textToSpeech.convert(
                    self.voiceId,
                    {
                      model_id: "eleven_turbo_v2",
                      output_format: "ulaw_8000",
                      text: responseText || "Sorry, I didn't get that.",
                    }
                  );

                const audioArrayBuffer = await self.streamToArrayBuffer(
                  response
                );

                wss.send(
                  JSON.stringify({
                    streamSid: msg.start.streamSid,
                    event: "media",
                    media: {
                      payload: Buffer.from(audioArrayBuffer as any).toString(
                        "base64"
                      ),
                    },
                  })
                );
              }
            });
          break;
        case "media":
          if (!isStreamDestroyed && recognizeStream) {
            recognizeStream.write(msg.media.payload);
          }
          break;
        case "stop":
          console.log(`Call Has Ended`);
          if (!isStreamDestroyed && recognizeStream) {
            recognizeStream.destroy();
            isStreamDestroyed = true;
          }
          break;
      }
    });
  };
}
