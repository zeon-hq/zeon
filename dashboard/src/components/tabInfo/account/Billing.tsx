import { useFormspark } from "@formspark/use-formspark"
import {
  Button,
  Divider,
  Grid,
  Input,
  LoadingOverlay,
  Modal,
  Space,
  Text,
} from "@mantine/core"
import { useInputState } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import PGLogo from "assets/logo 1.svg"
import BillingCardNew from "components/details/inbox/component/BillingCardNew"
import Heading from "components/details/inbox/component/Heading"
import useDashboard from "hooks/useDashboard"
import React, { useState } from "react"
import { getStripeCheckout } from "service/DashboardService"
import styled from "styled-components"
import { Hearts, Lock } from "tabler-icons-react"
import { getCurrentPlan, getRank } from "util/dashboardUtils"
import Referral from "./Referral"

const PGWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1),
    0px 1px 2px rgba(16, 24, 40, 0.06);
  border-radius: 12px;
  padding: 32px 16px;
`

const FORMSPARK_FORM_ID = "PFoxdaGB"

const Billing = () => {
  const { workspaceInfo, user } = useDashboard()
  const [loading, setLoading] = React.useState(false)

  const [submit] = useFormspark({
    formId: FORMSPARK_FORM_ID,
  })

  const [message, setMessage] = useInputState("")
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const onSubmit = async (e: any) => {
    if (!message) {
      showNotification({
        title: "Error",
        message: "Please enter a message",
        color: "red",
      })
    } else {
      await submit({
        message,
        email: user.email,
        workspaceId: workspaceInfo.workspaceId,
      })
      setShowConfirmationModal(true)
    }
  }

  const onModalClose = () => {
    setShowConfirmationModal(false)
    window.location.reload()
  }

  const makeCall = async () => {
    try {
      setLoading(true)
      const res = await getStripeCheckout({
        // lookupKey: "userstak_base_plan_monthly",
        workspaceId: workspaceInfo.workspaceId,
        dashboardId: workspaceInfo.workspaceId || "",
      })
      setLoading(false)
      window.open(res.sessionUrl, "_blank")
    } catch (error) {
      console.log(error)
      setLoading(false)
      showNotification({
        title: "Error",
        message: "Something went wrong",
      })
    }
  }

  const loggedInUserRank = getRank(workspaceInfo.allUsers, user.userId)

  //TOD: @kaushalendra-pandey fix PG plan issue
  const current_plan: string = getCurrentPlan(workspaceInfo.subscriptionInfo)

  return (
    <>
      {loggedInUserRank === "member" ? (
        <Referral
          text="You don't have permission"
          icon={<Lock size={40} strokeWidth={1} />}
        />
      ) : (
        <>
          <Heading
            heading="Billing"
            subheading="Manage your billing and payment details."
          />
          <Modal
             yOffset="20vh" 
             xOffset={0}
            title="Woohooo 🚀"
            opened={showConfirmationModal}
            onClose={() => onModalClose()}
            sx={{
              ".mantine-Modal-title": {
                fontWeight: "bold",
              },
            }}
            size="md"
          >
            <Divider />
            <div>
              <p>
                Hey {user.name}!! <br />
                <Space h="md" />
                Thanks for your support to Zeon. We have received your code
                submission. Your plan will be upgraded shortly and you shall be
                notified through your registered email. Please reach out to us
                in case of any feedback or complaints at{" "}
                <b>team@userstak.com</b>.
              </p>
            </div>
          </Modal>

          <LoadingOverlay visible={loading} />
          {current_plan?.startsWith("pg_plan") ? (
            <Grid>
              <Grid.Col>
                <BillingCardNew
                  subHeading={`Pitchground Plan ${current_plan
                    .split("_")
                    .pop()
                    ?.toUpperCase()}`}
                  heading="Userstak lifetime plan"
                  planCode={current_plan}
                  selected={current_plan?.startsWith("pg_plan")}
                  icon={<Hearts size={40} strokeWidth="1" color={"#667085"} />}
                />
              </Grid.Col>
              <Grid.Col></Grid.Col>
              <Grid.Col></Grid.Col>
            </Grid>
          ) : (
            <Grid>
              <Grid.Col></Grid.Col>

              <Grid.Col>
                <BillingCardNew
                  subHeading="Includes unlimited users and up to 1,000 tickets a month. $25 per 10,000 tickets thereafter"
                  heading="Chat $39/month, $29/month if paid annually"
                  planCode="userstak_early_adopters_plan_annually"
                  selected={current_plan === "userstak_base_plan_monthly"}
                  icon={<Hearts size={40} strokeWidth="1" color={"#667085"} />}
                  buttonLabel={
                    current_plan === "userstak_base_plan_monthly"
                      ? "Current Plan"
                      : "Upgrade"
                  }
                />
              </Grid.Col>
              <Grid.Col>
                <BillingCardNew
                  subHeading="Suitable for businesses custom deployments and be able to large amount of conversations"
                  heading="Enterprise Custom"
                  planCode="userstak_early_adopters_plan_annually"
                  selected={
                    current_plan === "userstak_early_adopters_plan_annually"
                  }
                  buttonLabel={"Enterprise"}
                  icon={<Hearts size={40} strokeWidth="1" color={"#667085"} />}
                />
              </Grid.Col>
            </Grid>
          )}
          <Space h="xl" />
          <Grid>
            <Grid.Col span={2}>
              <Button
                radius="md"
                fullWidth
                onClick={makeCall}
                className="primary"
                mr={"20px"}
              >
                {" "}
                View Invoice{" "}
              </Button>
            </Grid.Col>

            <Grid.Col span={2}>
              <Button
                radius="md"
                fullWidth
                onClick={makeCall}
                color="red"
                variant="outline"
              >
                {" "}
                Cancel Your Plan{" "}
              </Button>
            </Grid.Col>

            <Grid.Col span={6}>
              <Input
                onChange={(e: any) => setMessage(e.target.value)}
                id="message"
                name="message"
                placeholder="Enter Coupon Code Here"
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <Button
                radius="md"
                fullWidth
                onClick={onSubmit}
                color="red"
                variant="outline"
              >
                Submit
              </Button>
            </Grid.Col>
          </Grid>
          <Space h="xl" />

          <Space h="xl" />

          <PGWrapper>
            <div>
              <img alt="logo" src={PGLogo} />
            </div>
            <div>
              <Text weight="bold" sx={{ fontSize: "18px" }}>
                {" "}
                Limited Time Only: Life Time Deal{" "}
              </Text>
              <Space h="sm" />
              <Text sx={{ color: "#475467" }}>
                Don’t miss out on a limited time opportunity to be part of the
                early supporters to support our platform and get access
                exclusive lifetime deals that provide unlimited agents and
                conversations.
              </Text>
              <Space h="md" />
              <Button
                onClick={() => {
                  window.open(
                    "https://pitchground.com/products/userstak",
                    "_blank"
                  )
                }}
                className="primary"
              >
                {" "}
                Check out the deal{" "}
              </Button>
            </div>
          </PGWrapper>
        </>
      )}
    </>
  )
}

export default Billing
