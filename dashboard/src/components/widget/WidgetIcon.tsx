import useDashboard from "hooks/useDashboard";
import styled from "styled-components";
import WidgetChatIcon from "assets/widgetChatIcon.svg";

interface StyledButtonProps {
  backgroundColor?: string;
}

const StyledButton = styled.div<StyledButtonProps>`
  padding: 10px;
  border-radius: 10px;
  background-color: ${(props) => props.backgroundColor || "#1457ff"};
  display: flex;
  width: 55px;
  float: right;
  margin-top: 20px;
`;

const WidgetIcon = () => {
  const { channelsInfo, selectedPage } = useDashboard();
  const appearenceDetails = channelsInfo[selectedPage.name]?.appearance;

  return (
    <StyledButton
      backgroundColor={appearenceDetails?.widgetButtonSetting.widgetButtonColor}
    >
      <img
        width={"35px"}
        src={WidgetChatIcon}
        alt="wserstak-widget"
      />
    </StyledButton>
  );
};

export default WidgetIcon;
