import { ReactNode } from "react";
import { Button } from "@mantine/core";

type ButtonProps = {
  icon?: ReactNode;
  text: string;
  color?: string;
  fullWidth?: boolean;
};

const UButton = ({
  icon,
  text,
  color = "dark",
  fullWidth = false,
}: ButtonProps) => {
  return (
    <Button
      radius="md"
      style={{ padding: "7px 14px" }}
      fullWidth={fullWidth}
      leftIcon={icon}
      color={color}
    >
      {text}
    </Button>
  );
};

export default UButton;
