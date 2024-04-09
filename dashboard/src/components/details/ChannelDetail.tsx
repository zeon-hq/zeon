import { Box, Space, Tabs } from "@mantine/core";
import AppearenceDashboard from "assets/appearence_dashboard.svg";
import BehvaiourDashboard from "assets/behvaiour_dashboard.svg";
import CannedDashboard from "assets/canned_dashboard.svg";
import DeploymentDashboard from "assets/deployment_dashboard.svg";
import InChatDashboard from "assets/in_chat_dashboard.svg";
import IntegrationDashboard from "assets/integration_dashboard.svg";
import OverviewDashboard from "assets/overview_dashboard.svg";
import UserDashboard from "assets/user_dashboard.svg";
import KnowledgeBaseIcon from "assets/knowledge_base_icon.svg";
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
import { TabInfo, IChannelTabsName } from "components/types";
import useDashboard from "hooks/useDashboard";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useLocation, useParams } from "react-router-dom";
import { setSelectedPage, setShowSidebar } from "reducer/slice";
import SidebarBack from "./sidebar/SidebarBack";
import Knowledge from "components/tabInfo/channel/Knowledge";

const ChannelDetail = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const {workspaceId} = useParams();
  const { channelsInfo } = useDashboard();
  const [tabValue, setTabValue] = useState(IChannelTabsName.DEPLOYMENT);
  const channelSettingListArray: TabInfo[] = [
    {
      name: IChannelTabsName.Overview,
      icon: <img alt="dashboard" src={OverviewDashboard} />,
      active: false,
    },
    {
      name: IChannelTabsName.DEPLOYMENT,
      icon: <img alt="deployement" src={DeploymentDashboard} />,
      active: true,
    },
    {
      name: IChannelTabsName.USER,
      icon: <img alt="user" src={UserDashboard} />,
      active: true,
    },
    {
      name: IChannelTabsName.CANNED_RESPONSES,
      icon: <img alt="canned" src={CannedDashboard} />,
      active: true,
    },
    {
      name: IChannelTabsName.IN_CHAT_WIDGETS,
      icon: <img alt="inchat" src={InChatDashboard} />,
      active: false,
    },
    {
      name: IChannelTabsName.KNOWLEDGE,
      icon: <img alt="knowledge" src={KnowledgeBaseIcon} />,
      active: true,
    },    {
      name: IChannelTabsName.APPEARENCE,
      icon: <img alt="appearance" src={AppearenceDashboard} />,
      active: true,
    },
    {
      name: IChannelTabsName.INTEGRATIONS,
      icon: <img alt="integrations" src={IntegrationDashboard} />,
      active: true,
    },
    {
      name: IChannelTabsName.BEHAVIORS,
      icon: <img alt="behaviour" src={BehvaiourDashboard} />,
      active: true,
    },
  
  ];

  const getTabInfo = (name: string): any => {
    switch (name) {
      case IChannelTabsName.DEPLOYMENT:
        return <Deployment />;
      case IChannelTabsName.BEHAVIORS:
        return <Behaviour />;
      case IChannelTabsName.CHAT_LOGS:
        return <ChatLogs />;
      case IChannelTabsName.IN_CHAT_WIDGETS:
        return <InChatWidgets />;
      case IChannelTabsName.APPEARENCE:
        return <Appearance />;
      case IChannelTabsName.CANNED_RESPONSES:
        return <CannedResponse />;
      case IChannelTabsName.KNOWLEDGE:
        return <Knowledge />;
      case IChannelTabsName.USER:
        return <User />;
      case IChannelTabsName.INTEGRATIONS:
        return <Integrations />;
      case IChannelTabsName.Overview:
        return <OverView />;
      default:
        return <p> Coming Soon </p>;
    }
  };

  useEffect(() => {
    const queryParameters = new URLSearchParams(location.search)
    const pageName = queryParameters.get("pageName");
    const channelIdInUrl:string | null = queryParameters.get("channelId");

    if (pageName && channelIdInUrl) {
      setTabValue(pageName as IChannelTabsName);
    } else {
      setTabValue(IChannelTabsName.DEPLOYMENT as IChannelTabsName);
    }
  }, []); // eslint-disable-line

  return (
    // <Navbar width={{ base: 300 }} height={"100vh"} style={{backgroundColor:'white'}}>
    <Box w={"300"} h="100%" style={{ backgroundColor: "white" }}>
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
            padding: " 24px 8px 8px 8px !important",
            borderRight: "1px solid #EAECF0",
          },
        })}
        h="100%"
        value={tabValue}
        onTabChange={(value) => {
          setTabValue(value as IChannelTabsName);
          // @ts-ignore
          navigate(`/${workspaceId}/chat?channelId=${channelsInfo?.channels?.[0]?.channelId}&pageName=${value}`);
        }}
        orientation="vertical"
        defaultValue={tabValue}
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
                  channelId: channelsInfo?.channels?.[0]?.channelId,
                })
              );
              // @ts-ignore
              navigate(`/${workspaceId}/chat`);
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
                  fontSize: "12px",
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
            <Tabs.Panel style={{ overflow:'scroll' }} value={tab.name} key={index}>
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
