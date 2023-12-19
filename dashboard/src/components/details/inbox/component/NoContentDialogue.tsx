import React from "react";
import styled from "styled-components";
import { Button, Image, Text } from "@mantine/core";
import addWorkSpace from "assets/addWorkSpace.svg";
import infoCircle from "assets/infoCircle.svg";

type INoContentDialogue = {
  heading: string;
  text: string;
  buttonTitle?: string;
  onClick?: () => void;
};

const Wrapper = styled.div`
  background: #fff;
  border: 1px solid #d0d5dd;
  border-radius: 12px;
  padding: 16px;
  width: 489px;
  text-align: center;
`;

const NoContentDialogue = ({
  heading,
  text,
  buttonTitle,
  onClick,
}: INoContentDialogue) => {
  return (
    <Wrapper>
      <Image
        maw={20}
        mx="auto"
        radius="md"
        src={infoCircle}
        alt="Add Workspace Icon"
      />
      <Text color="#344054" weight={600} mt={"sm"} mb={"sm"}>
        {" "}
        {heading}{" "}
      </Text>
      <p> {text} </p>
      {buttonTitle && (
        <Button
          radius="md"
          onClick={onClick}
          fullWidth
          style={{
            background: "#3C69E7",
            marginTop: "16px",
          }}
          variant="filled"
          leftIcon={
            <Image
              maw={20}
              mx="auto"
              radius="md"
              src={addWorkSpace}
              alt="Add Workspace Icon"
            />
          }
        >
          {buttonTitle}
        </Button>
      )}
    </Wrapper>
  );
};

export default NoContentDialogue;
