import { Box, Button, Code, Grid, Space, Text } from "@mantine/core"
import { useClipboard } from "@mantine/hooks"
import Heading from "components/details/inbox/component/Heading"
import GuideCards from "components/ui-components/workspaces/GuideCards"
import { getConfig as Config } from "config/Config"
import useDashboard from "hooks/useDashboard"
import { Copy } from "tabler-icons-react"
import { docsArray } from "util/Constant"

type Props = {}

const Deployment = (props: Props) => {
  const clipboard = useClipboard({ timeout: 500 })
  const { workspaceInfo } = useDashboard()
  const { selectedPage, channelsInfo } = useDashboard()

  const handleIntegrateSlack = () => {
    if (channelsInfo[selectedPage.name]?.channelId) return
    localStorage.setItem(
      "userstak-dashboard-workspaceId",
      workspaceInfo.workspaceId || ""
    )
    window.open(
      "https://slack.com/oauth/v2/authorize?client_id=3769512251410.4269280938033&scope=channels:history,channels:join,channels:read,chat:write,incoming-webhook,users.profile:read&user_scope=",
      "_blank"
    )
  }

  const scriptToAttach = `
    <!-- Add this in the body tag in your code -->
    <div id="zeon-widget" data-symbol=${
      channelsInfo[selectedPage.name]?.channelId
    }></div>
    
    <!-- Add these two lines just before the closing body tag -->
    <link href="${Config("widgetCSSFile")}" rel="stylesheet"/>    
    <script src="${Config("widgetJSFile")}" async></script>
  `

  return (
    <>
      <Box mt={20}>
        <Heading
          heading="Deployment"
          subheading="Deploy Zeon on your website"
        />
        <Code
          mt={20}
          sx={(theme) => ({
            backgroundColor: "#F1F3F5",
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
          color="dark"
          variant="outline"
          leftIcon={<Copy />}
        >
          {clipboard.copied ? "Copied" : "Copy Snippet"}
        </Button>
        <Space h={25} />
        <Text color="#344054" size="sm" weight="500">
          {" "}
          Deployment Guide{" "}
        </Text>
        <Space h={15} />
        <Grid>
          {docsArray.map((data) => {
            return (
              <Grid.Col span={4}>
                <GuideCards name={data.name} link={data.link} />
              </Grid.Col>
            )
          })}
        </Grid>
      </Box>
    </>
  )
}

export default Deployment
