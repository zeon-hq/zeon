import { Space, Text } from "@mantine/core";
import useDashboard from "hooks/useDashboard";
import styled from "styled-components";
import { showFullDate } from "util/dashboardUtils";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px;
`

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`

const DashboardChatHeader = () => {
  const { activeChat } = useDashboard()

  return (
      <div
          style={{
              width: "100%",
              borderBottom: "1px solid #EAECF0",
              padding: "16px",
              backgroundColor: "white",
          }}
      >
          <Flex>
              <Text
                  weight={"bold"}
                  fw={500}
                  color="#101828"
                  fs="13px"
                  size="14px"
              >
                  {activeChat?.customerEmail}
              </Text>
              <Text color="#475467" size="14px">
                  {" "}
                  Created at {showFullDate(activeChat?.createdAt)}{" "}
              </Text>
          </Flex>
          <Flex>
              <Text color="#475467" size="14px">
                  {" "}
                  Ticket ID: {activeChat?.ticketId}{" "}
              </Text>
              <Text color="#475467" size="14px">
                  Last Updated at {showFullDate(activeChat?.createdAt)}
              </Text>
          </Flex>
          <Space h="12px" />
          <Wrapper> 
          </Wrapper>
      </div>
  );
}

export default DashboardChatHeader