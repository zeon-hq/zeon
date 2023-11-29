import { Button, Card, Text } from "@mantine/core";
import useDashboard from "hooks/useDashboard";
import styled from "styled-components";
import ChatWidgetCard from "./ChatWidgetCard";
import { BsChatLeftDots } from "react-icons/bs";

const BrandingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  margin-top: 16px;
  &:hover {
    cursor: pointer;
  }
`;

const AppearenceWidgetContent = () => {
  const { channelsInfo, selectedPage } = useDashboard();
  const appearenceDetails = channelsInfo[selectedPage.name]?.appearance;
  const inChatWidgets = channelsInfo[selectedPage.name]?.inChatWidgets;

  return (
    <Card.Section>
      <Button
        style={{
          backgroundColor: appearenceDetails.newConversationButton.buttonColor,
          borderRadius: "8px",
        }}
        leftIcon={<BsChatLeftDots size={15} />}
      >
        {appearenceDetails.newConversationButton.title}
      </Button>
      <Text size="sm" weight={500} mt="16px">
        {" "}
        Open Tickets{" "}
      </Text>
        <ChatWidgetCard heading={'Ticket Number: 32343'} text={'Oliver: Hello, how can i help you ?'} />
      <Text size="sm" weight={500} mt="16px">
        {" "}
        Resources{" "}
      </Text>
      {inChatWidgets.map((widget, index) => (
        <ChatWidgetCard key={index} heading={widget.title} text={widget.subTitle} link={widget.link} />
      ))}
      {appearenceDetails?.miscellaneous?.showBranding && (
        <BrandingWrapper
          onClick={() => window.open("https://zeonhq.com", "_blank")}
        >
          <Text align="center" size="xs" color="gray">
            {" "}
            Powered By
          </Text>
          <img
            width={"60px"}
            src="https://zeonhq.b-cdn.net/ZeonPowered.svg"
            alt="zeon-logo"
          />
        </BrandingWrapper>
      )}
    </Card.Section>
  );
};

export default AppearenceWidgetContent;