import moment from "moment";

export const getFullName = (firstName: string, lastName: string) => {
  return `${firstName} ${lastName}`;
};

export const getChatWidgetLogo = () => {
  return [
    { value: "youtube", label: "Youtube" },
    { value: "slack", label: "Slack" },
    { value: "discord", label: "Discord" },
    { value: "calendly", label: "Calendly" },
    { value: "twitch", label: "Twitch" },
    { value: "facebook", label: "Facebook" },
    { value: "twitter", label: "Twitter" },
    { value: "instagram", label: "Instagram" },
    { value: "linkedIn", label: "LinkedIn" },
    {value: "Docs", label: "Documentation"}
  ];
};

// 2023-12-09T18:30:00.000Z
export const getReadableDate = (date: string) => {
  // date format : 2023-12-09T18:30:00.000Z
  // convert the date to DD/MM/YYYY
  // USE MOMENT.JS
  const newDate = moment(date).format("DD/MM/YYYY");
  return newDate;

}
/**
 * input : 2023-12-09T18:30:00.000Z
 * output : 22 January 2023 9:30 pm
 */
export const getReadableDateWithTime = (date: string) => {
  const newDate = moment(date).format("DD MMMM YYYY h:mm a");
  return newDate;
}

/**
 * function takes in string and makes first char uppercase
 */
export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}