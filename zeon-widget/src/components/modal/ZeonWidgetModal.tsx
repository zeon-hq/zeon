import { Text } from "@mantine/core";
import { IPropsType } from "components/chat/Chat.types";
import ZeonWidgetChat from "components/chat/ZeonWidgetChat";
import useOutsideAlerter from "components/hooks/useOutsideAlerter";
import useWidget from "components/hooks/useWidget";
import { BrandingWrapper } from "components/ui-components/uStyleComponents";
import Header from "components/ui/Header";
import ZeonWidgetCard from "components/ui/ZeonWidgetCard";
import ZeonWidgetForm from "components/ui/ZeonWidgetForm";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { IUIStepType, setMessage, setShowWidget, setStep } from "redux/slice";
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
  border: 1px solid #EAECF0;
  border-radius: 12px;
  box-shadow: 0 8px 8px -4px rgba(16, 24, 40, 0.03), 0 20px 24px -4px rgba(16, 24, 40, 0.08);
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
  padding:16px;

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
  
  useOutsideAlerter(wrapperRef, () => {
    dispatch(setShowWidget(false));
    dispatch(setMessage([]))
    dispatch(setStep(IUIStepType.INITIAL))
    localStorage.removeItem("ticketId");
  });


  useEffect(() => {
    const handleBeforeUnload = (e:any) => {
    console.log('Page is reloading...');  // Log to console
    dispatch(setShowWidget(false));
    dispatch(setMessage([]))
    dispatch(setStep(IUIStepType.INITIAL))
    localStorage.removeItem("ticketId");
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function to remove the event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);


  const showBrandingImage =
    widgetDetails?.appearance?.miscellaneous?.showBranding;

  const openZeon = () => {
    window.open("https://zeonhq.com", "_blank");
  }

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
                {step === IUIStepType.INITIAL ? (
                  <ZeonWidgetCard />
                  ) : step === IUIStepType.FORM ? (
                    <ZeonWidgetForm />
                    ) : (
                  <p> {step} </p>
                )}

              </Info>
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
            </>
          )}
        </Wrapper>
      )}
    </>
  );
};

export default ZeonWidgetModal;
