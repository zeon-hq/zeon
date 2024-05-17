import React, { useEffect, useState } from "react";
import styled from "styled-components";
import useDashboard from "hooks/useDashboard";
import axios from "axios";
import { showNotification } from "@mantine/notifications";
import Heading from "components/details/inbox/component/Heading";
import { Flex, Grid, Text, Box, Button, Space, Progress } from "@mantine/core";
import { AuthSecondaryButton } from "components/auth/auth.styles";
import { ArrowRight } from "tabler-icons-react";
import { PricingPlan, pricingPlanName } from "constants/pricingPlan";
import { getConfig as Config } from "config/Config";
import { getAIAnalyticsAPI } from "service/CoreService";

type Props = {};

const AnalyticCard = styled.div`
  background: #f9fafb;
  padding: 20px 16px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
`;

const CurrentPlan = styled.div`
  border: 1px solid #eaecf0;
  border-radius: 8px;
`;

const Badge = styled(Box)`
  border: 1.5px solid #0560e8;
  padding: 4px 12px;
  color: #044dbb;
  font-size: 14px;
  border-radius: 4px;
`;

const Wrapper = styled.div`
  height: 78vh;
  overflow: auto;
`;

const BillingModal = (props: Props) => {
  const { workspaceInfo, inbox:{allConversations} } = useDashboard();
  const [clientSecret, setClientSecret] = useState<string>("");
  const [showPricingTable, setShowPricingTable] = useState<boolean>();
  const coreApi = Config("CORE_API_DOMAIN");
  const [analytics, setAnalytics] = useState<any>({}); // eslint-disable-line
  const fetchCustomerSession = async () => {
    try {
      const res = await axios.post(`${coreApi}/create-customer-seesion`, {
        customerId: workspaceInfo.stripeCustomerId,
      });
      setClientSecret(res.data.client_secret);
    } catch (error: any) {
      console.log(error);
      showNotification({
        title: "Error",
        message:
          error?.response?.data?.error?.message ?? "Something went wrong",
        color: "red",
      });
    }
  };

  const createManageBilling = async () => {
    try {
      const res = await axios.post(
        `${coreApi}/create-customer-portal-session`,
        {
          customerId: workspaceInfo.stripeCustomerId,
        }
      );
      window.location.href = res.data.url;
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowPricingTable = () => {
    setShowPricingTable((prev) => !prev);
  };

  const getAIAnalytics = async () => {
    try {
      const res = await getAIAnalyticsAPI(workspaceInfo.workspaceId);
      console.log(res);
      setAnalytics(res);
    } catch (error: any) {
      console.log(error);
      showNotification({
        title: "Error",
        message:
          error?.response?.data?.error?.message ?? "Something went wrong",
        color: "red",
      });
    }
  
  }

  useEffect(() => {
    fetchCustomerSession();
    getAIAnalytics();
    if (
      workspaceInfo.subscriptionInfo.subscribedPlan ===
        PricingPlan.ZEON_BASIC_MONTHLY ||
      !workspaceInfo.subscriptionInfo.subscribedPlan
    ) {
      setShowPricingTable(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Heading
        heading="Billing"
        subheading="Manage your billing and payment details."
      />
      <Wrapper>
        {workspaceInfo?.subscriptionInfo?.subscribedPlan && (
          <>
            <Grid>
              <Grid.Col span={4}>
                <AnalyticCard>
                  Total Conversations
                  <Space h="md" />
                  <Progress
                    mt="mb"
                    radius="lg"
                    size={16}
                    sections={[
                      {
                        value: allConversations?.length || 0,
                        color: "indigo",
                        label: `${allConversations?.length || 0}/100`,
                      },
                    ]}
                  />
                </AnalyticCard>
              </Grid.Col>
              <Grid.Col span={4}>
                <AnalyticCard>
                  AI Actions
                  <Space h="md" />
                  <Progress
                    mt="mb"
                    radius="lg"
                    size={16}
                    sections={[
                      {
                        value: analytics?.getAICalls || 0,
                        color: "indigo",
                        label: `${analytics.getAICalls}/100`,
                      },
                    ]}
                  />
                </AnalyticCard>
              </Grid.Col>
              <Grid.Col span={4}>
                <AnalyticCard>
                  Document Queries
                  <Space h="md" />
                  <Progress
                    mt="mb"
                    radius="lg"
                    size={16}
                    sections={[
                      {
                        value:  analytics?.getFileUploadedCount,
                        color: "indigo",
                        label: `${analytics.getFileUploadedCount}/100`,
                      },
                    ]}
                  />
                </AnalyticCard>
              </Grid.Col>
            </Grid>
            <Grid mt="md">
              <Grid.Col span={8}>
                <CurrentPlan>
                  <Flex
                    justify="space-between"
                    align="center"
                    style={{
                      borderBottom: "1px solid #EAECF0",
                      padding: "16px 20px",
                    }}
                  >
                    <Text size="16px" weight="bold">
                      {/* @ts-ignore */}
                      {pricingPlanName?.[
                        workspaceInfo.subscriptionInfo.subscribedPlan
                      ] || "Not found"}
                    </Text>
                    <Badge>Active Plan</Badge>
                  </Flex>
                  <Box style={{ padding: "16px 20px" }}>
                    <Text size="14px" weight="normal">
                      {" "}
                      1000 Messages{" "}
                    </Text>
                    <Text size="14px" weight="normal">
                      {" "}
                      1 User{" "}
                    </Text>
                  </Box>
                </CurrentPlan>
              </Grid.Col>
              <Grid.Col span={4}>
                <Button
                  radius="md"
                  fullWidth
                  // leftIcon={icon}
                  className="primary"
                  onClick={createManageBilling}
                >
                  Upgrade or Downgrade Plan
                </Button>
                {/* @ts-ignore */}
                <AuthSecondaryButton
                  radius="md"
                  rightIcon={
                    <ArrowRight size={20} strokeWidth="1" color={"#344054"} />
                  }
                  fullWidth
                  style={{
                    marginTop: "8px",
                  }}
                  // leftIcon={icon}

                  variant="outline"
                  onClick={createManageBilling}
                >
                  Manage Billing
                </AuthSecondaryButton>
                <Text align="center" size="14px" weight="400" mt="md">
                  <span
                    style={{
                      color: "#0560E8",
                      cursor: "pointer",
                    }}
                    onClick={() => handleShowPricingTable()}
                  >
                    {showPricingTable ? "Hide" : "Click here"}
                  </span>
                  <span>
                    {showPricingTable
                      ? " the pricing table"
                      : " to show pricing table"}
                  </span>
                </Text>
              </Grid.Col>
            </Grid>
            <Space h="md" />
          </>
        )}

        {clientSecret && showPricingTable && (
          <>
            {workspaceInfo.subscriptionInfo.subscribedPlan &&
            workspaceInfo.subscriptionInfo.subscribedPlan ===
              PricingPlan.ZEON_BASIC_MONTHLY ? (
              //  @ts-ignore
              <stripe-pricing-table
                client-reference-id={workspaceInfo.workspaceId}
                pricing-table-id={
                  process.env.REACT_APP_PRICING_TABLE_WITH_FREE_PLAN
                }
                publishable-key={process.env.REACT_APP_STRIPE_KEY}
                customer-session-client-secret={clientSecret}
              >
                {/* @ts-ignore  */}
              </stripe-pricing-table>
            ) : (
              //  @ts-ignore
              <stripe-pricing-table
                customer-session-client-secret={clientSecret}
                client-reference-id={workspaceInfo.workspaceId}
                pricing-table-id={
                  process.env.REACT_APP_PRICING_TABLE_WITH_PAID_PLAN
                }
                publishable-key={process.env.REACT_APP_STRIPE_KEY}
              >
                {/* @ts-ignore */}
              </stripe-pricing-table>
            )}
          </>
        )}
      </Wrapper>
    </>
  );
};

export default BillingModal;
