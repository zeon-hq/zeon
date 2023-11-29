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
