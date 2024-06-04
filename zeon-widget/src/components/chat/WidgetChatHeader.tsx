import { Button } from "@mantine/core";
import useWidget from "components/hooks/useWidget";
import { AiOutlineArrowLeft } from "components/icons/icons";
import { useDispatch } from "react-redux";
import { IUIStepType, setMessage, setStep } from "redux/slice";
import styled from "styled-components";

const Wrapper = styled.div`
  background-color: ${(props: { bg: string }) => props.bg};
  color: white;
  position: sticky;
  top: 0;
  border-radius: 12px 12px 0px 0px;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 23px;
  &:hover {
    cursor: pointer;
  }
`;

const WidgetChatHeader = () => {
  const dispatch = useDispatch();
  const { widgetDetails } = useWidget();
  const handleBackClick = () => {
    dispatch(setStep(IUIStepType.INITIAL));
    dispatch(setMessage([]));
  };

  return (
    <Wrapper bg={widgetDetails?.appearance?.widgetHeaderSection?.topBannerColor}>
      <IconWrapper>
        <Button
          onClick={handleBackClick}
          variant="outline"
          color="dark"
          radius="md"
          leftIcon={<AiOutlineArrowLeft color={widgetDetails?.appearance.widgetHeaderSection.textColor || "black"} size={"1rem"}/>}>
          Go Back
        </Button>
      </IconWrapper>
    </Wrapper>
  );
};

export default WidgetChatHeader;
