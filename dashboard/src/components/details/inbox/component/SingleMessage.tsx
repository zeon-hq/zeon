import { Flex, Text } from "@mantine/core";
import useDashboard from "hooks/useDashboard";
import { MessageType } from "reducer/slice";
import styled from "styled-components";
import { getTime, preProcessText } from "util/dashboardUtils";

interface WrapperProps {
  type: string;
}

const SingleChat = styled.div<WrapperProps>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) =>
    props.type === MessageType.RECEIVED || props.type === "SENT" || props.type === MessageType.NOTE
      ? "end"
      : "start"};
  margin-left: ${(props) =>
    props.type === MessageType.NOTE
      ? ""
      : props.type === MessageType.RECEIVED || props.type === "SENT"
      ? "20px"
      : ""};
  margin-right: ${(props) =>
    props.type === MessageType.NOTE
      ? ""
      : props.type === MessageType.RECEIVED || props.type === "SENT"
      ? ""
      : "20px"};
`;

const Wrapper = styled.div<WrapperProps>`
    background-color: ${(props) =>
        props.type === MessageType.NOTE
            ? "#FEEE95"
            : props.type?.toLowerCase() === MessageType.RECEIVED ||
              props.type === "SENT"
            ? "#3054B9"
            : "#fff"};
    padding: 8px 12px;
    width: ${(props) => (props.type === MessageType.NOTE ? "100%" : "100%")};
    border: ${(props) =>
        props.type === MessageType.NOTE ? "" : "1px solid #CED4DA"};
    color: ${(props) =>
        props.type === MessageType.RECEIVED || props.type === "SENT"
            ? "black"
            : "black"};
    border-radius: ${(props) =>
        props.type === MessageType.NOTE
            ? "8px 8px 8px 8px"
            : props.type === MessageType.RECEIVED || props.type === "SENT"
            ? " 8px"
            : "8px"};
`;

const ParentWrapper = styled.div`
  width: "fit-content";
`;

const SingleMessage = ({ info }: any) => {
  const { activeChat, user } = useDashboard();
  const { type, message } = info;
  const newMessage = preProcessText(message || '', {email: activeChat?.customerEmail});

  return (
    <>
      <SingleChat type={type}>
        <ParentWrapper>
          <Flex justify={'space-between'} gap={'25px'}>
          <Text mt={12} color="#344054" size="xs" weight={'500'} fs={'14'}>
            {type === MessageType.NOTE ? `Internal Note by ${user.email}` : type === MessageType.RECEIVED ? user.email : type === MessageType.SENT ? activeChat?.customerEmail : ''}
          </Text>
          <Text mt={13} color="#495057" size="xs" weight={'400'} fs={'16'}>
            {getTime(info.createdAt || parseInt(info.time))}{" "}
          </Text>
          </Flex>

          <Wrapper type={type}>
            <Text
              dangerouslySetInnerHTML={{ __html: newMessage }}
              color={
                type === MessageType.RECEIVED || type === "SENT"
                  ? "white"
                  : "black"
              }
              size="sm"
              weight="normal"
            />
          </Wrapper>
        </ParentWrapper>
      </SingleChat>
    </>
  );
};

export default SingleMessage;