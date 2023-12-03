import dotenv from "dotenv";

dotenv.config();

const WEBSITE_URL = process.env.WEBSITE_URL as string;

export enum SlackMesageType {
  TRIAL_WILL_END,
  SUBSCRIPTION_ENDED,
}

export const createSlackMessageBlock = (type: SlackMesageType) => {
  return {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: messageTitle(type),
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: messageDescription(type),
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Manage Billing",
              emoji: true,
            },
            value: "click_me_123",
            action_id: "manage_billing",
            url: WEBSITE_URL,
          },
        ],
      },
    ],
  };
};

const messageTitle = (type: SlackMesageType) => {
  switch (type) {
    case SlackMesageType.TRIAL_WILL_END:
      return "*Action Required: Your UserStak trial is going to end in 3 days.*";
    case SlackMesageType.SUBSCRIPTION_ENDED:
      return "*Action Required: Your UserStak subscription period has ended.*";
    default:
      return "";
  }
};

const messageDescription = (type: SlackMesageType) => {
  switch (type) {
    case SlackMesageType.TRIAL_WILL_END:
      return "We wanted to send you a quick reminder that your UserStak service is going to end in 3 days. Please make a payment to continue this service and avoid any disruptions.";
    case SlackMesageType.SUBSCRIPTION_ENDED:
      return "We wanted to notify you that your UserStak service has ended. Please subscribe to resume this service.";
    default:
      return "";
  }
};

export function generateRandomString(length: number): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset.charAt(randomIndex);
  }
  return randomString;
}