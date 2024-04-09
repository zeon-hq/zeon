import React from "react";
import { Text, Box, Space, Avatar } from "@mantine/core";

type Props = {
  widgetHeaderColor?: string;
  mainHeading: string;
  subHeading: string;
  textColor: "dark" | "white";
};

const Header = ({
  textColor,
  widgetHeaderColor = "black",
  mainHeading = "Hey There 👋",
  subHeading = "We are always there for your support. Just Ping us",
}: Props) => {
  return (
    <Box
      p={15}
      style={{
        backgroundColor: widgetHeaderColor,
        borderBottom: `1px solid ${textColor === "dark" ? "black" : "white"}`,
      }}
    >
      {/* <Text color={textColor} size="md" weight="600">
        {" "}
        {mainHeading}{" "}
      </Text>
      <Space h={15}></Space>
      <Text color={textColor} size="xs">
        {subHeading}
      </Text> */}
      <Avatar.Group>
      <Avatar color="cyan" radius="xl">MK</Avatar>
        <Avatar color="cyan" radius="xl">KP</Avatar>
        <Avatar color="cyan" radius="xl">AM</Avatar>
        <Avatar color="cyan" radius="xl">AS</Avatar>
        <Avatar>+5</Avatar>
      </Avatar.Group>
    </Box>
  );
};

export default Header;
