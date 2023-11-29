import { useEffect, useRef } from "react";
import Card from "components/ui/Card";
import Header from "components/ui/Header";
import styled from "styled-components";
import useWidget from "components/hooks/useWidget";
import useOutsideAlerter from "components/hooks/useOutsideAlerter";
import Form from "components/ui/Form";
import Chat from "components/chat/Chat";
import { useDispatch } from "react-redux";
import { setAllOpenConversations, setShowWidget } from "redux/slice";
import { setMessage } from "redux/slice";
import { Text } from "@mantine/core";
import { getOpenTicket } from "api/api";
import { BrandingWrapper } from "components/ui-components/uStyleComponents";

const Wrapper = styled.div`
  /* TODO: Discuss with ajay if we need fixed height or thr height should depend upon content */
  /* height: 92vh; */
  width: 480px;
  max-height: 70vh;
  /* overflow-y:auto; */
  border: 1px solid #eaecf0;
  border-radius: 12px;
  box-shadow: 0px 8px 8px -4px rgba(16, 24, 40, 0.03),
    0px 20px 24px -4px rgba(16, 24, 40, 0.08);
  position: fixed;
  right: 16px;
  bottom: 12vh;
  z-index: 100000000000;
  display: flex;
  flex-direction: column;

  @media only screen and (max-width: 1300px) {
    width: 480px;
  }

  @media only screen and (max-width: 1024px) {
    width: 480px;
  }

  @media only screen and (max-width: 650px) {
    width: 80vw;
    height: 100vh;
    position: fixed;
    right: 0px;
    bottom: 0px;
  }

  @media only screen and (max-width: 500px) {
    width: 100vw;
    height: 100vh;
    position: fixed;
    right: 0px;
    bottom: 0px;
  }
`;

const Info = styled.div`
  padding: 10px 20px 20px;
  gap: 10px;
  border-radius: 12px;
  max-height: 47vh;
  overflow: auto;
  background: white;
  /* border-radius: 8px; */

  @media only screen and (max-width: 650px) {
    height: 100vh;
  }

  @media only screen and (max-width: 500px) {
    height: 100vh;
  }
`;



const Modal = () => {
  const wrapperRef = useRef(null);
  const { step, widgetDetails } = useWidget();
  const dispatch = useDispatch();
  
  useOutsideAlerter(wrapperRef, () => {
    dispatch(setShowWidget(false));
  });

  useEffect(() => {
    getOpenTicketData();
  }, []);

  const getOpenTicketData = async () => {
    const getWidgetId: any = localStorage.getItem("widgetId");
    const getData: any = await getOpenTicket(getWidgetId);
    // dispatch(setMessage(getData.data.ticket))
    dispatch(setAllOpenConversations(getData.data.ticket));
  };

  return (
    <Wrapper ref={wrapperRef}>
      {step === "chat" ? (
        <Chat />
      ) : (
        <>
          <Header isForm={step === "form"} />
          <Info>
            {step === "initial" ? (
              <Card />
            ) : step === "form" ? (
              <Form />
            ) : (
              <p> {step} </p>
            )}
            {widgetDetails?.appearance?.miscellaneous?.showBranding && (
              <BrandingWrapper
                onClick={() =>
                  window.open("https://www.userstak.com", "_blank")
                }
              >
                <Text align="center" size="xs" color="gray">
                  {" "}
                  Powered By{" "}
                </Text>
                <img width={"60px"} src="https://zeonhq.b-cdn.net/ZeonPowered.svg" alt="zeon-logo"/>
              </BrandingWrapper>
            )}
          </Info>
        </>
      )}
    </Wrapper>
  );
};

export default Modal;
