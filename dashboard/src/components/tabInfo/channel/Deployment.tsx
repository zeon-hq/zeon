import { Box, Button, Code, Grid, Space, Text } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import Heading from "components/details/inbox/component/Heading";
import GuideCards from "components/ui-components/workspaces/GuideCards";
import { getConfig as Config } from "config/Config";
import useDashboard from "hooks/useDashboard";
import { Copy } from "tabler-icons-react";
import { docsArray } from "util/Constant";


const Deployment = () => {
  const clipboard = useClipboard({ timeout: 500 });
  const { selectedPage, channelsInfo } = useDashboard();


  const scriptToAttach = `
    <!-- Add this in the body tag in your code -->
    <div id="zeon-widget" data-symbol=${
      channelsInfo[selectedPage.name]?.channelId
    }></div>
    
    <!-- Add these two lines just before the closing body tag -->
    <link href="${Config("widgetCSSFile")}" rel="stylesheet"/>    
    <script src="${Config("widgetJSFile")}" async></script>
  `;

  return (
    <>
      <Box>
        <Heading
          heading="Deployment"
          subheading="Deploy Zeon chat widget on your website"
        />
        <Code
          mt={20}
          sx={(theme) => ({
            backgroundColor: "#F9FAFB",
            border: "1px solid #E0E4E7",
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
          {scriptToAttach}
        </Code>
        <Button
          radius="md"
          onClick={() => clipboard.copy(scriptToAttach)}
          mt={20}
          color="#3054B9"
          variant="default"
          leftIcon={<Copy />}
        >
          {clipboard.copied ? "Copied" : "Copy Snippet"}
        </Button>
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
