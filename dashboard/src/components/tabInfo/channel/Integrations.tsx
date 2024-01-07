import { Text, Button, Divider, Flex, Box, Space } from "@mantine/core";
import { BrandSlack, Plus } from "tabler-icons-react";
import useDashboard from "hooks/useDashboard";
import Heading from "components/details/inbox/component/Heading";
import { getConfig as Config } from "config/Config"
import SlackIntegrationSVG from "assets/slack_integration_svg.svg";
import SlackDisableIntegration from "assets/slack_disable_icon.svg";
import SlackIntegrationEnable from "assets/slack_svg_enable.svg";
import EmailNewTicket from "assets/email_new_ticket.svg";
import { showNotification } from "@mantine/notifications"
import { useDispatch } from "react-redux";
import { updateChannel, uploadFile } from "service/DashboardService";
import { updateEmailTicketCreateNotification } from "reducer/slice";
const Integrations = () => {
  const dispatch = useDispatch();
  const { workspaceInfo } = useDashboard();
  const { selectedPage, channelsInfo } = useDashboard();
  const handleIntegrateSlack = () => {
    const slackRedirectionUrl = Config("API_DOMAIN") + "/oauth/slack/authorize";
    const currentUrl = window.location.href;
    // Construct the state object with accountId and currentUrl
    const stateObject = {
      currentUrl: currentUrl,
      authToken: 'Bearer ' + localStorage.getItem('at'),
      channelId:localStorage.getItem('userstak-dashboard-channelId')
    };

    const stateParameter = encodeURIComponent(JSON.stringify(stateObject));

    // if (channelsInfo[selectedPage.name]?.channelId) return;
    console.log('channelinfo', channelsInfo);
    
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

  const handleEmailTicketIntegration = async () => {
    const emailUpdatePayload = {emailNewTicketNotification:channelsInfo[selectedPage.name]?.emailNewTicketNotification ? false: true};
    await dispatch(updateEmailTicketCreateNotification(emailUpdatePayload));
    await updateChannel(
      channelsInfo[selectedPage.name].channelId,
      {...channelsInfo[selectedPage.name],...emailUpdatePayload}
    );
    showNotification({
      title: "Notification",
      message: "Saved Successfully",
    });
  }

  return (
    <div>
      <Heading
        heading="Integrations"
        subheading="Supercharge your workflow and connect the tools you use every day."
      />
      <Space h={20} />
      {
        <Flex gap="32px" align="center" justify="space-between">
          <Flex gap="16px" p={'14px'} style={{
            borderRadius: '4px',
            border: '1px solid #E5E5E5'
          }}>
            <Flex align="center">
              <img src={EmailNewTicket} />
            </Flex>

            <Box>
              <Text weight="600" size="14px">
              New Ticket Notification{" "}
              </Text>
              <Text color="#475467" weight="400" size="14px">
                {`Receive new ticket notifications directly in your e-mail. Enabling this sends new ticket e-mail to all channel participants.`}
              </Text>
            </Box>
          
            <Button
              style={{
                borderColor: "white",
                backgroundColor: "white",
                color: channelsInfo[selectedPage.name]?.emailNewTicketNotification ? "#B42318":"#3054B9",
                fontSize: "12px",
                fontStyle: "normal",
              }}
              onClick={async()=>{
                await handleEmailTicketIntegration()
              }}
              leftIcon={channelsInfo[selectedPage.name]?.emailNewTicketNotification ? <img src={SlackDisableIntegration} />: <img src={SlackIntegrationEnable} />}
            >
              {" "}
              {channelsInfo[selectedPage.name]?.emailNewTicketNotification
                ? "Disable":'Enable'}
            </Button>
          </Flex>

          <Flex gap="16px" p={'14px'} style={{
            borderRadius: '4px',
            border: '1px solid #E5E5E5'
          }}>
            <Flex align="center">
              <img src={SlackIntegrationSVG} />
            </Flex>

            <Box>
              <Text weight="600" size="14px">
                Slack New Ticket Notification{" "}
              </Text>
              <Text color="#475467" weight="400" size="14px">
                {`Receive new ticket notifications directly in your slack channel. \n
                Your slack channel must be set to public.`}
              </Text>
            </Box>
          
            <Button
              style={{
                borderColor: "white",
                backgroundColor: "white",
                color: channelsInfo[selectedPage.name]?.slackChannelId ? "#B42318":"#3054B9",
                fontSize: "12px",
                fontStyle: "normal",
              }}
              onClick={handleIntegrateSlack}
              leftIcon={channelsInfo[selectedPage.name]?.slackChannelId ? <img src={SlackDisableIntegration} />: <img src={SlackIntegrationEnable} />}
            >
              {" "}
              {channelsInfo[selectedPage.name]?.slackChannelId
                ? "Disable":'Enable'}
            </Button>
          </Flex>

        </Flex>
      }
    </div>
  );
};

export default Integrations;