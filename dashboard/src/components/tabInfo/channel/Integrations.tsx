import { Text, Button, Divider, Flex, Box, Space } from "@mantine/core";
import { BrandSlack, Plus } from "tabler-icons-react";
import useDashboard from "hooks/useDashboard";
import Heading from "components/details/inbox/component/Heading";
import { getConfig as Config } from "config/Config"

const Integrations = () => {
  const { workspaceInfo } = useDashboard();
  const { selectedPage, channelsInfo } = useDashboard();
  const handleIntegrateSlack = () => {
    const slackRedirectionUrl = Config("SLACK_REDIRECTION_URL");
    const currentUrl = window.location.href;
    // Construct the state object with accountId and currentUrl
    const stateObject = {
      currentUrl: currentUrl,
      authToken: 'Bearer ' + localStorage.getItem('at'),
      channelId:localStorage.getItem('userstak-dashboard-channelId')
    };

    const stateParameter = encodeURIComponent(JSON.stringify(stateObject));

    // if (channelsInfo[selectedPage.name]?.channelId) return;
    localStorage.setItem(
      "userstak-dashboard-workspaceId",
      workspaceInfo.workspaceId || ""
    );

    const slackClientId = process.env.REACT_APP_SLACK_CLIENT_ID;
    const url = `https://slack.com/oauth/v2/authorize?state=${stateParameter}&redirect_uri=${slackRedirectionUrl}&client_id=${slackClientId}&scope=channels:read,chat:write,chat:write.customize,chat:write.public,groups:read,users:read,users:read.email,files:read,files:write,channels:history,channels:join,incoming-webhook,users.profile:read&user_scope=`;
    window.open(
      url,
      "_blank"
    );

  };
  // https://slack.com/oauth/v2/authorize?client_id=3769512251410.4269280938033&scope=channels:history,channels:join,incoming-webhook,users.profile:read&user_scope=

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
                Slack New Ticket Notification{" "}
              </Text>
              <Text color="#475467" weight="400" size="14px">
                {" "}
                Receive new ticket notifications directly in your slack channel.
                Your slack channel must be set to public.{" "}
              </Text>
            </Box>
          
            <Button
              radius="sm"
              onClick={handleIntegrateSlack}
              // disabled={!!channelsInfo[selectedPage.name]?.channelId}
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
                Slack 2-Way Sync{" "}
              </Text>
              <Text color="#475467" weight="400" size="14px">
                {" "}
                Send incoming conversations and respond to them within slack as
                threads{" "}
              </Text>
            </Box>
          
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