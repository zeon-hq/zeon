import { Box, Grid, Space, Text } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import WorkSpaceProfile from "assets/admin_table_question.svg";
import { AxiosResponse } from "axios";
import Heading from "components/details/inbox/component/Heading";
import AdminDiv from "components/ui-components/AdminDiv";
import IconToolTip from "components/ui-components/IconToolTip";
import useDashboard from "hooks/useDashboard";
import { useEffect, useState } from "react";
import { IUser } from "reducer/slice";
import {
  changeUserInvitedStatus,
  deleteWorkSpaceUser,
  fetchAllInviteUsers,
  inviteUserToWorkspace,
} from "service/CoreService";
import { Lock } from "tabler-icons-react";
import { getRank } from "util/dashboardUtils";
import AddUserModal from "./AddUserModal";
import Referral from "./Referral";
import ConfirmationDialog from "components/ui-components/ConfirmationDialog";

const Admin = () => {
  const { workspaceInfo, user } = useDashboard();
  const [open, setOpen] = useState(false);
  const [invitesList, setInvitesList] = useState([]);
  const [opened, setOpened] = useState(false);
  const [userItem, setUserItem] = useState<IUser | undefined>(undefined);

  const [fullList, setFullList] = useState([]);

  const deleteUserFunc = async (item: IUser) => {
    if (item.status == "Pending") {
      const inviteUserRemove: AxiosResponse = await changeUserInvitedStatus(
        item.userId
      );
      if (inviteUserRemove.status == 200) {
        await fetchAllInvitedUsers();
      }
    } else {
      const deleteResponse: AxiosResponse = await deleteWorkSpaceUser(
        item.userId,
        workspaceInfo.workspaceId
      );
      if (deleteResponse.status == 200) {
        await fetchAllInvitedUsers();
      }
    }
  };

  const fetchAllInvitedUsers = async () => {
    try {
      const fetchInvites = await fetchAllInviteUsers(workspaceInfo.workspaceId);
      setInvitesList(fetchInvites.invites);
    } catch (error) {
      showNotification({
        title: "Oops!",
        message: "Something went wrong! Please try again later.",
      });
    }
  };

  useEffect(() => {
    fetchAllInvitedUsers();
  }, []);

  useEffect(() => {
    const data: any = invitesList.map((data: any) => {
      return {
        userId: data.inviteId,
        email: data.email,
        role: data.roleId,
        status: data.isAccepted
          ? "Active"
          : data.isRejected
          ? "Rejected"
          : "Pending",
        module: "Chat",
      };
    });

    const userData: any = workspaceInfo?.allUsers.map((data: any) => {
      return {
        userId: data.userId,
        email: data.email,
        role: data.roleId,
        status: data.isActive ? "Active" : "Not Active",
        module: "Chat",
      };
    });

    setFullList(data.concat(userData));
  }, [invitesList?.length, workspaceInfo?.allUsers?.length]);

  const loggedInUserRank = getRank(workspaceInfo?.allUsers, user.userId);

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
            heading="Workspace Members"
            showDocsBtn
            onSave={() => {
              setOpen(true);
            }}
            buttonText="Add User"
            subheading="Manage your team members and their account permissions here."
          />
          <Space h={15} />

          <Box>
            <Box
              sx={{
                border: "1px solid #EAECF0",
                borderRadius: "8px",
              }}
            >
              <Grid
                p="0px 24px"
                m={"0"}
                sx={{
                  borderBottom: "1px solid #EAECF0",
                  backgroundColor: "#F9FAFB",
                  height: "44px",
                }}
              >
                <Grid.Col span={4}>
                  <Text weight="500" color="#475467">
                    {" "}
                    Name
                  </Text>
                </Grid.Col>
                <Grid.Col
                  span={2}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Text weight="500" color="#475467">
                    {" "}
                    Status{" "}
                    <IconToolTip
                      svgIcon={WorkSpaceProfile}
                      tooltipTitle={"Status"}
                    />
                  </Text>{" "}
                </Grid.Col>
                <Grid.Col
                  span={2}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Text weight="500" color="#475467">
                    {" "}
                    Modules{" "}
                    <IconToolTip
                      svgIcon={WorkSpaceProfile}
                      tooltipTitle={"Modules"}
                    />
                  </Text>{" "}
                </Grid.Col>
                <Grid.Col
                  span={2}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Text weight="500" color="#475467">
                    {" "}
                    Role{" "}
                    <IconToolTip
                      svgIcon={WorkSpaceProfile}
                      tooltipTitle={"Modules"}
                    />
                  </Text>{" "}
                </Grid.Col>
                <Grid.Col
                  span={2}
                  sx={{ display: "flex", justifyContent: "center" }}
                ></Grid.Col>
              </Grid>

              {fullList?.map((item: IUser) => {
                return (
                  <AdminDiv
                    hideDeleteBtn={user.userId == item.userId}
                    onClick={async () => {
                      setOpened(true);
                      setUserItem(item);
                    }}
                    email={item.email}
                    rank={item.role}
                    status={item?.status}
                    modules={item?.module}
                  />
                );
              })}
            </Box>
          </Box>

          <AddUserModal
            openModal={open}
            onClose={() => {
              // inviteUser();
              setOpen(false);
              fetchAllInvitedUsers();
            }}
          />

          <ConfirmationDialog
            headerTitle="Are you sure you want to delete the user ?"
            opened={opened}
            onClose={() => {
              setOpened(false);
              setUserItem(undefined);
            }}
            onCTAClick={async () => {
              await deleteUserFunc(userItem as IUser);
              setOpened(false);
              setUserItem(undefined);
            }}
          />
        </>
      )}
    </>
  );
};

export default Admin;
