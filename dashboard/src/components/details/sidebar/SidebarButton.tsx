import { Button, Text, ActionIcon } from "@mantine/core";
import { ReactNode } from "react";

type Props = {
  text: string;
  icon: ReactNode;
  selected: boolean;
  onClick?: () => any;
};

const SidebarButton = ({ text, icon, onClick, selected }: Props) => {
  return (
    <Button
      radius="md"
      styles={{
        root: {
          height: "40px",
          padding: "8px !important",
          borderRadius: "0px",
          backgroundColor: selected ? "# F5F8FF" : "#ffffff",
          // padding:"10px",
          color: "black",
          "&:hover": {
            backgroundColor: "#F5F8FF",
            // color:"white",

            svg: {
              // color:"white"
            },
          },
        },
        inner: {
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        },
      }}
      // mt={10}
      leftIcon={
        <ActionIcon
          variant="transparent"
          // styles={{
          //   root:{
          //     "&:hover": {
          //       background: "none",
          //     }

          //   },
          // }}
          sx={{ background: "none", color: "#667085" }}
        >
          {icon}
        </ActionIcon>
      }
      variant="light"
      fullWidth
      size="lg"
      onClick={onClick ? onClick : () => {}}
      color="indigo-7"
    >
      <Text align="left" size="md" weight={"600"}>
        {text}
      </Text>
    </Button>
  );
};

export default SidebarButton;
