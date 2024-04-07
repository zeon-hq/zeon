import React, { useEffect, useState } from "react";
import { SubscriptionCardProps } from "./SubscriptionCard";
import SubscriptionCard from "./SubscriptionCard";
import styled from "styled-components";
import useDashboard from "hooks/useDashboard";
import axios from "axios";
import { showNotification } from "@mantine/notifications";

type Props = {};

// create 2*2 grid
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const subscriptionCards: SubscriptionCardProps[] = [
  {
    title: "Zeon Basic",
    description:
      "Ideal for users who want to explore the basic functionalities of Zeon.",
    price: 0,
    features: [
      "5 Users",
      "2 Chat Channels",
      "Unlimited Tickets",
      "Public Support",
      "No AI Agents!",
    ],
    productId: "zeon_basic",
  },
  {
    title: "Zeon Advanced",
    description:
      "Designed for small businesses and startups with basic AI needs.",
    price: 49,
    features: [
      "10 Users",
      "10K AI Conversations",
      "1,000 AI Actions",
      "Remove Zeon Branding",
      "E-Mail Support",
    ],
    productId: "zeon_advanced",
  },
  {
    title: "Zeon Professional",
    description: "Access top-tier AI capabilities with higher usage limits",
    price: 129,
    features: [
      "30 Users",
      "30K AI Conversations",
      "3,000 AI Actions",
      "Custom Model Support",
      "E-Mail Support",
    ],
    productId: "zeon_professional",
  },
  {
    title: "Zeon Enterprise",
    description: "For business with high volume conversations and actions",
    price: 249,
    features: [
      "80 Users",
      "100K Conversations",
      "50,000 Actions",
      "Custom Model Support",
      "Slack Support",
    ],
    productId: "zeon_enterprise",
  },
];

const BillingModal = (props: Props) => {
  const { workspaceInfo } = useDashboard();
  const [clientSecret, setClientSecret] = useState<string>("");
  const fetchCustomerSession = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3005/create-customer-seesion",
        {
          customerId: workspaceInfo.stripeCustomerId,
        }
      );
      console.log(res.data);
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

  useEffect(() => {
    fetchCustomerSession();
  }, []);

  return (
    // <Grid>
    //   {
    //     subscriptionCards.map((card, index) => (
    //       <SubscriptionCard hasPlan={workspaceInfo.subscriptionInfo.subscribedPlan} key={index} {...card} />
    //     ))
    //   }
    // </Grid>

    // @ts-ignore

    clientSecret ? (
      <>
        {(workspaceInfo.subscriptionInfo.subscribedPlan && workspaceInfo.subscriptionInfo.subscribedPlan === "zeon_basic_monthly")  ? (
          //  @ts-ignore
          <stripe-pricing-table
            client-reference-id={workspaceInfo.workspaceId}
            pricing-table-id="prctbl_1P31CIB51Fz4VVlmC6YlWeP2"
            publishable-key="pk_live_51M0LxIB51Fz4VVlmA7Hhplee3uZlYPhGUC86PsgSKbwFxvZ7hxtdvG1SS3XMApbHGCFFCiRs00yzYRx0Sy14quHN00FeVAAS9F"
            customer-session-client-secret={clientSecret}
          >
            {/* @ts-ignore  */}
          </stripe-pricing-table>
        ) : (
          //  @ts-ignore
          <stripe-pricing-table
            customer-session-client-secret={clientSecret}
            client-reference-id={workspaceInfo.workspaceId}
            pricing-table-id="prctbl_1P2GLpB51Fz4VVlmuZzNvSx8"
            publishable-key="pk_live_51M0LxIB51Fz4VVlmA7Hhplee3uZlYPhGUC86PsgSKbwFxvZ7hxtdvG1SS3XMApbHGCFFCiRs00yzYRx0Sy14quHN00FeVAAS9F"
          >
            {/* @ts-ignore */}
          </stripe-pricing-table>
        )}
      </>
    ) : (
      <p> Loading </p>
    )
  );
};

export default BillingModal;
