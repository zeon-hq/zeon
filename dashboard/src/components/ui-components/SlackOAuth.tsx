import { Button, Space } from "@mantine/core";
import BrandLogoSection from "components/details/sidebar/BrandLogoSection";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { integrateSlack } from "service/DashboardService";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const SlackOAuth = () => {
  const [channelCreateState, setChannelCreateState] = React.useState("loading");
  const navigate = useNavigate();

  const channelCall = async () => {
    try {
      let paramString = window.location.search;
      const queryParams = Object.fromEntries(
        new URLSearchParams(paramString.substring(1))
      );
      await integrateSlack(
        queryParams.code,
        localStorage.getItem("workspaceId") || "",
        localStorage.getItem("zeon-dashboard-channelId") || ""
      );

      setChannelCreateState("success");
    } catch (error) {
      console.log(">>>>", error);
      setChannelCreateState("error");
    }
  };

  useEffect(() => {
    channelCall();
  }, []);

  return (
    <Wrapper>
      <BrandLogoSection />
      <Space h="xl" />
      <Button
        radius="md"
        className="primary"
        size="xl"
        loading={channelCreateState === "loading"}
        onClick={() => {
          
          navigate(`/dashboard/${localStorage.getItem("workspaceId")}`)
        }
        }
      >
        {channelCreateState === "loading"
          ? "Adding our magic to your channel"
          : channelCreateState === "success"
          ? "Hurray! Go to dashboard"
          : channelCreateState === "error"
          ? "Oops! Something went wrong"
          : null}
      </Button>
    </Wrapper>
  );
};

export default SlackOAuth;
