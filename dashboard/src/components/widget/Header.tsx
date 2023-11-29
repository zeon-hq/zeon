import React from "react";
import { Text, Box, Space } from "@mantine/core";

type Props = {
  widgetHeaderColor?: string;
  mainHeading: string;
  subHeading: string;
  textColor : "dark" | "white";
};

const Header = ({ textColor, widgetHeaderColor="black", mainHeading="Hey There 👋", subHeading="We are always there for your support. Just Ping us" }: Props) => {
  return (
    <Box p={15} style={{ backgroundColor: widgetHeaderColor, borderBottom: `1px solid ${textColor === "dark" ? "black" : "white"}` }}>
      <Text color={textColor} size="md" weight="600">
        {" "}
        {mainHeading}{" "}
      </Text>
      <Space h={15}></Space>
      <Text color={textColor} size="xs">
        {subHeading}
      </Text>
    </Box>
  );
};

export default Header;
