import { LoadingOverlay, Navbar, Space } from "@mantine/core";
import channelCreate from "assets/channelCreate.svg";
import SubscribeModal from "components/Billing/SubscribeModal";
import CreateChannelModalNew from "components/channel/CreateChannelModalNew";
import PanelLabel from "components/widget/PanelLabel";
import useDashboard from "hooks/useDashboard";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ISelectedPage, setActiveChat, setSelectedPage } from "reducer/slice";
import styled from "styled-components"
import ChannelList, { IChannelData } from "components/details/inbox/component/ChannelList";
import { SideBarInnerWrapper, SideBarTopWrapper } from "components/details/inbox/inbox.styles";

const MainWrapper = styled.div`
    height: calc(100vh - 62px);
    overflow: auto;
    border-right: 1px solid #eaecf0;
    padding: 16px;
`

const ChatSidebar = ({ workspaceId }: { workspaceId: string }) => {
  const dispatch = useDispatch();
  const [openChannelModal, setOpenChannelModal] = useState(false);
  const { channel, loading, workspaceInfo } = useDashboard();

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
  }, [workspaceInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (channel.length > 0) {
      localStorage.setItem(
        "userstak-dashboard-channelId",
        channel[0].channelId
      );
    }
  }, [channel.length > 0]); // eslint-disable-line react-hooks/exhaustive-deps

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
                "userstak-dashboard-channelId",
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

      {/* <CreateChannelModal
        opened={openChannelModal}
        setOpened={setOpenChannelModal}
      /> */}

      <CreateChannelModalNew
        opened={openChannelModal}
        setOpened={setOpenChannelModal}
      />

      {isWorkSpaceEmpty && <SubscribeModal openModal={open} />}
    </>
  );
};

export default ChatSidebar;
