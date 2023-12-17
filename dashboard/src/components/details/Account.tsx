import { Box, Flex, Space, Tabs } from "@mantine/core";
import channelCreate from "assets/channelCreate.svg";
import logout from "assets/red_logout.svg";
import WorkSpaceBilling from "assets/workspace_billing.svg";
import WorkSpaceModules from "assets/workspace_modules.svg";
import WorkSpaceOrganization from "assets/workspace_organization.svg";
import WorkSpaceProfile from "assets/workspace_profile.svg";
import WorkSpaceUser from "assets/workspace_users.svg";
import { Admin, Billing, Referral } from "components/tabInfo";
import Modules from "components/tabInfo/account/Modules";
import Organization from "components/tabInfo/account/Organization";
import Profile from "components/tabInfo/account/Profile";
import { IWorkSpaceSettings, TabInfo, TabsName } from "components/types";
import PanelLabel from "components/widget/PanelLabel";
import useDashboard from "hooks/useDashboard";
import { useDispatch } from "react-redux";
import { setDefaultWorkSpaceSettingTab, setSelectedPage, setShowSidebar } from "reducer/slice";
import { Lock } from "tabler-icons-react";
import { logOutUtils } from "util/dashboardUtils";
import { SideBarInnerWrapper } from "./inbox/inbox.styles";

const Account = () => {
  const dispatch = useDispatch();
  const { channelsInfo, defaultWorkSpaceSettingTab } = useDashboard();
  const profileSetting: TabInfo[] = [
    {
      name: IWorkSpaceSettings.PROFILE,
      icon: <img alt="test"src={WorkSpaceProfile} />,
      active: true,
    },
  ];

  const workSpaceSetting: TabInfo[] = [
    {
      name: IWorkSpaceSettings.ORGANIZATION,
      icon: <img alt="test"src={WorkSpaceOrganization} />,
      active: true,
    },
    {
      name: IWorkSpaceSettings.MODULES,
      icon: <img alt="test"src={WorkSpaceModules} />,
      active: true,
    },
    {
      name: IWorkSpaceSettings.USERS,
      icon: <img alt="test"src={WorkSpaceUser} />,
      active: true,
    },
    {
      name: IWorkSpaceSettings.BILLING,
      icon: <img alt="test"src={WorkSpaceBilling} />,
      active: false, // currently disabled
    },
  ];

  const getWorkspaceSettingInfo = (name: string): any => {
    switch (name) {
      case IWorkSpaceSettings.USERS:
        return <Admin />;
      case TabsName.REFERRALS:
        return (
          <Referral
            text="You don't have permission"
            icon={<Lock size={40} strokeWidth={1} />}
          />
        );
      case IWorkSpaceSettings.BILLING:
        return (
          <>
            <Billing />
          </>
        );
      case IWorkSpaceSettings.ORGANIZATION:
        return (
          <>
            <Organization />
          </>
        );
      case IWorkSpaceSettings.MODULES:
        return (
          <>
            <Modules />
          </>
        );
      case IWorkSpaceSettings.PROFILE:
        return (
          <>
            <Profile />
          </>
        );
      default:
        return <p> Coming Soon </p>;
    }
  };


  return (
    <Box h={"100%"} style={{ backgroundColor: "white" }}>
      <Tabs
        styles={() => ({
          tab: {
            "&[data-active]": {
              backgroundColor: "#F2F4F7",
              border: "none",
            },
          },
          tabsList: {
            padding: "8px !important",
            borderRight: "1px solid #EAECF0",
          },
        })}
        orientation="vertical"
        h="100%"
        color="dark"
        value={defaultWorkSpaceSettingTab}
        defaultValue={defaultWorkSpaceSettingTab}
      >
        <Tabs.List w={"230px"}>
          <Flex
            align={"center"}
            className="pointer"
            onClick={() => {
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
          >
            <SideBarInnerWrapper>
              <Space h={16} />

              <PanelLabel
                labelTitle="Personal"
                icon={channelCreate}
                hideRightImage
                iconOnClick={() => {}}
              />
            </SideBarInnerWrapper>
          </Flex>
          <Space h="10px" />
          {profileSetting
            .filter((tab) => tab.active) // Filter tabs where active is true
            .map((tab: TabInfo, index) => (
              <Tabs.Tab
                key={index}
                onClick={() => {
                  //@ts-ignore
                  dispatch(setDefaultWorkSpaceSettingTab(tab.name));
                }}
                style={{
                  color: "#101828",
                  fontWeight: "500",
                  fontSize: "13px",
                  backgroundColor: "",
                  marginTop: "3px",
                }}
                value={tab.name}
                icon={tab.icon}
              >
                {tab.name}
              </Tabs.Tab>
            ))}

          <SideBarInnerWrapper
            style={{ marginTop: "10px", marginBottom: "12px" }}
          >
            <PanelLabel
              labelTitle="Workspace Settings"
              icon={channelCreate}
              hideRightImage
              iconOnClick={() => {}}
            />
          </SideBarInnerWrapper>

          {workSpaceSetting
            .filter((tab) => tab.active) // Filter tabs where active is true
            .map((tab: TabInfo) => (
              <Tabs.Tab
                onClick={() => {
                  //@ts-ignore
                  dispatch(setDefaultWorkSpaceSettingTab(tab.name));
                }}
                style={{
                  color: "#101828",
                  fontWeight: "500",
                  fontSize: "13px",
                  backgroundColor: "",
                  marginTop: "3px",
                }}
                value={tab.name}
                icon={tab.icon}
              >
                {tab.name}
              </Tabs.Tab>
            ))}
          <Tabs.Tab
            onClick={() => {
              logOutUtils();
            }}
            style={{
              color: "#B42318",
              fontWeight: "500",
              fontSize: "13px",
              marginTop: "3px",
            }}
            value={"Log out workspace"}
            icon={<img alt="test"src={logout} style={{ color: "red" }} />}
          >
            Log out workspace
          </Tabs.Tab>
        </Tabs.List>

        {profileSetting
          .concat(workSpaceSetting)
          .filter((tab) => tab.active) // Filter tabs where active is true
          .map((tab: TabInfo) => (
            <Tabs.Panel style={{ padding: "0px 32px" }} value={tab.name}>
              <Box>{getWorkspaceSettingInfo(tab.name)}</Box>
            </Tabs.Panel>
          ))}
      </Tabs>
    </Box>
  );
};

export default Account;
