import { Button, Text } from "@mantine/core";
import socketInstance from "api/socket";
import useOnScreen from "components/hooks/useOnScreen";
import useWidget from "components/hooks/useWidget";
import MessageCard from "components/ui/MessageCard";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { BsArrow90DegDown } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Message, setMessage } from "redux/slice";
import styled from "styled-components";
import { IPropsType, MessageType } from "./Chat.types";
import ChatHeader from "./ChatHeader";
import ChatMessageFooter from "./ChatMessageFooter";

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
height: 100%;
display: flex;
flex-direction: column;
justify-content: space-between;
background-color: ${(props: IPropsType) => {
  return props.theme.isEmbeddable ? 'white' :'white';
}};
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

const ZeonWidgetChat = () => {
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
    <div className="" style={{
      height: "100%",
      overflow: "auto",
    }}>
      <ChatHeader />
      {/* <TopText>
        <Text size="sm" weight={500}>
          {" "}
          A copy will be sent to: {email}{" "}
        </Text>
      </TopText> */}
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

      <ChatMessageFooter 
      register={register}
      watch={watch}
      submitForm={handleSubmit(submitForm)}
      />
      </Wrapper>
      </div>
    </>
  );
};

export default ZeonWidgetChat;