//@ts-nocheck
import { Avatar, Box, Button, Flex, Text } from "@mantine/core";
import useWidget from "components/hooks/useWidget";
import styled from "styled-components";
import {
  BsDiscord,
  BsSlack,
  BsTwitter,
  BsWhatsapp,
  BsYoutube
} from "react-icons/bs";
import {IoCalendarNumberOutline} from "react-icons/io5"
import { Book } from "tabler-icons-react";
import MessageCard from "./MessageCard";


const Wrapper = styled.div`
  /* height: 25%; */
  background-color: ${(props: { bg: string }) => props.bg};
  color: white;
  border-radius: 12px;
  position: sticky;
  top: 0;
  z-index: 10000000;
`;

const getIcons = (type: string) => {
  switch (type) {
    case "docs":
      return <Book />;
    case "discord":
      return <BsDiscord />;
    case "slack":
      return <BsSlack />;
    case "twitter":
      return <BsTwitter />;
    case "whatsapp":
      return <BsWhatsapp />;
    case "youtube":
      return <BsYoutube />;
    case "calendar":
      return <IoCalendarNumberOutline />;
    default:
      return <Book />;
  }
};

const Header = ({ isForm }: { isForm: boolean }) => {
  const { widgetDetails } = useWidget();

  return (
    <Wrapper
    //@ts-ignore
      stroke={widgetDetails?.appearance.widgetHeaderSection.strokeColor}
      bg={widgetDetails?.appearance.widgetHeaderSection.topBannerColor}
    >
      {/* <IconContainer>
        <div>
          {!isForm && (
            <Avatar
              onClick={() => dispatch(setStep(IUIStepType.INITIAL))}
              src={
                widgetDetails?.appearance.widgetHeaderSection.topLogo ||
                "https://zeonhq.b-cdn.net/ZeonPowered.svg"
              }
            />
          )}
          {isForm && (
            <AiOutlineArrowLeft
              onClick={() => dispatch(setStep(IUIStepType.INITIAL))}
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
            localStorage.setItem("channelId", widgetDetails?.channelId);
            dispatch(setStep(IUIStepType.FORM));
          }}
          style={{
            backgroundColor:
              widgetDetails?.appearance?.newConversationButton?.buttonColor,
            borderRadius: "8px",
          }}
          leftIcon={<BsChatLeftDots size={15} />}
        >
          {" "}
          {widgetDetails?.appearance?.newConversationButton?.title}
        </Button>
      )} */}
      <Box>
          <Flex justify="center" align="center" mb="lg" gap="4px">
            <Box>
              <img
                height={"35px"}
                src={widgetDetails?.appearance?.widgetHeaderSection?.topLogo}
                alt="zeon-logo"
              />
            </Box>
            {/* <Text weight={"bolder"} size={"xl"}>
              {" "}
              Zeon{" "}
            </Text> */}
          </Flex>
          {widgetDetails?.appearance?.userAvatars?.enableUserAvatars && (
            <Avatar.Group
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {widgetDetails?.appearance?.userAvatars?.userAvatarsLinks.slice(0, 4)
                ?.filter((avatar) => avatar.enabled)
                .map((avatar, index) => (
                  <Avatar
                    key={index}
                    src={avatar.link}
                    color="cyan"
                    radius="xl"
                  />
                ))}
              <Avatar radius="xl">
                {widgetDetails?.appearance?.userAvatars?.additonalUserAvatars}
              </Avatar>
            </Avatar.Group>
          )}

          <Text
            weight="600"
            style={{ fontSize: "16px", marginTop: "10px", color: "#101828" }}
            align="center"
          >
            {widgetDetails?.appearance?.widgetHeaderSection?.mainHeading || "Chat with us "}
          </Text>
          <Text
            size="md"
            weight="400"
            style={{
              fontSize: "12px",
              color: "rgb(71, 84, 103)",
              marginTop: "4px",
              display: "flex",
              justifyContent: "center",
              gap: "6px",
              alignItems: "center",
            }}
            align="center"
          >
            <div
              style={{
                height: "10px",
                width: "10px",
                borderRadius: "50%",
                backgroundColor: "#12B76A",
              }}
            ></div>{" "}
            Online now{" "}
          </Text>
          <Flex justify="center" align="center" mb="sm" gap={"16px"} mt="sm">
            {widgetDetails?.inChatWidgets
              .filter((widget) => widget.enabled)
              .map((widget, index) => (
                <Button
                  key={index}
                  fullWidth
                  leftIcon={getIcons(widget.topLogo)}
                  variant="outline"
                  sx={{
                    border: "1px solid #D0D5DD !important",
                    color: "#344054",
                  }}
                  onClick={() => {
                    window.open(widget.link, "_blank");
                  }
                  }
                >
                  {widget.title}
                </Button>
              ))}
          </Flex>
        </Box>
        <MessageCard type="received" time={new Date()} text={widgetDetails?.appearance.widgetHeaderSection.subHeading} />
    </Wrapper>
  );
};

export default Header;
