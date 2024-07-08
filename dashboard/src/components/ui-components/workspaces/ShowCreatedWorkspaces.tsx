import { Button, Flex, Image, Space, Text } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import addWorkSpace from "assets/addWorkSpace.svg"
import logoutBtn from "assets/logoutBtn.svg"
import zeonLogo from "assets/zeonLogo.svg"
import { useState } from "react"
import { useNavigate } from "react-router"
import { IInviteRes, IWorkspace } from "reducer/slice"
import { changeInviteStatus } from "service/CoreService"
import styled from "styled-components"
import { logOutUtils } from "util/dashboardUtils"
import CreateWorkspaceModal from "./CreateWorkspaceModal"
import WorkspaceCard from "./WorkspaceCard"

type Props = {
  workspaces: IWorkspace[]
  invites: IInviteRes[]
  getWorkspaceToWhichUserIsInvited: () => void
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
`

const SubWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 38rem;
  height: 66vh;
  overflow-y: auto;
  justify-content: center;
  align-items: center;
`

const ShowCreatedWorkspaces = ({ workspaces, invites, getWorkspaceToWhichUserIsInvited }: Props) => {
  const navigate = useNavigate();
  const [open, setOpened] = useState(false);

  const handleInviteChange = async (inviteId:string, status: boolean) => {
    try {
      const res = await changeInviteStatus(inviteId, status)
      console.log(">>>", res)
      showNotification({
        title: status ? "Invite Accepted" : "Invite Rejected",
        message: status ? "You have accepted the invite" : "You have rejected the invite",
        color: status ? "green" : "red",
      })
      getWorkspaceToWhichUserIsInvited()
     
    } catch (error) {
      console.log(">>>", error)
      showNotification({
        title: "Error",
        message: "Error in accepting the invite",
        color: "red",
      })
    }
  }

  return (
    <>
    
      <Wrapper>
        <SubWrapper>
          <Flex align={"center"} gap={"sm"}>
            <Image
              maw={32}
              mx="auto"
              radius="md"
              src={zeonLogo}
              alt="Random image"
            />
            <Text fz={"xl"} fw={700}>
              Zeon
            </Text>
          </Flex>
          <Space h={24} />

          <Flex direction={"column"} justify="center" align={"center"}>
            <Text fz={"xl"} fw={600}>
              Select Workspace
            </Text>
            <Text fz={"md"} fw={400} align="center" color="#475467">
              Select a workspace to enter or create a workspace to begin.
            </Text>
          </Flex>
          <Space h={20} />
          {workspaces.length === 0 ? (
            <>
              <Flex
                style={{
                  height: "30rem",
                  paddingLeft: "5rem",
                  paddingRight: "5rem",
                }}
                bg={"#F9FAFB"}
                justify={"center"}
                align={"center"}
              >
                <Text fz={"md"} align="center" fw={"600"} color="#A0A0AB">
                  No Workspace found. Please create a workspace to begin.
                </Text>
              </Flex>
            </>
          ) : (
            <>
              <Flex
                direction={"column"}
                style={{
                  height: "30rem",
                  width: "100%",
                }}
              >
                {workspaces.map((workspace, index) => (
                  <WorkspaceCard
                    key={workspace.workspaceId}
                    name={workspace.workspaceName}
                    info={`Managed by: ${workspace.primaryContactName}`}
                    workspaceId={workspace.workspaceId}
                    activePlan={workspace?.subscriptionInfo?.subscribedPlan}
                    workspace={workspace}
                  />
                ))}
              </Flex>
            </>
          )}
          <Space h={20} />
          {invites.length > 0 ? (
            <>
              <Flex
                direction={"column"}
                style={{
                  height: "30rem",
                  width: "100%",
                }}
              >
                {invites.map((invite) => (
                  <WorkspaceCard
                    key={invite._id}
                    name={invite.workspace.workspaceName}
                    info={`Managed by: ${invite.workspace.primaryContactName}`}
                    isInvite={true}
                    onAccept={() => handleInviteChange(invite.inviteId, true)}
                    onReject={() => handleInviteChange(invite.inviteId, false)}
                    workspaceId={invite.workspace.workspaceId}
                    workspace={invite.workspace}
                  />
                ))}
              </Flex>
            </>
          ) : (
            <></>
          )}
         

          <CreateWorkspaceModal opened={open} setOpened={setOpened} />
        </SubWrapper>
        <Flex
            gap={"md"}
            style={{ width: "38rem", marginTop:"16px", paddingLeft: "1rem", paddingRight: "3rem" }}
            direction={{ base: "column", sm: "row" }} // Stack vertically on small screens, row on larger screens
            justify={"space-around"}
          >
            <Button
              radius="md"
              fullWidth
              variant="default"
              onClick={() => logOutUtils()}
              leftIcon={
                <Image
                  maw={20}
                  mx="auto"
                  radius="md"
                  src={logoutBtn}
                  alt="Logout Icon"
                />
              }
              color={"red"}
            >
              {" "}
              Logout{" "}
            </Button>
            <Button
              radius="md"
              fullWidth
              style={{
                background: "#3C69E7",
              }}
              variant="filled"
              leftIcon={
                <Image
                  maw={20}
                  mx="auto"
                  radius="md"
                  src={addWorkSpace}
                  alt="Add Workspace Icon"
                />
              }
              onClick={() => {
                navigate(`/workspace-creation`);
              }}
            >
              {" "}
              Create Workspace{" "}
            </Button>
          </Flex>
      </Wrapper>
    </>
  )
}

export default ShowCreatedWorkspaces
