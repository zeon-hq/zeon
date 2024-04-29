import { Button } from "@mantine/core";
import useOnScreen from "components/hooks/useOnScreen";
import useWidget from "components/hooks/useWidget";
import MessageCard from "components/ui/MessageCard";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { BsArrow90DegDown } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { IMessageSource, Message, setMessage } from "redux/slice";
import styled from "styled-components";
import { IPropsType, MessageType } from "./Chat.types";
import ChatMessageFooter from "./ChatMessageFooter";
import WidgetChatHeader from "./WidgetChatHeader";
import { sendMessage } from "api/api";

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

  const scrollToBottom = () => {
    //@ts-ignore
    elementRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<FormDataType>();
  const dispatch = useDispatch();
  const { messages, widgetDetails } = useWidget();


  useEffect(() => {
    scrollToBottom();
  }, [messages?.length]);

  useEffect(()=>{
    return ()=>{
      localStorage.removeItem("ticketId")
    }
  },[])

  const submitForm = async (data: FormDataType) => {
    const channelId = localStorage.getItem("channelId");
    const ticketId = localStorage.getItem("ticketId");
    const createdAt = Date.now().toString();
    const type = MessageType.SENT;
    const workspaceId = widgetDetails?.workspaceId;
    const message =  data.message;

    const newMessagePayload = {
      workspaceId,
      channelId,
      ticketId,
      message,
      type,
      createdAt,
    }
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
            createdAt: Date.now().toString(),
            message,
            isOpen: true,
            type: "Computer (laptop)",
            ticketId,
          },
          messageSource: IMessageSource.WIDGET
        }
  
        await sendMessage(sendMessagePayload)
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
          {messages.map((message: Message) => (
            <MessageCard info={message} />
          ))}
          <div ref={elementRef} />
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