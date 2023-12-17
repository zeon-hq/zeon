import { Button, ButtonProps } from "@mantine/core";
import React from "react";

type Props = {
  label: string;
  color: string;
  secondaryColor: string;
  leftIcon: React.ReactNode;
  onClick: () => void;
};

const ZActionText = (props: Props & ButtonProps) => {
  const style = {
    root: {
      color: props.color,
      // on hover, make the background color the same as the text color
        "&:hover": {
            backgroundColor: props.secondaryColor
        },
    },
  };

  return (
    <Button onClick={props.onClick} styles={style} leftIcon={props.leftIcon} variant="subtle">
      {props.label}
    </Button>
  );
};

export default ZActionText;
