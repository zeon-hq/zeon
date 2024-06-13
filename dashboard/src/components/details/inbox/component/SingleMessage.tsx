import { Flex, Text } from "@mantine/core";
import useDashboard from "hooks/useDashboard";
import { MessageType } from "reducer/slice";
import styled from "styled-components";
import { getTime, preProcessText } from "util/dashboardUtils";
import Lottie from "lottie-react";
import TemplateGeneratingAnimation from "./template_generating.json";
import ReactMarkdown from "react-markdown";
interface WrapperProps {
  type: string;
}

const SingleChat = styled.div<WrapperProps>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => props.type === MessageType.RECEIVED || props.type === "SENT" || props.type === MessageType.NOTE   ? "end"   : "start"};
  margin-left: ${(props) => props.type === MessageType.NOTE   ? ""  : props.type === MessageType.RECEIVED || props.type === "SENT"   ? "20px"   : ""};
  margin-right: ${(props) => props.type === MessageType.NOTE   ? "" : props.type === MessageType.RECEIVED || props.type === "SENT"   ? ""   : "20px"};
`;

const Wrapper = styled.div<WrapperProps>`
    background-color: ${(props) => props.type === MessageType.NOTE ? "#FEEE95" : props.type?.toLowerCase() === MessageType.RECEIVED || props.type === "SENT" ? "#3054B9" : "#fff"};
    padding: 8px 12px;
    width: ${(props) => (props.type === MessageType.NOTE ? "100%" : "100%")};
    border: ${(props) => props.type === MessageType.NOTE ? "" : "1px solid #CED4DA"};
    color: ${(props) => props.type === MessageType.RECEIVED || props.type === "SENT" ? "black" : "black"};
    border-radius: ${(props) => props.type === MessageType.NOTE ? "8px 8px 8px 8px" : props.type === MessageType.RECEIVED || props.type === "SENT" ? " 8px"     : "8px"};
`;

const ParentWrapper = styled.div`
  width: "fit-content";
`;

interface IInfo {
  type:string;
  message:string;
}
interface ISingleMessage {
  info: IInfo | any;
  isLastCount: boolean;
}

const markdownText = `# This is a Heading

This is a normal text paragraph.

Another paragraph here.

## This is a Sub-heading

More text here.`

const SingleMessage = ({ info, isLastCount }: ISingleMessage) => {
  const { activeChat, typing, user } = useDashboard();
  const { type, message } = info;
  const isReceivedMessage = (type === MessageType.RECEIVED);
  const isNote = (type === MessageType.NOTE);

  const newMessage = preProcessText(message || '', {email: activeChat?.customerEmail});

  return (
    <>
      <SingleChat type={type}>
        <ParentWrapper>
          <Flex justify={'space-between'} gap={'25px'}>
          <Text mt={12} color="#344054" size="xs" weight={'500'} fs={'14'}>
            {isNote ? `Internal Note by ${user.email}` : isReceivedMessage ? user.email : type === MessageType.SENT ? activeChat?.customerEmail : ''}
          </Text>
          <Text mt={13} color="#495057" size="xs" weight={'400'} fs={'16'}>
            {getTime(info.createdAt || parseInt(info.time))}{" "}
          </Text>
          </Flex>

          <Wrapper type={type}>
            {/* <Text
              dangerouslySetInnerHTML={{ __html: newMessage }}
              color={
                isReceivedMessage || type === "SENT"
                  ? "white"
                  : "black"
              }
              size="sm"
              weight="normal"
            /> */}
            <ReactMarkdown
              children={markdownText}
              components={{
                //@ts-ignore
                p: ({node, ...props}) => <Text {...props} />,
                a: ({node, ...props}) => <a {...props} target="_blank" />
              }}
            />
          </Wrapper>
        </ParentWrapper>
      </SingleChat>

{
(isLastCount && typing) && 
      <SingleChat type={MessageType.SENT}>
        <ParentWrapper>
          <Flex justify={'space-between'} gap={'25px'}>
          <Text mt={12} color="#344054" size="xs" weight={'500'} fs={'14'}>
             {activeChat?.customerEmail}
          </Text>
          <Text mt={13} color="#495057" size="xs" weight={'400'} fs={'16'}>
            {getTime(info.createdAt || parseInt(info.time))}{" "}
          </Text>
          </Flex>

          <Wrapper type={MessageType.SENT}>
          <Lottie
          loop={true}
          height={20}
          style={{ height: "16px", width: "38px"}}
          autoplay={true}
          animationData={TemplateGeneratingAnimation}/>
          </Wrapper>
        </ParentWrapper>
      </SingleChat>
}
    </>
  );
};

export default SingleMessage;