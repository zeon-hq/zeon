import {
  Box,
  Button,
  Dialog,
  Flex,
  Loader,
  MultiSelect,
  Space,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IWorkSpaceSettings } from "components/types";
import useDashboard from "hooks/useDashboard";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useDispatch } from "react-redux";
import { IUser, initDashboard, setDefaultWorkSpaceSettingTab, setSelectedPage, setShowSidebar } from 'reducer/slice';
import {
  addUsersToChannel,
  getChannelUsers,
  removeUserFromChannel,
} from "service/DashboardService";
import styled from "styled-components";
import ChannelUsersList from "./ChannelUsersList";
import ConfirmationDialog from "components/ui-components/ConfirmationDialog";

interface IAddUserToChannel {
  channelId: string | undefined;
}

const UserInviteInfoAddText = styled.p`
  color: var(--gray-600, #475467);
  /* Text sm/Regular */
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  margin-top: 24px;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
`;

const UserInviteInfoAddInfo = styled.p`
  color: var(--gray-600, #475467);
  /* Text sm/Regular */
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  margin-top: 12px;
  margin-bottom: 24px;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
`;

const AddUserToChannel = ({ channelId }: IAddUserToChannel) => {
  const { workspaceInfo, selectedPage } = useDashboard();
  const dispatch = useDispatch();

  const [addedUsers, setAddedUsers] = useState<any>([]);
  const [removedUser, setRemovedUser] = useState<any>(undefined);
  const [opened, setOpened] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [value, setValue] = useState<any[]>([]);
  const { allUsers } = workspaceInfo;

  const [options, setOptions] = useState<any>([]);

  const getAllUsersForThisChannels = async () => {
    try {
      setUsersLoading(true);
      let id = channelId ? channelId : selectedPage.name;
      const res = await getChannelUsers(id || "");
      setUsersLoading(false);
      const memberIds = [...res?.members];
      setAddedUsers(memberIds || []);
    } catch (error) {
      setUsersLoading(false);
      console.log(error);
    }
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

  const addUsersToChannelFunc = async () => {
    try {
      let id = channelId ? channelId : selectedPage.name;
      const addUser =  await addUsersToChannel(id || "", value);
      if (addUser.status == 200){
        getAllUsersForThisChannels();
        setValue([]);
        //@ts-ignore
        dispatch(initDashboard(workspaceInfo.workspaceId));
      } else {
        showNotification({
          title: "Error",
          message: "Error while adding user to the channel, please contact zeon support team",
        });
      }
    } catch (error) {}
  };

  const openWorkSpace = (
    type: "detail" | "channel" | "loading",
    name: string
  ) =>{
    dispatch(
      setSelectedPage({
        type,
        name,
      })
    );
  }

  useEffect(() => {
    const addedUsersArrayList = addedUsers.map((user: any) => user.userId);

    const newOptions = (allUsers || []).filter((data)=> !addedUsersArrayList.includes(data.userId))
      .map((user: IUser) => ({
        value: user.userId,
        label: `${user.name}`,
      }));

    setOptions(newOptions || []);
    // getAllUsersForThisChannels();
  }, [workspaceInfo, channelId, addedUsers.length]);

  useEffect(() => {
    getAllUsersForThisChannels();
  },[]);

  return (
    <>
      <Flex w={"100%"} justify={"space-between"} h={"40px"}>
        <MultiSelect
        width={'100%'}
        value={value}
        style={{width:'100%'}}
        rightSection={<MdKeyboardArrowDown />}
        placeholder="Select Users"
        data={options || []}
        radius="md"
        onChange={(id) => {
          setValue([...id]);
        }}
        />
        <Button
          disabled={value.length == 0}
          leftIcon={<AiOutlinePlus />}
          radius={"8px"}
          ml={"12px"}
          onClick={addUsersToChannelFunc}
          h={"30px"}
          bg={"#3C69E7"}
        >
          Add to Channel
        </Button>
      </Flex>
      <UserInviteInfoAddText>
        You have to add a user to the workspace before you can add them to a
        channel.{" "}
      </UserInviteInfoAddText>
      <UserInviteInfoAddInfo>
        {" "}
        <a onClick={()=>{
                dispatch(setDefaultWorkSpaceSettingTab(IWorkSpaceSettings.USERS));
                openWorkSpace("detail", "account");
                dispatch(setShowSidebar(false));
        }} className="underline pointer">
          {" "}
          Click here
        </a>{" "}
        to add user to the workspace.
      </UserInviteInfoAddInfo>


   {
    !usersLoading
   ?    <ChannelUsersList
           userList={addedUsers}
           onDeleteClick={(userId: string) => {
             setRemovedUser(userId);
             setOpened(true);
           }}
         />
   
   : <div style={{height:'48px', display:'flex', justifyContent:'center'}}><Loader size={30} /></div>
  }
  <ConfirmationDialog 
  headerTitle="Are you sure you want to remove the user from the channel ?"
    opened={opened}
    onClose={()=>{
      setOpened(false);
    }}
    onCTAClick={()=>{
      handleRemove(removedUser);
    }}
  />

    </>
  );
};

export default AddUserToChannel;
