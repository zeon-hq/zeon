import {  Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import TopBarWorkSpaceLeftSelect from "components/ui-components/workspaces/TopBarWorkSpaceLeftSelect";
import TopBarWorkSpaceRightSelect from "components/ui-components/workspaces/TopBarWorkSpaceRightSelect";
import useDashboard from "hooks/useDashboard";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  setLoading,
  setSelectedPage,
  setShowSidebar,
  setWorkspaces,
} from "reducer/slice";
import { getWorkspaces } from "service/CoreService";
import { useNavigate } from "react-router";
import styled from "styled-components";
import Pill from "./Pill";


const Topbar = ({ workspaceId }: { workspaceId: string }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isFrontDeskSelected, setIsFrontDeskSelected] = useState(true);
  // const [isRelationsSelected, setIsRelationsSelected] = useState(false);
  // const [isFinanceSelected, setIsFinanceSelected] = useState(false);
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
  `

  const TopBarDivWrapper = styled.div`
    display: flex;
    align-content: center;
    align-items: center;
    gap: 14px;
  `

  const InnerDivWrapper = styled.div`
    display: flex;
    align-content: center;
    align-items: center;
    gap: 14px;
  `

  useEffect(() => {
    getUserWorkspaces();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (window.location.href.includes("dashboard")) {
      setIsFrontDeskSelected(true);
      // setIsRelationsSelected(false);
      // setIsFinanceSelected(false);
    } else if (window.location.href.includes("relation")) {
      setIsFrontDeskSelected(false);
      // setIsRelationsSelected(true);
      // setIsFinanceSelected(false);
    } else if (window.location.href.includes("finance")) {
      setIsFrontDeskSelected(false);
      // setIsRelationsSelected(false);
      // setIsFinanceSelected(true);
    }
  }, [
    window.location.href.includes("dashboard"), // eslint-disable-line react-hooks/exhaustive-deps
    window.location.href.includes("relation"), // eslint-disable-line react-hooks/exhaustive-deps
    window.location.href.includes("finance"), // eslint-disable-line react-hooks/exhaustive-deps
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  const getUserWorkspaces = async () => {
    dispatch(setLoading(true));
    try {
      const res = await getWorkspaces();
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
      dispatch(setLoading(false));
    }
  };

  return (
    <TopBarWrapper>
      <TopBarDivWrapper>
        <TopBarWorkSpaceLeftSelect workspaceId={workspaceId || ""} />
        <Pill
          selected={isFrontDeskSelected}
          label="Front Desk"
          onClick={() => {
            navigate(`/dashboard/${workspaceId}`)
            dispatch(setShowSidebar(true))
            dispatch(
              setSelectedPage({
                type: "detail",
                name: "inbox",
                //@ts-ignore
                channelId: channelsInfo?.channels?.[0]?.channelId,
              })
            )
          }}
        />
        {/* <Pill
          selected={isRelationsSelected}
          label="Relations"
          onClick={() => {
            navigate(`/relation/${workspaceId}/contacts`)
          }}
        />
        <Pill
          selected={isFinanceSelected}
          label="Finance"
          onClick={() => {
            navigate(`/finance/${workspaceId}`)
          }}
        /> */}
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
            dispatch(setShowSidebar(true))
            dispatch(
              setSelectedPage({
                type: "detail",
                name: "inbox",
                //@ts-ignore
                channelId: channelsInfo?.channels?.[0]?.channelId,
              })
            )
          }}
        >
          Updates & Requests
        </Text>
        <TopBarWorkSpaceRightSelect workspaceId={workspaceId || ""} />
      </InnerDivWrapper>
    </TopBarWrapper>
  )
}

export default Topbar
