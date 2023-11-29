import { Box, Button, Text } from "@mantine/core"
import useDashboard from "hooks/useDashboard"
import { subscribe } from "service/DashboardService"
import styled from "styled-components"
import { CircleCheck } from "tabler-icons-react"
import { getDifferenceInDays } from "util/dashboardUtils"

const Header = styled(Box)`
  padding: 15px;
  background-color: #f1f3f5;
  border: 0.5px solid #ced4da;
  border-radius: 8px 8px 0px 0px;
  display: flex;
  justify-content: space-between;
`
const Container = styled.div`
  border: ${(props: { active?: boolean }) =>
    props?.active ? "2px solid #4263EB" : "0.5px solid #CED4DA"};
  border-radius: 8px;
`

const Reminder = styled(Box)`
  background-color: #e9ecef;
  border-radius: 4px;
  padding: 6px 10px;
`

type Props = {
  heading: string
  subHeading: string
  details: string
  planCode: string
  active: boolean
}

const BillingCard = ({
  heading,
  subHeading,
  details,
  planCode,
  active,
}: Props) => {
  const { workspaceInfo } = useDashboard()
  const callSubscribe = async () => {
    try {
      const data = await subscribe(workspaceInfo.workspaceId, planCode)
      console.log(data)
      window.open(data.sessionUrl, "_blank")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container active={active}>
      <Header>
        <Box>
          <Text size="xs" weight="bold">
            {" "}
            {subHeading}{" "}
          </Text>
          <Text size="sm" weight="bolder">
            {" "}
            {heading}{" "}
          </Text>
        </Box>
        {active && (
          <Box>
            {" "}
            <CircleCheck color="#4263EB" />{" "}
          </Box>
        )}
      </Header>

      <Box p={15}>
        <Text size="sm" color="gray" weight="normal">
          {" "}
          {details}{" "}
        </Text>
      </Box>
      <Box p={15}>
        {active &&
          !!workspaceInfo.trialSubscriptionEndDate &&
          (workspaceInfo.subscriptionStatus === "trialing" ? (
            <Reminder>
              Active - Free Trial -{" "}
              {getDifferenceInDays(
                Date.now(),
                (workspaceInfo.trialSubscriptionEndDate || 0) * 1000
              )}{" "}
              days left
            </Reminder>
          ) : (
            <Reminder>
              {getDifferenceInDays(
                Date.now(),
                (workspaceInfo.subscriptionEndDate || 0) * 1000
              )}{" "}
              days left in trial
            </Reminder>
          ))}
      </Box>
      {!active ? ( //@kaushalendra-pandey if they are already on a plan, we shouldn't ask them to subscribe again - as such, I've disabled this button
        <Box p={15}>
          <Button radius="md" className="primary" onClick={callSubscribe}>
            {" "}
            Subscribe to this Plan{" "}
          </Button>
        </Box>
      ) : (
        <></>
      )}
    </Container>
  )
}

export default BillingCard
