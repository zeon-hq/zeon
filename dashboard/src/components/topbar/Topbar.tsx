import { Image, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import topBarDocs from "assets/topBarDocs.svg";
import TopBarWorkSpaceLeftSelect from "components/ui-components/workspaces/TopBarWorkSpaceLeftSelect";
import TopBarWorkSpaceRightSelect from "components/ui-components/workspaces/TopBarWorkSpaceRightSelect";
import useDashboard from "hooks/useDashboard";
import { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { setLoading, setSelectedPage, setShowSidebar, setWorkspaces } from "reducer/slice";
import { getWorkspaces } from 'service/CoreService';
import { useNavigate } from "react-router";
import styled from "styled-components";
import Pill from "./Pill";
import { InnerDivWrapper, TopBarDivWrapper, TopBarWrapper } from "./topbar.styles";


const Topbar = ({ workspaceId }: { workspaceId: string }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { channelsInfo } = useDashboard();
  const TopBarWrapper = styled.div`
    width: 100%;
    height: 45px;
    display: flex;
    background-color: white;
    justify-content: space-between;
    justify-items: space-between; /* Note: justify-items is not a valid CSS property */
    z-index: 1000;
    border-bottom: 1px solid #eaecf0;
    padding: 0px 16px;
  `;

  const TopBarDivWrapper = styled.div`
    display: flex;
    align-content: center;
    align-items: center;
    gap: 14px;
  `;

  const InnerDivWrapper = styled.div`
    display: flex;
    align-content: center;
    align-items: center;
    gap: 14px;
  `;

  useEffect(() => {
  getUserWorkspaces();
},[])

const getUserWorkspaces = async () => {
  dispatch(setLoading(true))
  try {
      const res = await getWorkspaces()
      if (res?.workspaces?.length > 0) {
          dispatch(setWorkspaces(res.workspaces));
          dispatch(setLoading(false));
      } else {
          showNotification({
              title: "Workspace fetching failed",
              message: "Issue while fetching workspace",
              color: "red",
            });
      }
  } catch (error) {
      dispatch(setLoading(false))
  }
}


  return (
    <TopBarWrapper>
      <TopBarDivWrapper>
        <TopBarWorkSpaceLeftSelect workspaceId={workspaceId || ""} />
        <Pill
          selected={window.location.href.includes("dashboard")}
          label="Front Desk"
          onClick={() => {
            navigate(`/dashboard/${workspaceId}`);
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
        <Pill
          selected={window.location.href.includes("crm")}
          label="Relations"
          onClick={() => {
            navigate(`/crm/${workspaceId}`);
          }}
        />
        <Pill
          selected={window.location.href.includes("finance")}
          label="Finance"
          onClick={() => {
            navigate(`/finance/${workspaceId}`);
          }}
        />
      </TopBarDivWrapper>
      <InnerDivWrapper>
        <Text
          className="ducalis-changelog-widget pointer"
          fw={"500"}
          fz="14px"
          style={{
            borderRadius: "6px",
          }}
          color="#101828"
          pl={"12px"}
          pr={"12px"}
          pt={"4px"}
          pb={"4px"}
          // bg={'#f2f4f7'}
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
          Updates & Requests
        </Text>
        <TopBarWorkSpaceRightSelect workspaceId={workspaceId || ""} />
      </InnerDivWrapper>
    </TopBarWrapper>
  );
};

export default Topbar;
