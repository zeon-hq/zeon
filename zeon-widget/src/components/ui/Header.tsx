import { Avatar, Button } from "@mantine/core";
import axios from "axios";
import useWidget from "components/hooks/useWidget";
import { Text } from "components/ui-components/uStyleComponents";
import { AiOutlineArrowLeft, AiOutlineClose } from "react-icons/ai";
import { BsChatLeftDots } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { setShowWidget, setStep } from "redux/slice";
import styled from "styled-components";
import { getConfig as Config } from "../../config/Config";

//@ts-ignore
const Wrapper = styled.div`
  /* height: 25%; */
  background-color: ${(props: { bg: string }) => props.bg};
  color: white;
  padding: 24px 24px 0px 24px;
  border-radius: 12px;
  position: sticky;
  top: 0;
  z-index: 10000000;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  &:hover {
    cursor: pointer;
  }
`;

const Header = ({ isForm }: { isForm: boolean }) => {
  const dispatch = useDispatch();
  const { widgetDetails } = useWidget();

  return (
    <Wrapper
    //@ts-ignore
      stroke={widgetDetails?.appearance.widgetHeaderSection.strokeColor}
      bg={widgetDetails?.appearance.widgetHeaderSection.topBannerColor}
    >
      <IconContainer>
        <div>
          {!isForm && (
            <Avatar
              onClick={() => dispatch(setStep("initial"))}
              src={
                widgetDetails?.appearance.widgetHeaderSection.topLogo ||
                "https://zeonhq.b-cdn.net/ZeonPowered.svg"
              }
            />
          )}
          {isForm && (
            <AiOutlineArrowLeft
              onClick={() => dispatch(setStep("initial"))}
              size={"1rem"}
              color={widgetDetails?.appearance.widgetHeaderSection.textColor}
            />
          )}
        </div>
      </IconContainer>

      <Text
        color={widgetDetails?.appearance.widgetHeaderSection.textColor}
        size="large"
        weight="bold"
      >
        {" "}
        {widgetDetails?.appearance.widgetHeaderSection.mainHeading}{" "}
      </Text>

      <Text
        color={widgetDetails?.appearance.widgetHeaderSection.textColor}
        size="medium"
        weight="normal"
      >
        {" "}
        {widgetDetails?.appearance.widgetHeaderSection.subHeading}{" "}
      </Text>

      {!isForm && (
        <Button
          mt={16}
          onClick={()=>{
            localStorage.setItem("usci", widgetDetails?.channelId);
            dispatch(setStep("form"));
          }}
          style={{
            backgroundColor:
              widgetDetails?.appearance.newConversationButton.buttonColor,
            borderRadius: "8px",
          }}
          leftIcon={<BsChatLeftDots size={15} />}
        >
          {" "}
          {widgetDetails?.appearance.newConversationButton.title}
        </Button>
      )}
    </Wrapper>
  );
};

export default Header;
