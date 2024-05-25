import { Avatar, Button, Text, Box, Flex } from "@mantine/core";
import useDashboard from "hooks/useDashboard";
import styled from "styled-components";
import AppearenceWidgetContent from "./AppearenceWidgetContent";
import BehaviorWidgetContent from "./BehaviorWidgetContent";
import WidgetIcon from "./WidgetIcon";
import {
  BsDiscord,
  BsSlack,
  BsTwitter,
  BsWhatsapp,
  BsYoutube,
} from "react-icons/bs";
import { Book } from "tabler-icons-react";

type Props = {
  configType: "appearance" | "behavior" | "inChatWidgets";
};

const ModalWrapper = styled.div`
  /* TODO: Discuss with ajay if we need fixed height or thr height should depend upon content */
  /* height: 92vh; */
  /* width: 400px; */
  height: 650px;
  border: 1px solid #eaecf0;
  border-radius: 8px 8px 8px 8px;
  // box-shadow: rgb(0 0 0 / 35%) 0px 7px 59px;
  box-shadow: 0 8px 8px -4px rgba(16, 24, 40, 0.03),
    0 20px 24px -4px rgba(16, 24, 40, 0.08);
  /* right: 16px;
  bottom: 12vh; */
  z-index: 100000000000;
  display: flex;
  flex-direction: column;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media only screen and (max-width: 1300px) {
    width: 350px;
  }

  @media only screen and (max-width: 1024px) {
    width: 350px;
  }

  @media only screen and (max-width: 650px) {
    width: 80vw;
    max-height: 100vh;
    position: relative;
    right: 0px;
    bottom: 0px;
  }

  @media only screen and (max-width: 500px) {
    width: 100vw;
    max-height: 100vh;
    position: relative;
    right: 0px;
    bottom: 0px;
  }
`;

const Info = styled.div`
  gap: 10px;
  max-height: 56vh;
  overflow: auto;
  background: white;
  border-radius: 8px;

  @media only screen and (max-width: 650px) {
    max-height: 100vh;
  }

  @media only screen and (max-width: 500px) {
    max-height: 100vh;
  }
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
    default:
      return <Book />;
  }
};

const Widget = ({ configType }: Props) => {
  const { channelsInfo, selectedPage } = useDashboard();
  const appearenceDetails = channelsInfo[selectedPage.name]?.appearance;
  const inChatWidgets = channelsInfo[selectedPage.name]?.inChatWidgets;
  const topLogo = appearenceDetails?.widgetHeaderSection?.topLogo;
  return (
    <>
      <ModalWrapper>
        <Box>
          <Flex justify="center" align="center" mb="lg" gap="4px">
            <Box>
              <img
                width={"40px"}
                src={topLogo || "https://zeon-assets.s3.ap-south-1.amazonaws.com/Logomark.svg"}
                alt="zeon-logo"
              />
            </Box>
            <Text weight={"bolder"} size={"xl"}>
              {" "}
              Zeon{" "}
            </Text>
          </Flex>
          {appearenceDetails?.userAvatars?.enableUserAvatars && (
            <Avatar.Group
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {appearenceDetails?.userAvatars?.userAvatarsLinks
                .filter((avatar) => avatar.enabled)
                .map((avatar, index) => (
                  <Avatar
                    key={index}
                    src={avatar.link}
                    color="cyan"
                    radius="xl"
                  />
                ))}
              <Avatar radius="xl">
                +{appearenceDetails?.userAvatars?.additonalUserAvatars}
              </Avatar>
            </Avatar.Group>
          )}

          <Text
            weight="600"
            style={{ fontSize: "16px", marginTop: "10px", color: "#101828" }}
            align="center"
          >
            {" "}
            Chat with us{" "}
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
          <Flex justify="center" align="center" gap={"16px"} mt="sm">
            {inChatWidgets
              .filter((widget) => widget.enabled)
              .map((widget, index) => (
                <Button
                  fullWidth
                  key={index}
                  leftIcon={getIcons(widget.topLogo)}
                  variant="outline"
                  sx={{
                    border: "1px solid #D0D5DD",
                    color: "#344054",
                  }}
                >
                  {widget.title}
                </Button>
              ))}
          </Flex>
        </Box>
        {/* <Space h={50}></Space> */}
        <Info>
          {configType === "appearance" ? (
            <AppearenceWidgetContent />
          ) : configType === "behavior" ? (
            <BehaviorWidgetContent />
          ) : (
            // <AppearenceWidgetContent />
            <></>
          )}
        </Info>
      </ModalWrapper>
      <WidgetIcon />
    </>
  );
};

export default Widget;
