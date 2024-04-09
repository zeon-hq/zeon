import { Button, Card, Flex, Text, Textarea } from "@mantine/core";
import useDashboard from "hooks/useDashboard";
import styled from "styled-components";
import ChatWidgetCard from "./ChatWidgetCard";
import { BsChatLeftDots } from "react-icons/bs";
import MessageCard from "./MessageCard";

const BrandingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;

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
      {/* <Button
        style={{
          backgroundColor: appearenceDetails.newConversationButton.buttonColor,
          borderRadius: "8px",
        }}
        leftIcon={<BsChatLeftDots size={15} />}
      >
        {appearenceDetails.newConversationButton.title}
      </Button> */}
      <MessageCard text={appearenceDetails.widgetHeaderSection.subHeading} />
      <ChatWidgetCard heading={'Ticket Number: 32343'} text={'Oliver: Hello, how are you doing..'} />
      <ChatWidgetCard heading={'Ticket Number: 12343'} text={'Oliver: Hey! Can you look into this?'} />
      {/* {inChatWidgets.map((widget, index) => (
        <ChatWidgetCard key={index} heading={widget.title} text={widget.subTitle} link={widget.link} />
      ))} */}
      <Textarea mt="md" placeholder="Enter your message"/>
      <Flex
       justify="space-between"
        align="center"
        mt="md"
      >
        {appearenceDetails?.miscellaneous?.showBranding ? (
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
        ) : (
          <div></div>
        )
      }
        <Button
          radius="md"
          className="primary"
          
          style={{
            backgroundColor: appearenceDetails.newConversationButton.buttonColor,
          }}
          
        >
          {" "}
          Submit{" "}
        </Button>
      </Flex>
    </Card.Section>
  );
};

export default AppearenceWidgetContent;