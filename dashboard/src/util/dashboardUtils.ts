/* eslint-disable no-useless-escape */
//@ts-ignore
import words from "lodash.words";
//@ts-ignore
import emoji from "emoji-dictionary";
import moment from "moment";
import { IWorkspaceInfo } from "reducer/slice";
import { format, isToday } from "date-fns";

export type Rank = "owner" | "admin" | "member";

function urlify(text: string) {
  const urlRegex = new RegExp(
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  const allText = text.split(" ") || [];
  let modifiedText = "";

  allText.forEach((word, index) => {
    if(word[0] === "<"  && word[word.length - 1] === ">") {
      word = word.replace("<", "").replace(">", "")
    }
    if(urlRegex.test(word)){
      // if word has "|", then split it and take the first part
      if(word.includes("|")) {
        word = word.split("|")[0]
      }
      modifiedText += ` [${word}](//${word}) `
    } else {
      modifiedText += ` ${word}`
    }
  })

  return modifiedText;
}

const replaceUserstakVariables = (str: string, obj: any) => {
  // get array
  const arr = str.split(" ");
  let finalString = "";
  arr.forEach((word, index) => {
    // if word has "{" at the first index and "}" at the last index then replace it with the value
    if (word[0] === "{" && word[word.length - 1] === "}") {
      const key = word.replace("{", "").replace("}", "");
      if (key === "useremail") {
        finalString += `${obj.email} `;
      }
    } else {
      finalString += `${word} `;
    }
  });

  return finalString;
};

export const preProcessText = (str: string, obj: any) => {
  const check = words(str, /:(.*?):/g);
  check.forEach((word: string) => {
    const a = str.replaceAll(word, emoji.getUnicode(word));
    str = a;
  });
  let finalString = urlify(str);
  finalString = replaceUserstakVariables(finalString, obj);
  return finalString;
};

export function convert(t: number) {
  const date = moment.unix(t).format("h:mm A");
  return date;
}

export const getTime = (time: string) => {
  if (time) {
    const inputTime = +time;
    const date = new Date(inputTime);
    
    const dateFormat = isToday(date) ? "h:mm a" : "d/M/yyyy h:mm a";
    return format(date, dateFormat);
  }
};

export const showFullDate = (t: number | undefined) => {
  // convert epoch t to dd/mm/yyyy
  if (!t) return "";
  const date = moment(t).format("MMMM Do, YYYY");
  return date;
};

export const getCurrentPlan = (subscriptionInfo: any) => {
  let plan = "userstak_base_plan_monthly";
  subscriptionInfo?.items?.data.forEach((item: any) => {
    plan = item.price.lookup_key;
  });

  return plan;
};

export const getDifferenceInDays = (t1: number, t2: number) => {
  const date1 = moment(t1);
  const date2 = moment(t2);
  const diff = date2.diff(date1, "days");
  return diff;
};

export const getAllWorkflowUsers = (workflowInfo: IWorkspaceInfo) => {
  const { allUsers } = workflowInfo;
  return allUsers;
};

export const getRank = (allUsers: any[], userId: string): Rank => {
  const thisUser = allUsers.findIndex((user: any) => user.userId === userId);
  return allUsers[thisUser].roleId;
};

const size = {
  mobileS: "320px",
  mobileM: "375px",
  mobileL: "425px",
  tablet: "768px",
  laptop: "1024px",
  laptopL: "1440px",
  desktop: "2560px",
};

export const device = {
  mobileS: `(max-width: ${size.mobileS})`,
  mobileM: `(max-width: ${size.mobileM})`,
  mobileL: `(max-width: ${size.mobileL})`,
  tablet: `(max-width: ${size.tablet})`,
  laptop: `(max-width: ${size.laptop})`,
  laptopL: `(max-width: ${size.laptopL})`,
  desktop: `(max-width: ${size.desktop})`,
  desktopL: `(max-width: ${size.desktop})`,
};

export const getAuthToken = () => {
  const token = localStorage.getItem("at");
  return token;
};

export const logOutUtils = () => {
  localStorage.removeItem("at");
  window.location.href = "/";
};

export const getOperatinHourTime = (currentDate: Date) => {
  // Getting the current date and time
  // const currentDate = new Date();

  // Extracting hours and minutes and formatting them
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;

  return formattedTime;
};

export function createDateWithTime(hour: number, minute: number) {
  const currentDate = new Date();
  currentDate.setHours(hour);
  currentDate.setMinutes(minute);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);
  return currentDate;
}
