import { Button, Image, Select } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import closeTicketIcon from "assets/closeTicketIcon.svg";
import sendMailIcon from "assets/sendMailIcon.svg";
import UnAssignIcon from "assets/unassign_icon.svg";
import useDashboard from "hooks/useDashboard";
import { useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useDispatch } from "react-redux";
import { IUser, setActiveChat, updateAssignedUser, updateInbox } from "reducer/slice";
import { assignUser, markAsResolved } from "service/DashboardService";
import styled from "styled-components";

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`

const ChatConfigRightSide = () => {
    const { activeChat, workspaceInfo, channelsInfo } = useDashboard()
    const { allUsers } = workspaceInfo;
    const dispatch = useDispatch()
    const [options, setOptions] = useState<any>([])
    const [value, setValue] = useState<any>(
      activeChat?.assignedUserInfo?.userId || undefined
    )

  const handleMarkAsResolved = async () => {
    try {
      await markAsResolved(
        activeChat?.ticketId || "",
        activeChat?.isOpen ?? true
      )
      showNotification({
        title: "Ticket Resolved",
        message: "Ticket has been marked as resolved",
        color: "green",
      })
      //@ts-ignore
      dispatch(setActiveChat(null));
      // @ts-ignore
      dispatch(updateInbox(workspaceInfo?.workspaceId as string))
    } catch (error) {
      console.log(error)
      showNotification({
        title: "Something went wrong",
        message: "Please try again",
        color: "red",
      })
    }
  }

  useEffect(() => {
    setValue(activeChat?.assignedUserInfo?.userId || "")
  }, [activeChat?.assignedUserInfo?.userId])

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
  }, [workspaceInfo]) // eslint-disable-line

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

  return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '380px',
        height: '100%',
        gap: '16px',
        padding: '16px'
      }}>

        <Button
          radius="xs"
          onClick={handleMarkAsResolved}
          leftIcon={
            <Image maw={18} radius="md" src={closeTicketIcon} />
          }
          style={{
            borderRadius: "4px",
            width: "100%"
          }}
          sx={{ backgroundColor: "#039855" }}
        >
          {activeChat?.isOpen ? "Close Ticket" : "Open Ticket"}
        </Button>

        <Flex>
          {(value || !value) && (
            <Select
              defaultValue={value}
              clearButtonProps={<MdKeyboardArrowDown />}
              rightSection={<MdKeyboardArrowDown />}
              sx={{
                width: "100%",
                height: "36px"
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
        </Flex>

        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          <Button
          disabled={!activeChat?.assignedUserInfo?.userId}
            onClick={() => {
              handleUnassign()
            }}
            style={{
              borderRadius: "4px",
              paddingTop: "8px",
              paddingBottom: "8px",
              color: "#344054",
              paddingLeft: "14px",
              border: "1px solid #D0D5DD",
              paddingRight: "14px",
              width: '100%',
              fontWeight:500,
              fontSize: '12px'
            }}
            radius="xs"
            leftIcon={
              <Image
                maw={18}
                mx="auto"
                radius="md"
                src={UnAssignIcon}
                alt="Random image"
              />
            }
            color="dark"
            variant="outline"
          >
            Unassign
          </Button>

          <Button
            onClick={() => {
              window.location.href = `mailto:${activeChat?.customerEmail}`
            }}
            style={{
              borderRadius: "4px",
              paddingTop: "8px",
              paddingBottom: "8px",
              color: "#344054",
              paddingLeft: "14px",
              border: "1px solid #D0D5DD",
              paddingRight: "14px",
              width: '100%',
              fontWeight:500,
              fontSize: '12px'
            }}
            radius="xs"
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
        </div>

      </div>
  )
}

export default ChatConfigRightSide