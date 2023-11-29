import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Flex as MFlex,
  MultiSelect,
  Space,
  Text
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import Heading from "components/details/inbox/component/Heading";
import ConfirmationDialog from "components/ui-components/ConfirmationDialog";
import useDashboard from "hooks/useDashboard";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { IUser, initDashboard } from "reducer/slice";
import {
  addUsersToChannel,
  getChannelUsers,
  removeUserFromChannel,
} from "service/DashboardService";

import styled from "styled-components";
import { Plus, Trash } from "tabler-icons-react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 70% 25%;
  gap: 15px;
  align-items: center;
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border: 1px solid #eaecf0;
`;

type Props = {
  channelId?: string;
};

const User = ({ channelId }: Props) => {
  const [options, setOptions] = useState<any>([]);
  const { workspaceInfo, selectedPage, user } = useDashboard();
  const [value, setValue] = useState<any>(undefined);
  const [addedUsers, setAddedUsers] = useState<any>([]);
  const [opened, setOpened] = useState(false);
  const [removedUser, setRemovedUser] = useState<any>(undefined);

  const { allUsers } = workspaceInfo;

  const dispatch = useDispatch();

  const getAllUsersForThisChannels = async () => {
    try {
      let id = channelId ? channelId : selectedPage.name;
      const res = await getChannelUsers(id || "");

      const memberIds = [...res?.members];
      setAddedUsers(memberIds || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const addedUsersArrayList = addedUsers.map((user: any) => user.userId);

    const newOptions = (allUsers || [])
      .filter((data) => !addedUsersArrayList.includes(data.userId))
      .map((user: IUser) => ({
        value: user.userId,
        label: `${user.name}`,
      }));

    setOptions(newOptions || []);
    // getAllUsersForThisChannels();
  }, [workspaceInfo, channelId, addedUsers.length]);

  useEffect(() => {
    getAllUsersForThisChannels();
  }, []);

  const handleClick = async () => {
    try {
      let id = channelId ? channelId : selectedPage.name;
      const channelCreate = await addUsersToChannel(id || "", value);
      if (channelCreate.status === 200) {
        getAllUsersForThisChannels();
        setValue([]);
        //@ts-ignore
        dispatch(initDashboard(workspaceInfo.workspaceId));
      } else {
        showNotification({
          title: "Error",
          message: "Issue While Adding User",
        });
      }
    } catch (error) {}
  };

  const handleRemove = async (id: string) => {
    try {
      let cId = channelId ? channelId : selectedPage.name;
      await removeUserFromChannel(cId || "", [id]);
      showNotification({
        title: "Success",
        message: "User removed from channel",
      });
      getAllUsersForThisChannels();
      //@ts-ignore
      dispatch(initDashboard(workspaceInfo.workspaceId));
    } catch (error) {
      console.log(error);
      showNotification({
        title: "Error",
        message: "Something went wrong",
      });
    }
    setOpened(false);
  };

  return (
    <>
      <Space h="md" />
      <Heading
        showDivider
        heading="Users"
        subheading="Manage and add users to your chat channel."
      />
      <Space h="15" />
      <Space h="md" />
      <Text
        color="#344054"
        sx={{
          fontWeight: 500,
        }}
      >
        Invite to Channel
      </Text>
      <Wrapper>
        <Box>
          <MultiSelect
            // label="Select Users"
            placeholder="Select Users"
            data={options}
            radius="md"
            onChange={(id) => {
              setValue([...id]);
            }}
          />
        </Box>
        <Button
          radius="md"
          disabled={value?.length == 0}
          className="primary"
          leftIcon={<Plus />}
          color="indigo"
          onClick={() => {
            if (value?.length > 0) {
              handleClick();
            }
          }}
        >
          {" "}
          Add User{" "}
        </Button>
      </Wrapper>
      <Space h="md" />
      <Space h="md" />
      <Box>
        <Text
          color="#344054"
          sx={{
            fontWeight: 500,
          }}
        >
          Channel Users
        </Text>
        <Text color="#475467">
          Only users who are added to the chat channel can receive incoming chat
          queries. Alternatively you can use the slack integration to manage
          incoming and outgoing conversations within a channel.
        </Text>
        <Space h="md" />
        <Space h="md" />
        <MFlex
          sx={{
            borderRadius: "8px 8px 0px 0px",
            border: "1px solid #EAECF0",
            backgroundColor: "#F9FAFB",
          }}
          p="8px 24px"
          justify="space-between"
          align="center"
        >
          <Text weight="500" color="#475467">
            {" "}
            Name
          </Text>
        </MFlex>

        {addedUsers?.map((member: IUser) => {
          return (
            <>
              <Flex>
                <Box display="flex" sx={{ alignItems: "center", gap: "4px" }}>
                  <Avatar radius="xl" />
                  <Box>
                    <Text mr={"10px"} size="sm">
                      {" "}
                      {member.name}
                      {""}
                    </Text>
                    <Text style={{ color: "#5C5F66" }} size="sm">
                      {" "}
                      {member.email}{" "}
                    </Text>
                  </Box>
                </Box>
                <ActionIcon
                  onClick={() => {
                    setRemovedUser(member.userId);
                    setOpened(true);
                  }}
                  variant="transparent"
                >
                  <Trash color="red" size="1.5rem" />
                </ActionIcon>
              </Flex>
              {/* <Space h="md" /> */}
              <ConfirmationDialog
                headerTitle="Are you sure you want to remove the user from the channel ?"
                opened={opened}
                onClose={() => {
                  setOpened(false);
                }}
                onCTAClick={() => {
                  handleRemove(removedUser);
                }}
              />
            </>
          );
        })}
      </Box>
    </>
  );
};

export default User;
