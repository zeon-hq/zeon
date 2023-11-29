import React from "react";
import { Text } from "@mantine/core";

type Props = {
  text: string;
  showBlack ?: boolean
};

const HelperText = ({ text, showBlack=false }: Props) => {
  return (
    <Text my={8} sx={{color: showBlack ? "black" : "#868E96"}} weight="400" size="xs">
      {text}
    </Text>
  );
};

export default HelperText;
