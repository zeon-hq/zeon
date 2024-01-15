import { Badge, Flex, Text } from "@mantine/core"
import useDashboard from "hooks/useDashboard"
import { ReactNode } from "react"
import { subscribe } from "service/DashboardService"
import styled from "styled-components"

const Wrapper = styled.div<any>`
  width: 100%;
  border: ${(props: any) =>
    props?.selected ? "2px solid #3C69E7" : "1px solid #eaecf0"};
  background: ${(props: any) => (props?.selected ? "#F5F8FF" : "")};
  border-radius: 12px;
  padding: 16px;
`

const BadgeWrapper = styled.div`
  cursor: pointer;
`

const UFlex = styled(Flex)`
  display: flex;
  gap: 8px;
  align-items: center;
`

type Props = {
  heading: string
  subHeading: string
  buttonLabel?: string
  onClick?: () => void
  selected: boolean
  planCode: string
  icon: ReactNode
}

const BillingCardNew = ({
  heading,
  subHeading,
  buttonLabel,
  onClick,
  selected,
  planCode,
  icon,
}: Props) => {
  const { workspaceInfo } = useDashboard()
  const callSubscribe = async () => {
    try {
      const data = await subscribe(workspaceInfo.workspaceId, planCode)
      window.open(data.sessionUrl, "_blank")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Wrapper selected={selected}>
        <UFlex justify="space-between">
          <UFlex>
            <div>{icon}</div>
            <div>
              <Text style={{ color: "#344054", fontWeight: "500" }}>
                {" "}
                {heading}{" "}
              </Text>
              <Text style={{ color: "#344054", fontWeight: "400" }}>
                {" "}
                {subHeading}
              </Text>
            </div>
          </UFlex>
          {buttonLabel && (
            <BadgeWrapper>
              <Badge onClick={callSubscribe} color={selected ? "blue" : "gray"}>
                {buttonLabel}
              </Badge>
            </BadgeWrapper>
          )}
        </UFlex>
      </Wrapper>
    </>
  )
}

export default BillingCardNew
