import { Button, Flex, Image, Menu, Text } from "@mantine/core";
import logout from "assets/logout.svg";
import ProfileSetting from "assets/profile_setting_right.svg";
import ReadNewsSetting from "assets/read_news_setting_right.svg";
import RoadMapSetting from "assets/roadmap_setting_right.svg";
import SlackCommunity from "assets/slack_community_right.svg";
import UserSetting from "assets/user_setting_right.svg";
import workSpaceDropdown from "assets/workSpaceDropdown.svg";
import { useDispatch } from "react-redux";
import { setDefaultWorkSpaceSettingTab, setSelectedPage, setShowSidebar } from "reducer/slice";
import UserTopRight from "assets/user_top_right.svg";
import WorkSpaceSetting from "assets/workspace_setting_right.svg";
import {
  FooterWrapper,
  ListText,
  ListWrapper,
  MenuList,
} from "components/details/inbox/inbox.styles";
import { IWorkSpaceSettings, RightPanelSettingName } from "components/types";
import useDashboard from "hooks/useDashboard";
import { useState } from "react";
import styled from "styled-components";
import CreateWorkspaceModal from "./CreateWorkspaceModal";
import { logOutUtils } from "util/dashboardUtils";

type MenuItem = {
  name: RightPanelSettingName;
  icon: JSX.Element;
  showBottomOrder: boolean;
};

const TopBarWorkSpaceRightSelect = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const dispatch = useDispatch();
  const { user } = useDashboard();
  const [open, setOpened] = useState(false);
  const userFullName = user.name
  const userEmail = user.email;

  const handleClick = (
    type: "detail" | "channel" | "loading",
    name: string
  ) => {
    dispatch(
      setSelectedPage({
        type,
        name,
      })
    );
  };

  const menuClick = async (data: RightPanelSettingName) => {
    switch (data) {
      case RightPanelSettingName.LOGOUT:
        logOutUtils();
        break;
      case RightPanelSettingName.WORKSPACE_SETTING:
        dispatch(setDefaultWorkSpaceSettingTab(IWorkSpaceSettings.ORGANIZATION));
        handleClick("detail", "account");
        dispatch(setShowSidebar(false));
        break;    
      case RightPanelSettingName.PROFILE_SETTINGS:
        dispatch(setDefaultWorkSpaceSettingTab(IWorkSpaceSettings.PROFILE));
        handleClick("detail", "account");
        dispatch(setShowSidebar(false));
        break;      
      case RightPanelSettingName.INVITE_USER:
        dispatch(setDefaultWorkSpaceSettingTab(IWorkSpaceSettings.USERS));
        handleClick("detail", "account");
        dispatch(setShowSidebar(false));
        break;

      default:
        break;
    }
  };

  const StyledImage = styled.img`
    padding-left: 10px;
  `;

  const menuListData: MenuItem[] = [
    {
      name: RightPanelSettingName.INVITE_USER,
      icon: <StyledImage src={UserSetting} />,
      showBottomOrder: false,
    },
    {
      name: RightPanelSettingName.PROFILE_SETTINGS,
      icon: <StyledImage src={ProfileSetting} />,
      showBottomOrder: false,
    },
    {
      name: RightPanelSettingName.WORKSPACE_SETTING,
      icon: <StyledImage src={WorkSpaceSetting} />,
      showBottomOrder: true,
    },
    {
      name: RightPanelSettingName.ROADMAP,
      icon: <StyledImage src={RoadMapSetting} />,
      showBottomOrder: false,
    },
    {
      name: RightPanelSettingName.SLACK_COMMUNITY,
      icon: <StyledImage src={SlackCommunity} />,
      showBottomOrder: false,
    },
    {
      name: RightPanelSettingName.READ_NEWS_AND_BLOGS,
      icon: <StyledImage src={ReadNewsSetting} />,
      showBottomOrder: true,
    },
    {
      name: RightPanelSettingName.LOGOUT,
      icon: <StyledImage src={logout} />,
      showBottomOrder: false,
    },
  ];

  return (
      <Menu width={230} shadow="xs">
          <Menu.Target>
              <Button
                  leftIcon={<Image maw={12} radius="4px" src={UserTopRight} />}
                  rightIcon={
                      <Image maw={18} radius="sm" src={workSpaceDropdown} />
                  }
                  style={{
                      borderColor: "#D0D5DD",
                      color: "#101828",
                      backgroundColor: "#FFFFFF",
                      fontWeight: 500,
                  }}
              >
                  {userFullName}
              </Button>
          </Menu.Target>

          <Menu.Dropdown style={{ padding: "0px" }}>
              <MenuList>
                  <Flex direction={"column"}>
                      <Text color="#344054" fw={500} fz={"md"}>
                          {userFullName}
                      </Text>
                      <Text color="#475467" fw={400} fz={"sm"}>
                          {userEmail}
                      </Text>
                  </Flex>
              </MenuList>

              <FooterWrapper>
                  {menuListData.map((data: MenuItem, index) => {
                      return (
                          <>
                              <ListWrapper
                                  key={index}
                                  onClick={() => {
                                      menuClick(data.name);
                                  }}
                                  showBorder={data.showBottomOrder}
                              >
                                  {data.icon}
                                  <ListText>{data.name}</ListText>
                              </ListWrapper>
                          </>
                      );
                  })}
              </FooterWrapper>
          </Menu.Dropdown>
          <CreateWorkspaceModal opened={open} setOpened={setOpened} />
      </Menu>
  );
};

export default TopBarWorkSpaceRightSelect;
