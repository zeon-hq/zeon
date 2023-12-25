import { ActionIcon, Button, Flex, Input, Text } from "@mantine/core";
import socketInstance from "api/socket";
import useOnScreen from "components/hooks/useOnScreen";
import useWidget from "components/hooks/useWidget";
import MessageCard from "components/ui/MessageCard";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { BsArrow90DegDown, BsChatLeftDots } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Message, setMessage } from "redux/slice";
import styled from "styled-components";
import { MessageType } from "./Chat.types";
import ChatHeader from "./ChatHeader";
import { BrandingWrapper } from "components/ui-components/uStyleComponents";

const TopText = styled.div`
  background: #f2f4f7;
  padding: 12px 24px;
  color: #475467;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  background-color: white;
  border-radius: 12px;
  @media only screen and (max-width: 650px) {
    max-height: 100vh;
  }

  @media only screen and (max-width: 500px) {
    max-height: 100vh;
  }
`;

const ChatContainer = styled.div`
  padding: 20px 24px;
  height: 47vh;
  overflow-y: auto;
  background: white;

  @media only screen and (max-width: 650px) {
    max-height: 100vh;
  }

  @media only screen and (max-width: 500px) {
    max-height: 100vh;
  }
`;

type FormDataType = {
  message: string;
};

const Chat = () => {
  const elementRef = useRef<any>(null);
  const isOnScreen = useOnScreen(elementRef);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const scrollToBottom = () => {
    //@ts-ignore
    elementRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState: { isSubmitting },
  } = useForm<FormDataType>();
  const dispatch = useDispatch();
  const { messages, widgetDetails } = useWidget();

  const { email } = useWidget();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const submitForm = async (data: FormDataType) => {
    try {
      const { message } = data;
      if (!isSubmitting) {
        socketInstance.emit("message", {
          threadId: localStorage.getItem("threadId"),
          workspaceId: widgetDetails?.workspaceId,
          channelId: localStorage.getItem("usci"),
          ticketId: localStorage.getItem("ticketId"),
          message,
          type: MessageType.SENT,
          createdAt: Date.now().toString(),
        });
        dispatch(
          setMessage({
            message: data.message,
            type: MessageType.SENT,
            time: Date.now().toString(),
          })
        );
        reset();
      }
    } catch (error) {
      console.log(">>>", error);
    }
  };

  return (
    <>
      <ChatHeader />
      <TopText>
        <Text size="sm" weight={500}>
          {" "}
          A copy will be sent to: {email}{" "}
        </Text>
      </TopText>
      <Wrapper as={"form"} onSubmit={handleSubmit(submitForm)}>
        <ChatContainer>
          {!isOnScreen && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                leftIcon={<BsArrow90DegDown size={"1rem"} />}
                style={{
                  color: "black",
                  backgroundColor: "#f6f6f6",
                  fontWeight: 500,
                }}
                onClick={() => scrollToBottom()}
              >
                {" "}
                Scroll to bottom!{" "}
              </Button>
            </div>
          )}
          {messages.map((message: Message) => (
            <MessageCard info={message} />
          ))}
          <div ref={elementRef} />
          {showEmojiPicker && (
            <EmojiPicker
              width={300}
              onEmojiClick={(emoji) => {
                setValue("message", `${getValues().message} ${emoji.emoji}`);
              }}
            />
          )}
        </ChatContainer>

        <Flex
          style={{
            width: "90%",
            justifyContent: "space-between",
            alignItems: "end",
            padding: "0px 24px",
            marginBottom: "24px",
          }}
        >
          <Input
            sx={{
              position: "sticky",
              bottom: 0,
              fontSize: "14px",
              width: "85%",
              borderRadius: "8px",
            }}
            placeholder="Message"
            mt="8px"
            size="md"
            radius={"md"}
            {...register("message")}
          />

          <ActionIcon
          onClick={handleSubmit(submitForm)}
          disabled={watch()?.message?.length == 0}
            variant={"filled"}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "8px",
              backgroundColor: "#3054B9",
            }}
          >
            <img
              width={"20px"}
              src="https://zeonhq.b-cdn.net/send-01.svg"
              alt="zeon-logo"
            />
          </ActionIcon>
      
        </Flex>
      </Wrapper>
      
    </>
  );
};

export default Chat;
