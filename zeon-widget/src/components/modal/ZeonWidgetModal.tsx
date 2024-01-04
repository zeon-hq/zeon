import { Text } from "@mantine/core";
import { getChannelById, getOpenTicket } from "api/api";
import { IPropsType } from "components/chat/Chat.types";
import ZeonWidgetChat from "components/chat/ZeonWidgetChat";
import { generateRandomString } from "components/hooks/commonUtils";
import useEmbeddable, { IEmbeddableOutput } from "components/hooks/useEmbeddable";
import useOutsideAlerter from "components/hooks/useOutsideAlerter";
import useWidget from "components/hooks/useWidget";
import { BrandingWrapper } from "components/ui-components/uStyleComponents";
import Header from "components/ui/Header";
import ZeonWidgetCard from "components/ui/ZeonWidgetCard";
import ZeonWidgetForm from "components/ui/ZeonWidgetForm";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setAllOpenConversations, setShowWidget, setWidgetDetails } from "redux/slice";
import styled from "styled-components";
const Wrapper = styled.div`
  background-color: white;
  background: white;
  width: ${(props: IPropsType) => {
    return props.theme.isEmbeddable ? '100%' :'480px';
  }};
  max-height: ${(props: IPropsType) => {
    return props.theme.isEmbeddable ? '100%' :'70vh';
  }};
  ${(props: IPropsType) => props.theme.isEmbeddable ? 'height: 100%;' : ''}
  border: 1px solid #eaecf0;
  border-radius: 12px;
  box-shadow: 0px 8px 8px -4px rgba(16, 24, 40, 0.03),
    0px 20px 24px -4px rgba(16, 24, 40, 0.08);
  position: fixed;
  right: ${(props: IPropsType) => {
    return props.theme.isEmbeddable ? '0px' :'16px';
  }};
  bottom: ${(props: IPropsType) => {
    return props.theme.isEmbeddable ? '0vh' :'12vh';
  }};
  z-index: 100000000000;
  display: flex;
  flex-direction: column;

  @media only screen and (max-width: 1300px) {
    ${(props: IPropsType) => props.theme.isEmbeddable ? 'height: 100%;' : ''}
    width: ${(props: IPropsType) => {
      return props.theme.isEmbeddable ? '100%' :'480px';
    }};
  }

  @media only screen and (min-width: 1301px) {
    ${(props: IPropsType) => props.theme.isEmbeddable ? 'height: 100%;' : ''}
    ${(props: IPropsType) => props.theme.isEmbeddable ? 'width: 100%;' : ''}
  }

  @media only screen and (max-width: 1024px) {
    ${(props: IPropsType) => props.theme.isEmbeddable ? 'height: 100%;' : ''}
    width: ${(props: IPropsType) => {
      return props.theme.isEmbeddable ? '100%' :'480px';
    }};
  }

  @media only screen and (max-width: 650px) {
    width: ${(props: IPropsType) => {
      return props.theme.isEmbeddable ? '100%' :'80vw';
    }};
    height: ${(props: IPropsType) => {
      return props.theme.isEmbeddable ? '100%' :'100vh';
    }};
    position: fixed;
    right: 0px;
    bottom: 0px;
  }

  @media only screen and (max-width: 500px) {
    width: ${(props: IPropsType) => {
      return props.theme.isEmbeddable ? '100vw' :'100%';
    }};
    height: ${(props: IPropsType) => {
      return props.theme.isEmbeddable ? '100vh' :'100%';
    }};
    position: fixed;
    right: 0px;
    bottom: 0px;
  }
`;

const Info = styled.div`
  padding: 10px 20px 20px;
  gap: 10px;
  ${(props: IPropsType) => props.theme.isEmbeddable ? 'height: 100%;' : ''}
  border-radius: 12px;
  max-height: ${(props: IPropsType) => {
    return props.theme.isEmbeddable ? '100%' :'47vh';
  }};
  overflow: auto;
  background: white;
  /* border-radius: 8px; */

  @media only screen and (max-width: 650px) {
    height: ${(props: IPropsType) => {
      return props.theme.isEmbeddable ? '100%' :'100vh';
    }};
  }

  @media only screen and (max-width: 500px) {
    height: ${(props: IPropsType) => {
      return props.theme.isEmbeddable ? '100%' :'100vh';
    }};
  }
`;

const ZeonWidgetModal = () => {
  const wrapperRef = useRef(null);
  const { step, widgetDetails } = useWidget();
  const dispatch = useDispatch();
  
  const isEmbeddable:IEmbeddableOutput = useEmbeddable();
  useOutsideAlerter(wrapperRef, () => {
    dispatch(setShowWidget(false));
  });

  const getChannel = async (channelId:string) => {
    try {
      const res = await getChannelById(channelId);
      if (res.status != 200) {
        dispatch(setWidgetDetails(res.data.channel));
        getOpenTicketData();
      } else {
        // Handle Error here
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOpenTicketData();
  }, []);

  useEffect(() => {
    // get channelId from the invoke script of the widget
    (isEmbeddable?.channelId) && getChannel(isEmbeddable?.channelId as string);
  }, [isEmbeddable?.channelId]);


  const getOpenTicketData = async () => {
    const getWidgetId: any = localStorage.getItem("widgetId");
    if (getWidgetId) {
      const getData: any = await getOpenTicket(getWidgetId);
      // dispatch(setMessage(getData.data.ticket))
      dispatch(setAllOpenConversations(getData.data.ticket));
    } else {
      const widgetId = generateRandomString(6);
      localStorage.setItem("widgetId", widgetId);
    }
  };

  const showBrandingImage =
    widgetDetails?.appearance?.miscellaneous?.showBranding;

  const openZeon = () => {
    window.open("https://zeonhq.com", "_blank");
  };

  return (
    <>
      {widgetDetails?.channelId && (
        <Wrapper ref={wrapperRef}>
          {step === "chat" ? (
            <ZeonWidgetChat />
          ) : (
            <>
              <Header isForm={step === "form"} />
              <Info>
                {step === "initial" ? (
                  <ZeonWidgetCard />
                ) : step === "form" ? (
                  <ZeonWidgetForm />
                ) : (
                  <p> {step} </p>
                )}

                {showBrandingImage && (
                  <BrandingWrapper onClick={openZeon}>
                    <Text align="center" size="xs" color="gray">
                      Powered By
                    </Text>
                    <img
                      width={"60px"}
                      src="https://zeonhq.b-cdn.net/ZeonPowered.svg"
                      alt="zeon-logo"
                    />
                  </BrandingWrapper>
                )}
              </Info>
            </>
          )}
        </Wrapper>
      )}
    </>
  );
};

export default ZeonWidgetModal;
