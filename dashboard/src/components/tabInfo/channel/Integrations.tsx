import { Text, Button, Divider, Flex, Box, Space } from "@mantine/core"
import { BrandSlack, Plus } from "tabler-icons-react"
import useDashboard from "hooks/useDashboard"
import Heading from "components/details/inbox/component/Heading"

type Props = {}

const Integrations = (props: Props) => {
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

  return (
    <div>
      <Space h="20px" />
      <Heading
        heading="Integrations"
        subheading="Supercharge your workflow and connect the tools you use every day."
      />

      <Flex align="center" justify="space-between">
        <Flex gap="10px">
          <Flex align="center">
            <BrandSlack size={30} />
          </Flex>

          <Box>
            <Text weight="600" size="lg">
              {" "}
              Slack{" "}
            </Text>
            <Text color="#475467">
              {" "}
              Send incoming conversations and respond to them within slack as
              threads{" "}
            </Text>
          </Box>
        </Flex>
        <Flex gap="10px">
          <Button radius="md" color="dark" variant="outline">
            Read Docs
          </Button>
          <Button
            radius="md"
            onClick={handleIntegrateSlack}
            disabled={!!channelsInfo[selectedPage.name]?.channelId}
            leftIcon={<Plus />}
            sx={{ backgroundColor: "#F5F8FF", color: "#3054B9" }}
          >
            {" "}
            {channelsInfo[selectedPage.name]?.channelId
              ? "Slack channel added"
              : "Integrate to slack "}{" "}
          </Button>
        </Flex>
      </Flex>
    </div>
  )
}

export default Integrations
