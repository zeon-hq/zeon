import { Button } from "@mantine/core";
import useOnScreen from "components/hooks/useOnScreen";
import useWidget from "components/hooks/useWidget";
import MessageCard from "components/ui/MessageCard";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { BsArrow90DegDown } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { IChatType, IMessageSource, Message, setMessage } from "redux/slice";
import styled from "styled-components";
import { IPropsType, MessageType } from "./Chat.types";
import ChatMessageFooter from "./ChatMessageFooter";
import WidgetChatHeader from "./WidgetChatHeader";
import { getIPAddress, sendMessage } from "api/api";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 93%;
  background-color: ${(props: IPropsType) => {
    return props.theme.isEmbeddable ? "white" : "white";
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
  padding: 20px 0px;
  overflow-y: auto;
  background: white;
  // display: flex;
  // flex-direction: column-reverse;

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

  const scrollToBottom = () => {
    //@ts-ignore
    elementRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormDataType>();
  const dispatch = useDispatch();
  const { messages, widgetDetails, typing, email } = useWidget();

  useEffect(() => {
    scrollToBottom();
  }, [messages?.length]);

  useEffect(() => {
    return () => {
      localStorage.removeItem("ticketId");
    };
  }, []);

  const submitForm = async (data: FormDataType) => {
    const channelId = widgetDetails?.channelId;
    const ticketId = localStorage.getItem("ticketId");
    const widgetId = localStorage.getItem("widgetId") || "";
    const createdAt = Date.now().toString();
    const type = MessageType.SENT;
    const workspaceId = widgetDetails?.workspaceId;
    const message = data.message;
    const output = await getIPAddress();
    setValue("message", "");

    const newMessagePayload = {
      workspaceId,
      channelId,
      ticketId,
      message,
      type,
      createdAt,
    };

    let history:any = ""

    // loop through messages and construct the history
    messages.forEach((message: Message) => {
      let persona = message.type === "sent" ? "User" : "AI"
      let text = message.message
      let thisMessage =  `${persona}: ${text} \n`
      history += thisMessage
    })
    
    try {
      if (!isSubmitting) {
        dispatch(setMessage(newMessagePayload));

        const sendMessagePayload = {
          ticketId: ticketId,
          workspaceId,
          isNewTicket: false,
          messageData: {
            workspaceId,
            channelId,
            customerEmail: email,
            createdAt: Date.now().toString(),
            widgetId,
            message,
            isOpen: true,
            chatType: IChatType.HUMAN_MESSAGE,
            type: MessageType.SENT,
            ticketId,
            ipAddress: output?.data?.ip || "",
            messageSource: IMessageSource.WIDGET,
          },
          messageSource: IMessageSource.WIDGET,
          history
        };

        await sendMessage(sendMessagePayload);
        
      }
    } catch (error) {
    }
  };

  return (
    <>
      <div
        className=""
        style={{
          height: "100%",
          overflow: "auto",
        }}
      >
        <WidgetChatHeader />
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

            {messages.filter((data)=> data.chatType != IChatType.ERROR).map((message: Message) => (
              //@ts-ignore
              <MessageCard
              message={message}
                text={message.message}
                type={message.type}
                //@ts-ignore
                time={message.time || message.createdAt}
                //@ts-ignore
                key={message.time || message.createdAt}
              />
            ))}
            <div ref={elementRef} />
          </ChatContainer>
          {typing && (
            <>
              <p>typing...</p>
            </>
          )}
          <ChatMessageFooter
            setValue={setValue}
            submitForm={handleSubmit(submitForm)}
            watch={watch}
          />
        </Wrapper>
      </div>
    </>
  );
};

export default ZeonWidgetChat;
