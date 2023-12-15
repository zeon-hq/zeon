import { Text, Button, Divider, Flex, Box, Space } from "@mantine/core";
import { BrandSlack, Plus } from "tabler-icons-react";
import useDashboard from "hooks/useDashboard";
import Heading from "components/details/inbox/component/Heading";

type Props = {};

const Integrations = (props: Props) => {
  const { workspaceInfo } = useDashboard();
  const { selectedPage, channelsInfo } = useDashboard();
  const handleIntegrateSlack = () => {
    if (channelsInfo[selectedPage.name]?.channelId) return;
    localStorage.setItem(
      "userstak-dashboard-workspaceId",
      workspaceInfo.workspaceId || ""
    );
    window.open(
      "https://slack.com/oauth/v2/authorize?client_id=3769512251410.4269280938033&scope=channels:history,channels:join,channels:read,chat:write,incoming-webhook,users.profile:read&user_scope=",
      "_blank"
    );
  };

  return (
    <div>
      <Heading
        heading="Integrations"
        subheading="Supercharge your workflow and connect the tools you use every day."
      />
      <Space h={20} />
      {
        <Flex gap="32px" align="center" justify="space-between">
          <Flex gap="16px">
            <Flex align="center">
              <BrandSlack size={30} />
            </Flex>

            <Box>
              <Text weight="600" size="14px">
                {" "}
                Slack{" "}
              </Text>
              <Text color="#475467" weight="400" size="14px">
                {" "}
                Send incoming conversations and respond to them within slack as
                threads{" "}
              </Text>
            </Box>
          </Flex>
          <Flex gap="16px">
            <Button
              radius="sm"
              onClick={handleIntegrateSlack}
              disabled={!!channelsInfo[selectedPage.name]?.channelId}
              leftIcon={<Plus />}
              sx={{ backgroundColor: "#F5F8FF", color: "#3054B9" }}
            >
              {" "}
              {channelsInfo[selectedPage.name]?.channelId
                ? "Disconnect"
                : "Connect"}{" "}              
            </Button>
          </Flex>
          <Flex gap="16px">
            <Flex align="center">
              <BrandSlack size={30} />
            </Flex>

            <Box>
              <Text weight="600" size="14px">
                {" "}
                Slack{" "}
              </Text>
              <Text color="#475467" weight="400" size="14px">
                {" "}
                Send incoming conversations and respond to them within slack as
                threads{" "}
              </Text>
            </Box>
          </Flex>
          <Flex gap="16px">
            <Button
              radius="sm"
              onClick={handleIntegrateSlack}
              disabled={!!channelsInfo[selectedPage.name]?.channelId}
              leftIcon={<Plus />}
              sx={{ backgroundColor: "#F5F8FF", color: "#3054B9" }}
            >
              {" "}
              {channelsInfo[selectedPage.name]?.channelId
                ? "Disconnect"
                : "Connect"}{" "}
            </Button>
          </Flex>
        </Flex>
      }
    </div>
  );
};

export default Integrations;
