import { LoadingOverlay, Navbar, Space } from "@mantine/core";
import channelCreate from "assets/channelCreate.svg";
import SubscribeModal from "components/Billing/SubscribeModal";
import CreateChannelModalNew from "components/channel/CreateChannelModalNew";
import PanelLabel from "components/widget/PanelLabel";
import useDashboard from "hooks/useDashboard";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useLocation
} from "react-router-dom";
import { ISelectedPage, setActiveChat, setSelectedPage } from "reducer/slice";
import styled from "styled-components";
import ChannelList, { IChannelData } from "../inbox/component/ChannelList";
import { SideBarInnerWrapper, SideBarTopWrapper } from "../inbox/inbox.styles";
const MainWrapper = styled.div`
    //height: calc(100vh - 50px);
    overflow: auto;
    border-right: 1px solid #eaecf0;
    padding: 16px;
`

const Sidebar = ({ workspaceId }: { workspaceId: string }) => {
  const dispatch = useDispatch();
  const [openChannelModal, setOpenChannelModal] = useState(false);
  const { channel, loading, workspaceInfo } = useDashboard();
  const location = useLocation()
  const isWorkSpaceEmpty = !!_.isEmpty(workspaceInfo);

  const handleClick = ({ type, name, channelId }: ISelectedPage) => {
    dispatch(
      setSelectedPage({
        type,
        name,
        channelId,
      })
    );
  };

  const [open, setOpen] = useState(() =>
    workspaceInfo?.subscriptionStatus === "trialing" ||
      workspaceInfo?.subscriptionStatus === "active"
      ? false
      : true
  );

  useEffect(() => {
    if (!!workspaceInfo)
      setOpen(
        workspaceInfo?.subscriptionStatus === "trialing" ||
          workspaceInfo?.subscriptionStatus === "active"
          ? false
          : true
      );
  }, [workspaceInfo]);

  // useEffect(() => {
  //   if (channel.length > 0) {
  //     localStorage.setItem(
  //       "zeon-dashboard-channelId",
  //       channel[0].channelId
  //     );
  //   }
  // }, [channel.length > 0]);

  useEffect(() => {
    // read channelId param from url
    
    const queryParameters = new URLSearchParams(location.search)

    // if the url has channelId param, set the channelId
    const channelIdInUrl = queryParameters.get("channelId");

    if (channelIdInUrl) {

    localStorage.setItem(
      "zeon-dashboard-channelId",
      channelIdInUrl
    );
    handleClick({
      type: "detail",
      name: "inbox",
      channelId: channelIdInUrl,
    });
    //@ts-ignore
    dispatch(setActiveChat(null));
  } else {
    if (channel.length > 0) {
      localStorage.setItem(
        "zeon-dashboard-channelId",
        channel[0].channelId
      );
    }
  }
  }, [channel.length > 0]); 

  return (
    <>
      <MainWrapper>
        <SideBarTopWrapper>
          <SideBarInnerWrapper style={{ paddingBottom: "12px" }}>
            <PanelLabel
              labelTitle="Channels"
              icon={channelCreate}
              iconOnClick={() => {
                setOpenChannelModal(true);
              }}
            />
          </SideBarInnerWrapper>

          <ChannelList
            channelData={channel}
            onChannelClick={(singleChannel: IChannelData) => {
              localStorage.setItem(
                "zeon-dashboard-channelId",
                singleChannel.channelId
              );
              handleClick({
                type: "detail",
                name: "inbox",
                channelId: singleChannel.channelId,
              });
              //@ts-ignore
              dispatch(setActiveChat(null));
            }}
          />

          <Space h="md" />

          <Navbar.Section>
            <div style={{ height: "43vh", overflow: "auto" }}>
              <LoadingOverlay visible={loading} />
            </div>
          </Navbar.Section>
        </SideBarTopWrapper>
      </MainWrapper>

      <CreateChannelModalNew
        opened={openChannelModal}
        setOpened={setOpenChannelModal}
      />

      {isWorkSpaceEmpty && <SubscribeModal openModal={open} />}
    </>
  );
};

export default Sidebar;
