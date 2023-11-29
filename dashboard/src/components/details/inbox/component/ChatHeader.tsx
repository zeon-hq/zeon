import { Button, Image, Select, Space, Text } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import closeTicketIcon from "assets/closeTicketIcon.svg"
import sendMailIcon from "assets/sendMailIcon.svg"
import useDashboard from "hooks/useDashboard"
import React, { useEffect } from "react"
import { MdKeyboardArrowDown } from "react-icons/md"
import { useDispatch } from "react-redux"
import { IUser, setActiveChat, updateAssignedUser, updateInbox } from "reducer/slice"
import { assignUser, markAsResolved } from "service/DashboardService"
import styled from "styled-components"
import { showFullDate } from "util/dashboardUtils"

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px;
`

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`

const ChatHeader = () => {
  const dispatch = useDispatch()
  const { activeChat, workspaceInfo, channelsInfo } = useDashboard()
  const { allUsers } = workspaceInfo
  const [options, setOptions] = React.useState<any>([])
  const [showSelect, setShowSelect] = React.useState<boolean>(false)
  const [value, setValue] = React.useState<any>(
    activeChat?.assignedUserInfo?.userId || undefined
  )

  useEffect(() => {
    let newOptions: any = []
    if (activeChat?.channelId) {
      newOptions = allUsers
        ?.filter((user: IUser) =>
          channelsInfo[activeChat?.channelId].members.includes(user.userId)
        )
        ?.map((user: IUser) => {
          return {
            value: user.userId,
            label: `${user.name}`,
          }
        })
    }

    setOptions(newOptions || [])
  }, [workspaceInfo])

  useEffect(() => {
    setValue(activeChat?.assignedUserInfo?.userId || "")
  }, [activeChat?.assignedUserInfo?.userId])

  const assignTicketToUser = async (userId: string) => {
    try {
      const res = await assignUser(activeChat?.ticketId || "", userId)
      dispatch(
        updateAssignedUser({
          ticketId: activeChat?.ticketId || "",
          assignedUser: res.assignedUserInfo.userId,
          assignedUserInfo: res.assignedUserInfo,
        })
      )
      showNotification({
        title: "Ticket Assigned",
        message: "Ticket has been assigned to user",
        color: "green",
      })
    } catch (error) {
      showNotification({
        title: "Something went wrong",
        message: "Please try again",
        color: "red",
      })
    }
  }

  const handleUnassign = async () => {
    try {
      await assignUser(activeChat?.ticketId || "", "", true)
      dispatch(
        updateAssignedUser({
          ticketId: activeChat?.ticketId || "",
          assignedUser: "",
          assignedUserInfo: undefined,
        })
      )
      showNotification({
        title: "Ticket Unassigned",
        message:
          "Ticket has been unassigned. If the changes are not reflected please refresh the page",
        color: "green",
      })
    } catch (error) {
      console.log("errpr", error)
      showNotification({
        title: "Something went wrong",
        message: "Please try again",
        color: "red",
      })
    }
  }

  const handleMarkAsResolved = async () => {
    try {
      const res = await markAsResolved(
        activeChat?.ticketId || "",
        activeChat?.isOpen ?? true
      )
      showNotification({
        title: "Ticket Resolved",
        message: "Ticket has been marked as resolved",
        color: "green",
      })
      //@ts-ignore
      dispatch(setActiveChat(null))
      //@ts-ignore
      dispatch(updateInbox(workspaceInfo.workspaceId))
    } catch (error) {
      console.log(error)
      showNotification({
        title: "Something went wrong",
        message: "Please try again",
        color: "red",
      })
    }
  }

  return (
      <div
          style={{
              width: "100%",
              borderBottom: "1px solid #EAECF0",
              padding: "58px 12px 16px 12px",
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
              <Button
              onClick={()=>{
                window.location.href =`mailto:${activeChat?.customerEmail}`
              }}
                  style={{
                      borderRadius: "4px",
                      paddingTop: "8px",
                      paddingBottom: "8px",
                      color: "#344054",
                      paddingLeft: "14px",
                      border: "1px solid #D0D5DD",
                      paddingRight: "14px",
                  }}
                  radius="xs"
                  size="xs"
                  fw={600}
                  leftIcon={
                      <Image
                          maw={18}
                          mx="auto"
                          radius="md"
                          src={sendMailIcon}
                          alt="Random image"
                      />
                  }
                  color="dark"
                  variant="outline"
              >
                  Send E-Mail
              </Button>

              <Flex>
                  {(value || !value) && (
                      <Select
                          size="xs"
                          defaultValue={value}
                          clearButtonProps={<MdKeyboardArrowDown />}
                          rightSection={<MdKeyboardArrowDown />}
                          sx={{
                              width: "20",
                          }}
                          placeholder="Assign to User"
                          data={options}
                          value={value}
                          allowDeselect={true}
                          onChange={(value: any) => {
                              setValue(value);

                              if (!value) {
                                  handleUnassign();
                              } else if (value) {
                                  assignTicketToUser(value);
                              }
                          }}
                      />
                  )}

                  <Button
                      radius="xs"
                      onClick={handleMarkAsResolved}
                      size="xs"
                      leftIcon={
                          <Image maw={18} radius="md" src={closeTicketIcon} />
                      }
                      style={{
                          borderRadius: "4px",
                      }}
                      sx={{ marginLeft: "8px", backgroundColor: "#039855" }}
                  >
                      {activeChat?.isOpen ? "Close Ticket" : "Open Ticket"}
                  </Button>
              </Flex>
          </Wrapper>
      </div>
  );
}

export default ChatHeader
