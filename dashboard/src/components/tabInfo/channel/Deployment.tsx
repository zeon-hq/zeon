import { Box, Button, Code, Flex, Grid, Space } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import Heading from "components/details/inbox/component/Heading";
import GuideCards from "components/ui-components/workspaces/GuideCards";
import { getConfig as Config } from "config/Config";
import useDashboard from "hooks/useDashboard";
import styled from "styled-components";
import { docsArray } from "util/Constant";
import CopySVGIcon from "assets/copy_svg_icon.svg";

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

const Deployment = () => {
  const clipboardChatWidgetCopy = useClipboard({ timeout: 500 });
  const clipboardEmbeddableTextCopy = useClipboard({ timeout: 500 });
  const { selectedPage, channelsInfo } = useDashboard();

  const channelId = channelsInfo[selectedPage.name]?.channelId;

  const widgetChatEmbedding = `
    <!-- Add this in the body tag in your code -->
    <div id="zeon-widget" data-symbol=${
      channelId
    }></div>
    
    <!-- Add these two lines just before the closing body tag -->
    <link href="${Config("widgetCSSFile")}" rel="stylesheet"/>    
    <script src="${Config("widgetJSFile")}" async></script>
  `;
  
  const embeddSuportChatText = `
  <!-- Add this in the code -->
  <iframe style="height:100%; width:100%; border:none; background-color:white;" src="${Config("CHAT_WIDGET_URL")}/channel/${channelId}"></iframe>
`;

  return (
    <>
      <Box>
        <Heading
          heading="Deployment"
          subheading="Deploy Zeon chat widget on your website"
        />
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
                    backgroundColor: 'white',
                  }
                }}
                onClick={() => clipboardChatWidgetCopy.copy(widgetChatEmbedding)}
                mt={20}
                color="#3054B9"
                variant="outline"
                leftIcon={<img src={CopySVGIcon} />}
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
                onClick={() => clipboardEmbeddableTextCopy.copy(embeddSuportChatText)}
                color="#3054B9"
                variant="outline"
                leftIcon={<img src={CopySVGIcon} />}
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

        <Space h={20} />
        <Grid>
          {docsArray.map((data) => {
            return (
              <Grid.Col span={4}>
                <GuideCards name={data.name} link={data.link} />
              </Grid.Col>
            );
          })}
        </Grid>
      </Box>
    </>
  );
};

export default Deployment;
