import {
  Box,
  Button,
  Code,
  Flex,
  Grid,
  Space,
  Switch,
  Textarea,
} from "@mantine/core";
import { useClipboard, useInputState } from "@mantine/hooks";
import Heading from "components/details/inbox/component/Heading";
import GuideCards from "components/ui-components/workspaces/GuideCards";
import { getConfig as Config } from "config/Config";
import useDashboard from "hooks/useDashboard";
import styled from "styled-components";
import { docsArray } from "util/Constant";
import CopySVGIcon from "assets/copy_svg_icon.svg";
import { InfoContainer, WidgetContainer, Wrapper } from "../tabInfo.styles";
import Widget from "components/widget/Widget";
import Label from "components/ui-components/Label";
import { saveCustomPrompt } from "service/DashboardService";
import notification from "components/utils/notification";
import { showNotification } from "@mantine/notifications";
import { useEffect } from "react";

export const SnippetHeading = styled.p`
  color: #475467;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 18px; /* 150% */
`;

export const CodeBlockContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CodeBlockWrapper = styled.div`
  margin-top: 10px;
`;

const SwitchText = styled.p`
  color: rgb(52, 64, 84);
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
`;

const Deployment = () => {
  const clipboardChatWidgetCopy = useClipboard({ timeout: 500 });
  const clipboardEmbeddableTextCopy = useClipboard({ timeout: 500 });
  const { selectedPage, channelsInfo } = useDashboard();
  //useTextInput
  const [customPrompt, setCustomPrompt] = useInputState<string>("");
  const [checked, setChecked] = useInputState<boolean>(false);

  const channelId = channelsInfo[selectedPage.name]?.channelId;

  useEffect(() => {
    const customPromptValue = channelsInfo[selectedPage.name]?.customPrompt;
    const enableHumanHandover =
      channelsInfo[selectedPage.name]?.enableHumanHandover;

    setCustomPrompt(customPromptValue);
    setChecked(enableHumanHandover);
  }, []);

  const widgetChatEmbedding = `
    <!-- Add this in the body tag in your code -->
    <div id="zeon-widget" data-symbol=${channelId}></div>
    
    <!-- Add these two lines just before the closing body tag -->
    <link href="${Config("widgetCSSFile")}" rel="stylesheet"/>    
    <script src="${Config("widgetJSFile")}" async></script>
  `;

  const embeddSuportChatText = `
  <!-- Add this in the code -->
  <iframe style="height:100%; width:100%; border:none;" src="${Config(
    "CHAT_WIDGET_URL"
  )}/channel/${channelId}"></iframe>
`;

  const handleSaveCustomPrompt = async () => {
    try {
      const res = await saveCustomPrompt(channelId, customPrompt, checked);
      showNotification({
        title: "Notification",
        message: "Custom Prompt Saved",
      });
    } catch (error) {
      showNotification({
        title: "Notification",
        message: "Something went wrong",
        color: "red",
      });
    }
  };

  return (
    <>
      <Box>
        <Heading
          heading="Overview"
          subheading="Manage and add users to your chat channel."
        />
        <Wrapper>
          <InfoContainer>
            <Label text={"Craft your AI Agent’s persona here"} />
            <Textarea
              // description="Enter a description..."
              placeholder="Enter a description..."
              value={customPrompt}
              onChange={setCustomPrompt}
            />
            <Flex mt="md" justify="space-between" align="center" gap="10px">
              <Switch
                checked={checked}
                color="indigo"
                onChange={(event: any) =>
                  setChecked(event.currentTarget.checked)
                }
                label={<SwitchText>Enable Human handover</SwitchText>}
                labelPosition="right"
              />
              <Button
                type="button"
                onClick={handleSaveCustomPrompt}
                className="primary"
              >
                {" "}
                Save{" "}
              </Button>
            </Flex>

            <CodeBlockWrapper>
              <CodeBlockContainer>
                <SnippetHeading>Chat Widget</SnippetHeading>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Button
                    style={{
                      borderColor: "white",
                      margin: 0,
                      color: "#3054B9",
                      fontSize: "12px",
                      fontStyle: "normal",
                    }}
                    sx={{
                      "&:hover": {
                        backgroundColor: "white",
                      },
                    }}
                    onClick={() =>
                      clipboardChatWidgetCopy.copy(widgetChatEmbedding)
                    }
                    mt={20}
                    color="#3054B9"
                    variant="outline"
                    leftIcon={<img alt="copy" src={CopySVGIcon} />}
                  >
                    {clipboardChatWidgetCopy.copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </CodeBlockContainer>

              <Code
                mt={10}
                sx={(theme) => ({
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E0E4E7",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: 400,
                  "&:hover": {
                    backgroundColor: theme.colors.gray[1],
                  },
                })}
                color="red"
                p={10}
                block
              >
                {widgetChatEmbedding}
              </Code>
            </CodeBlockWrapper>

            <CodeBlockWrapper>
              <CodeBlockContainer>
                <SnippetHeading>Embedded Support Chat</SnippetHeading>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Button
                    style={{
                      borderColor: "white",
                      backgroundColor: "white",
                      color: "#3054B9",
                      fontSize: "12px",
                      fontStyle: "normal",
                    }}
                    onClick={() =>
                      clipboardEmbeddableTextCopy.copy(embeddSuportChatText)
                    }
                    color="#3054B9"
                    variant="outline"
                    leftIcon={<img alt="copy" src={CopySVGIcon} />}
                  >
                    {clipboardEmbeddableTextCopy.copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </CodeBlockContainer>

              <Code
                mt={10}
                sx={(theme) => ({
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E0E4E7",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: 400,
                  "&:hover": {
                    backgroundColor: theme.colors.gray[1],
                  },
                })}
                color="red"
                p={10}
                block
              >
                {embeddSuportChatText}
              </Code>
            </CodeBlockWrapper>
            <Grid>
              {docsArray.map((data) => {
                return (
                  <Grid.Col span={4}>
                    <GuideCards name={data.name} link={data.link} />
                  </Grid.Col>
                );
              })}
            </Grid>
          </InfoContainer>
          <WidgetContainer>
            <Widget configType="appearance" />
          </WidgetContainer>
        </Wrapper>
      </Box>
    </>
  );
};

export default Deployment;
