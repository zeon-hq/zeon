import { Box, Button, Flex, Space, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import EmailNewTicket from "assets/email_new_ticket.svg";
import SlackDisableIntegration from "assets/slack_disable_icon.svg";
import SlackIntegrationSVG from "assets/slack_integration_svg.svg";
import SlackIntegrationEnable from "assets/slack_svg_enable.svg";
import Heading from "components/details/inbox/component/Heading";
import { getConfig as Config } from "config/Config";
import useDashboard from "hooks/useDashboard";
import { useDispatch } from "react-redux";
import { updateEmailTicketCreateNotification, updateSlackTicketNotification } from "reducer/slice";
import { updateChannel } from "service/DashboardService";
const Integrations = () => {
  const dispatch = useDispatch();
  const { workspaceInfo } = useDashboard();
  const { selectedPage, channelsInfo } = useDashboard();
  const isSlackConfigured = channelsInfo[selectedPage.name]?.slackChannelId;
  const isEmailConfigured = channelsInfo[selectedPage.name]?.emailNewTicketNotification;

  const handleIntegrateSlack = async () => {
    if (!isSlackConfigured){    
      // Enable Slack Integration for New Ticket Notification
    const slackRedirectionUrl = Config("API_DOMAIN") + "/oauth/slack/authorize";
    const currentUrl = window.location.href;
    // Construct the state object with accountId and currentUrl
    const stateObject = {
      currentUrl: currentUrl,
      authToken: 'Bearer ' + localStorage.getItem('at'),
      channelId:localStorage.getItem('zeon-dashboard-channelId')
    };

    const stateParameter = encodeURIComponent(JSON.stringify(stateObject));

    // if (channelsInfo[selectedPage.name]?.channelId) return;
    console.log('channelinfo', channelsInfo);
    
    localStorage.setItem(
      "userstak-dashboard-workspaceId",
      workspaceInfo.workspaceId || ""
    );

    const slackClientId = process.env.REACT_APP_SLACK_CLIENT_ID;
    const url = `https://slack.com/oauth/v2/authorize?state=${stateParameter}&redirect_uri=${slackRedirectionUrl}&client_id=${slackClientId}&scope=channels:read,chat:write,chat:write.customize,chat:write.public,groups:read,users:read,users:read.email,files:read,files:write,channels:history,channels:join,conversations:read,incoming-webhook,users.profile:read&user_scope=`;
    window.open(
      url,
      "_blank"
    );
  } else {
    const slackUpdatePayload = {accessToken:'', slackChannelId:''};

    

    const updateNotificatonMessage = await updateChannel(
      channelsInfo[selectedPage.name].channelId,
      {...channelsInfo[selectedPage.name],...slackUpdatePayload}
    );
    if (updateNotificatonMessage?.status === 200){
      await dispatch(updateSlackTicketNotification(slackUpdatePayload));
      showNotification({
        title: "Notification",
        message: "Slack Settings Saved",
      });
    } else {
      showNotification({
        title: "Notification",
        message: "Something went wrong",
        color: "red"
      });
    }
    
  }
  };

  const handleEmailTicketIntegration = async () => {
    const emailUpdatePayload = {emailNewTicketNotification:channelsInfo[selectedPage.name]?.emailNewTicketNotification ? false: true};
    
    const updateNotificatonMessage = await updateChannel(
      channelsInfo[selectedPage.name].channelId,
      {...channelsInfo[selectedPage.name],...emailUpdatePayload}
    );
    if (updateNotificatonMessage?.status === 200) {
      await dispatch(updateEmailTicketCreateNotification(emailUpdatePayload));
      showNotification({
        title: "Notification",
        message: "Email Settings Saved",
      });
    } else {
      showNotification({
        title: "Notification",
        message: "Something went wrong",
        color: "red"
      });
    }
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
              <img alt="email" src={EmailNewTicket} />
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
                color: isEmailConfigured ? "#B42318":"#3054B9",
                fontSize: "12px",
                fontStyle: "normal",
              }}
              onClick={async()=>{
                await handleEmailTicketIntegration()
              }}
              leftIcon={isEmailConfigured ? <img alt="slack icon" src={SlackDisableIntegration} />: <img alt="slack icon" src={SlackIntegrationEnable} />}
            >
              {isEmailConfigured ? "Disable":'Enable'}
            </Button>
          </Flex>

          <Flex gap="16px" p={'14px'} style={{
            borderRadius: '4px',
            border: '1px solid #E5E5E5'
          }}>
            <Flex align="center">
              <img alt="slack integrate" src={SlackIntegrationSVG} />
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
                color: isSlackConfigured ? "#B42318":"#3054B9",
                fontSize: "12px",
                fontStyle: "normal",
              }}
              onClick={async ()=>{
                await handleIntegrateSlack();
              }}
              leftIcon={isSlackConfigured ? <img alt="slack icon" src={SlackDisableIntegration} /> : <img alt="slack icon" src={SlackIntegrationEnable} />}
            >
              {" "}
              {isSlackConfigured ? "Disable":'Enable'}
            </Button>
          </Flex>

        </Flex>
      }
    </div>
  );
};

export default Integrations;