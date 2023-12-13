import { Box, Space, Tabs } from "@mantine/core";
import AppearenceDashboard from "assets/appearence_dashboard.svg";
import BehvaiourDashboard from "assets/behvaiour_dashboard.svg";
import CannedDashboard from "assets/canned_dashboard.svg";
import DeploymentDashboard from "assets/deployment_dashboard.svg";
import InChatDashboard from "assets/in_chat_dashboard.svg";
import IntegrationDashboard from "assets/integration_dashboard.svg";
import OverviewDashboard from "assets/overview_dashboard.svg";
import UserDashboard from "assets/user_dashboard.svg";
import CannedResponse from "components/tabInfo/channel/CannedResponse";
import OverView from "components/tabInfo/channel/OverView";
import User from "components/tabInfo/channel/User";
import {
  Appearance,
  Behaviour,
  ChatLogs,
  Deployment,
  InChatWidgets,
  Integrations,
} from "components/tabInfo/index";
import { TabInfo, TabsName } from "components/types";
import useDashboard from "hooks/useDashboard";
import { useDispatch } from "react-redux";
import { setSelectedPage, setShowSidebar } from "reducer/slice";
import SidebarBack from "./sidebar/SidebarBack";

const ChannelDetail = () => {
  const dispatch = useDispatch();
  const { channelsInfo } = useDashboard();
  const channelSettingListArray: TabInfo[] = [
    {
      name: TabsName.Overview,
      icon: <img src={OverviewDashboard} />,
      active: false,
    },
    {
      name: TabsName.DEPLOYMENT,
      icon: <img src={DeploymentDashboard} />,
      active: true,
    },
    {
      name: TabsName.USER,
      icon: <img src={UserDashboard} />,
      active: true,
    },
    {
      name: TabsName.CANNED_RESPONSES,
      icon: <img src={CannedDashboard} />,
      active: true,
    },
    {
      name: TabsName.IN_CHAT_WIDGETS,
      icon: <img src={InChatDashboard} />,
      active: true,
    },
    {
      name: TabsName.APPEARENCE,
      icon: <img src={AppearenceDashboard} />,
      active: true,
    },
    {
      name: TabsName.INTEGRATIONS,
      icon: <img src={IntegrationDashboard} />,
      active: true,
    },
    {
      name: TabsName.BEHAVIORS,
      icon: <img src={BehvaiourDashboard} />,
      active: true,
    },
  
  ];

  const getTabInfo = (name: string): any => {
    switch (name) {
      case TabsName.DEPLOYMENT:
        return <Deployment />;
      case TabsName.BEHAVIORS:
        return <Behaviour />;
      case TabsName.CHAT_LOGS:
        return <ChatLogs />;
      case TabsName.IN_CHAT_WIDGETS:
        return <InChatWidgets />;
      case TabsName.APPEARENCE:
        return <Appearance />;
      case TabsName.CANNED_RESPONSES:
        return <CannedResponse />;
      case TabsName.USER:
        return <User />;
      case TabsName.INTEGRATIONS:
        return <Integrations />;
      case TabsName.Overview:
        return <OverView />;
      default:
        return <p> Coming Soon </p>;
    }
  };

  return (
    // <Navbar width={{ base: 300 }} height={"100vh"} style={{backgroundColor:'white'}}>
    <Box w={"300"} h="100%" pt={"25px"} style={{ backgroundColor: "white" }}>
      <Tabs
        styles={() => ({
          tab: {
            "&[data-active]": {
              backgroundColor: "#F2F4F7",
              border: "none",
              borderRadius:'6px'
            },
          },
          tabsList: {
            padding: " 42px 8px 8px 8px !important",
            borderRight: "1px solid #EAECF0",
          },
        })}
        h="100%"
        orientation="vertical"
        defaultValue={TabsName.DEPLOYMENT}
      >  
        <Tabs.List w={"258px"} >
          <SidebarBack
            onBackClick={() => {
              dispatch(setShowSidebar(true));
              dispatch(
                setSelectedPage({
                  type: "detail",
                  name: "inbox",
                  //@ts-ignore
                  channelId: channelsInfo?.channels[0].channelId,
                })
              );
            }}
          />
          <Space h="10px" />
          {channelSettingListArray
          .filter((tab) => tab.active) // Filter tabs where active is true
          .map((tab: TabInfo, index) => {
            return (
              <Tabs.Tab
              key={index}
                style={{
                  color: "#101828",
                  fontWeight: "500",
                  fontSize: "14px",
                  marginTop: "2px",
                }}
                value={tab.name}
                icon={tab.icon}
              >
                {tab.name}
              </Tabs.Tab>
            );
          })}
        </Tabs.List>
        {channelSettingListArray
          .filter((tab) => tab.active) // Filter tabs where active is true
        .map((tab: TabInfo, index) => {
          return (
            <Tabs.Panel style={{ padding: "32px 32px", overflow:'scroll' }} value={tab.name} key={index}>
              {getTabInfo(tab.name)}
            </Tabs.Panel>
          );
        })}
      </Tabs>
    </Box>
    // {/* </Navbar> */}
  );
};

export default ChannelDetail;
