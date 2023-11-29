import { BlockOptions } from "../schema/types/ticket";

export function makeBlocks(blockOptions: BlockOptions): any {
  const date: Date = new Date(Date.now());
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `You have a chat message: ${blockOptions.customerEmail}`,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Type:*\n${blockOptions.type}`,
        },
        {
          type: "mrkdwn",
          text: `*When:*\nSubmitted ${getFormattedDay(
            date
          )}, ${getFormattedTimeStamp(date)}`,
        },
        {
          type: "mrkdwn",
          text: `*Last Update:*\n${getFormattedDay(date)}, ${getFormattedYear(
            date
          )}`,
        },
        {
          type: "mrkdwn",
          text: `*Message:*\n ${blockOptions.message}`,
        },
      ],
    },
    {
      type: "actions",
      elements: blockOptions.isOpen
        ? [
            {
              type: "button",
              text: {
                type: "plain_text",
                emoji: true,
                text: "Send E-Mail",
              },
              style: "primary",
              value: "click_me_123",
              action_id: "send_email",
              url: "mailto:" + blockOptions.customerEmail,
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                emoji: true,
                text: "Close Ticket",
              },
              style: "primary",
              value: "click_me_123",
              action_id: "close_ticket",
            },
          ]
        : [
            {
              type: "button",
              text: {
                type: "plain_text",
                emoji: true,
                text: "Send E-Mail",
              },
              style: "primary",
              value: "click_me_123",
              action_id: "send_email",
              url: "mailto:" + blockOptions.customerEmail,
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                emoji: true,
                text: "Re-Open Ticket",
              },
              style: "danger",
              value: "click_me_123",
              action_id: "reopen_ticket",
            },
          ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Message:*\n ${blockOptions.message}`,
      },
    },
  ];
}

function getFormattedDay(date: Date) {
  const day: string = toDoubleDigit(date.getDate());
  const month: number = date.getMonth();

  let monthFormatted: string = "";

  switch (month) {
    case 0:
      monthFormatted = "Jan";
      break;
    case 1:
      monthFormatted = "Feb";
      break;
    case 2:
      monthFormatted = "Mar";
      break;
    case 3:
      monthFormatted = "Apr";
      break;
    case 4:
      monthFormatted = "May";
      break;
    case 5:
      monthFormatted = "Jun";
      break;
    case 6:
      monthFormatted = "Jul";
      break;
    case 7:
      monthFormatted = "Aug";
      break;
    case 8:
      monthFormatted = "Sep";
      break;
    case 9:
      monthFormatted = "Oct";
      break;
    case 10:
      monthFormatted = "Nov";
      break;
    case 12:
      monthFormatted = "Dec";
      break;
  }
  return `${monthFormatted} ${day}`;
}

function getFormattedTimeStamp(date: Date) {
  let hours: number = date.getHours();
  const minutes: string = toDoubleDigit(date.getMinutes());
  let period: string = "am";
  if (hours >= 12) {
    period = "pm";
  }
  if (hours > 12) {
    hours -= 12;
  }
  return `${toDoubleDigit(hours)}:${minutes}${period}`;
}

function getFormattedYear(date: Date) {
  const year: number = date.getFullYear();
  return year;
}

function toDoubleDigit(value: number) {
  return value.toLocaleString("en-US", { minimumIntegerDigits: 2 });
}

export function updateBlocks(blocks: any, isOpen: boolean) {
  const customerEmail = blocks[2].elements[0].url.split(":")[1];
  const blockOptions: BlockOptions = {
    customerEmail: customerEmail,
    type: "",
    message: "",
    isOpen: isOpen,
  };

  let updatedBlocks = makeBlocks(blockOptions);

  updatedBlocks[0] = blocks[0];
  updatedBlocks[1] = blocks[1];
  updatedBlocks[3] = blocks[3];

  return updatedBlocks;
}

export function generateRandomString(length: number): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset.charAt(randomIndex);
  }
  return randomString;
}