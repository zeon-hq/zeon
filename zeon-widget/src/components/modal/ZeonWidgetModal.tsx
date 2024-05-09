import { Button, Flex, Loader, Space, Text, TextInput } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { getIPAddress, sendMessage } from "api/api";
import { IPropsType, MessageType } from "components/chat/Chat.types";
import ZeonWidgetChat from "components/chat/ZeonWidgetChat";
import useOutsideAlerter from "components/hooks/useOutsideAlerter";
import useWidget from "components/hooks/useWidget";
import { BrandingWrapper } from "components/ui-components/uStyleComponents";
import Header from "components/ui/Header";
import MessageCard from "components/ui/MessageCard";
import ZeonWidgetCard from "components/ui/ZeonWidgetCard";
import ZeonWidgetForm from "components/ui/ZeonWidgetForm";
import { generateId } from "components/util/utils";
import { useRef, useState } from "react";
import { IoMdArrowForward } from "react-icons/io";
import { useDispatch } from "react-redux";
import {
  setEmail as rSetEmail,
  IMessageSource,
  IUIStepType,
  clearPrevChat,
  setMessage as rSetMessage,
  setShowWidget,
  setStep,
} from "redux/slice";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 70vh !important;
  background-color: white;
  background: white;
  width: ${(props: IPropsType) => {
    return props.theme.isEmbeddable ? "100%" : "480px";
  }};
  max-height: ${(props: IPropsType) => {
    return props.theme.isEmbeddable ? "100%" : "70vh";
  }};
  ${(props: IPropsType) => (props.theme.isEmbeddable ? "height: 100%;" : "")}
  border: 1px solid #EAECF0;
  border-radius: 12px;
  box-shadow: 0 8px 8px -4px rgba(16, 24, 40, 0.03),
    0 20px 24px -4px rgba(16, 24, 40, 0.08);
  position: fixed;
  right: ${(props: IPropsType) => {
    return props.theme.isEmbeddable ? "0px" : "16px";
  }};
  bottom: ${(props: IPropsType) => {
    return props.theme.isEmbeddable ? "0vh" : "12vh";
  }};
  z-index: 100000000000;
  display: flex;
  flex-direction: column;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media only screen and (max-width: 1300px) {
    ${(props: IPropsType) => (props.theme.isEmbeddable ? "height: 100%;" : "")}
    width: ${(props: IPropsType) => {
      return props.theme.isEmbeddable ? "100%" : "480px";
    }};
  }

  @media only screen and (min-width: 1301px) {
    ${(props: IPropsType) => (props.theme.isEmbeddable ? "height: 100%;" : "")}
    ${(props: IPropsType) => (props.theme.isEmbeddable ? "width: 100%;" : "")}
  }

  @media only screen and (max-width: 1024px) {
    ${(props: IPropsType) => (props.theme.isEmbeddable ? "height: 100%;" : "")}
    width: ${(props: IPropsType) => {
      return props.theme.isEmbeddable ? "100%" : "480px";
    }};
  }

  @media only screen and (max-width: 650px) {
    width: ${(props: IPropsType) => {
      return props.theme.isEmbeddable ? "100%" : "80vw";
    }};
    height: ${(props: IPropsType) => {
      return props.theme.isEmbeddable ? "100%" : "100vh";
    }};
    position: fixed;
    right: 0px;
    bottom: 0px;
  }

  @media only screen and (max-width: 500px) {
    width: ${(props: IPropsType) => {
      return props.theme.isEmbeddable ? "100vw" : "100%";
    }};
    height: ${(props: IPropsType) => {
      return props.theme.isEmbeddable ? "100vh" : "100%";
    }};
    position: fixed;
    right: 0px;
    bottom: 0px;
  }
`;

const Info = styled.div`
  padding: 10px 13px 10px;
  gap: 10px;
  ${(props: IPropsType) => (props.theme.isEmbeddable ? "height: 100%;" : "")}
  border-radius: 12px;
  max-height: ${(props: IPropsType) => {
    return props.theme.isEmbeddable ? "100%" : "47vh";
  }};
  overflow: auto;
  background: white;
  /* border-radius: 8px; */

  @media only screen and (max-width: 650px) {
    height: ${(props: IPropsType) => {
      return props.theme.isEmbeddable ? "100%" : "100vh";
    }};
  }

  @media only screen and (max-width: 500px) {
    height: ${(props: IPropsType) => {
      return props.theme.isEmbeddable ? "100%" : "100vh";
    }};
  }
`;

const ZeonWidgetModal = () => {
  const wrapperRef = useRef(null);
  const { step, widgetDetails, isOutOfOperatingHours } = useWidget();
  const dispatch = useDispatch();

  const [message, setMessage] = useInputState("");
  const [email, setEmail] = useInputState("");
  const [finalMessage, setFinalMessage] = useInputState("");
  const [showEmailCollection, setShowEmailCollection] = useState(false);
  const [loading, setLoading] = useState(false);

  useOutsideAlerter(wrapperRef, () => {
    dispatch(setShowWidget(false));
    dispatch(rSetMessage([]));
    dispatch(setStep(IUIStepType.INITIAL));
  });

  const submitForm = async () => {
    setLoading(true);
    dispatch(rSetEmail(email));
    const widgetId = localStorage.getItem("widgetId") || "";
    const workspaceId = widgetDetails?.workspaceId;
    const channelId = widgetDetails?.channelId;
    const ticketId = generateId(6);
    localStorage.setItem("ticketId", ticketId);
    try {
      const output = await getIPAddress();
      dispatch(clearPrevChat());

      const sendMessagePayload = {
        ticketId: ticketId,
        workspaceId,
        isNewTicket: true,
        messageData: {
          workspaceId,
          channelId,
          customerEmail: email,
          createdAt: Date.now().toString(),
          message,
          isOpen: true,
          widgetId,
          type: "Computer (laptop)",
          ticketId,
          ipAddress: output?.data?.ip || "",
        },
        messageSource: IMessageSource.WIDGET,
      };

      await sendMessage(sendMessagePayload);
      dispatch(
        rSetMessage({
          message: message || "Hey this is hardcoded",
          type: MessageType.SENT,
          time: Date.now().toString(),
        })
      );

      dispatch(setStep(IUIStepType.CHAT));

      const checkIsOutOfOperatingHours = isOutOfOperatingHours(
        widgetDetails?.behavior.operatingHours.operatingHours.from,
        widgetDetails?.behavior.operatingHours.operatingHours.to,
        widgetDetails?.behavior.operatingHours.timezone
      );

      const sendAutoReplyMessageWhenOffline =
        widgetDetails?.behavior.operatingHours.enableOperatingHours &&
        checkIsOutOfOperatingHours;
      if (sendAutoReplyMessageWhenOffline) {
      } else if (widgetDetails?.behavior?.widgetBehavior.autoReply) {
        // commenting out for some testing purpose
        // setTimeout(() => {
        //   dispatch(
        //     setMessage({
        //       message: widgetDetails?.behavior?.widgetBehavior.autoReply,
        //       type: MessageType.RECEIVED,
        //       time: Date.now().toString(),
        //     })
        //   );
        //   socketInstance.emit("message", {
        //     workspaceId: widgetDetails?.workspaceId,
        //     channelId: localStorage.getItem("channelId"),
        //     message: widgetDetails?.behavior?.widgetBehavior.autoReply,
        //     createdAt: Date.now().toString(),
        //     ticketId: localStorage.getItem("ticketId"),
        //     type: MessageType.RECEIVED,
        //     isAIEnabled:false
        //   })
        // },3000)
      }
      setFinalMessage("");
      setMessage("");
      setEmail("");
      setShowEmailCollection(false);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const showBrandingImage =
    widgetDetails?.appearance?.miscellaneous?.showBranding;


  return (
    <>
      {widgetDetails?.channelId && (
        <Wrapper ref={wrapperRef}>
          {step === IUIStepType.CHAT ? (
            <ZeonWidgetChat />
          ) : (
            <>
              <Header isForm={step === IUIStepType.FORM} />
              <Info>
                {step === IUIStepType.FORM && (
                  <ZeonWidgetForm />
                )}
              </Info>
              {finalMessage && (
                <>
                  <MessageCard
                    text={finalMessage}
                    time={new Date()}
                    type={MessageType.SENT}
                  />
                  <MessageCard
                    text={
                      "Please provide your email so you can get responses  to your inbox even if you leave this page"
                    }
                    time={new Date()}
                    type={MessageType.RECEIVED}
                  />
                </>
              )}
              <div>
              {step === IUIStepType.INITIAL && !showEmailCollection && (
                <>
                  <ZeonWidgetCard />
                  <Space h="sm" />
                  </>
                )}
                
                {showEmailCollection ? (
                  <TextInput
                    placeholder="Type your email here..."
                    radius="md"
                    value={email}
                    // disabled={loading}
                    size="sm"
                    type="email"
                    onChange={setEmail}
                    
                    style={{ borderRadius: "12px" }}
                  />
                ) : (
                  <TextInput
                    placeholder="Type your message here..."
                    radius="md"
                    value={message}
                    size="sm"
                    onChange={setMessage}
                    style={{ borderRadius: "12px" }}
                  />
                )}
                <Flex
                  justify="space-between"
                  align="baseline"
                >
                  {showBrandingImage && (
                    <BrandingWrapper
                      onClick={() => window.open("https://zeonhq.com", "_blank")}
                    >
                      <Text align="center" size="xs" color="gray">
                        {" "}
                        Powered By
                      </Text>
                      <img
                        width={"25px"}
                        src="https://zeon-assets.s3.ap-south-1.amazonaws.com/Logomark.svg"
                        alt="zeon-logo"
                      />
                    </BrandingWrapper>
                  )}
                  <Button
                    size="sm"
                    sx={{
                      backgroundColor:"#3C69E7"
                    }}
                    radius="md"
                    color="blue"
                    onClick={() => {
                      if(showEmailCollection) {
                        submitForm()
                      } else {
                        setFinalMessage(message);
                        setShowEmailCollection(true);
                      }
                      
                    }}
                    disabled={loading}
                    rightIcon={
                      <IoMdArrowForward size={15} style={{ color: "white" }} />
                    }
                  >
                    {loading ? <Loader size={20} /> : "Submit"}
                  </Button>
                </Flex>
              </div>
            </>
          )}
        </Wrapper>
      )}
    </>
  );
};

export default ZeonWidgetModal;
