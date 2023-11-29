import {
  Image
} from "@mantine/core";
import closeTicketIcon from "assets/user_delete_icon.svg";
import { IUser } from "reducer/slice";
import styled from "styled-components";


interface IUserList {
  isLast: boolean;
  isFirst: boolean;
}

interface IChannelUsersList {
  onDeleteClick:(userId:string) => void;
  userList:any;
}

const UserListWrapper = styled.div`
height:48px;
height:200px;
overflow-y:scroll;
margin-top:10px;
margin-bottom:10px;
`

const UserList = styled.div<IUserList>`
display:flex;
border-top-left-radius:${(props: IUserList) => props.isFirst === true ? '10px' : '0px'};
border-top-right-radius:${(props: IUserList) => props.isFirst === true ? '10px' : '0px'};
border-bottom-left-radius:${(props: IUserList) => props.isLast === true ? '10px' : '0px'};
border-bottom-right-radius:${(props: IUserList) => props.isLast === true ? '10px' : '0px'};
justify-content:space-between;
border:1px solid #EAECF0;
padding-top:14px;
padding-bottom:14px;
padding-left:24px;
`

const ChannelUsersList = ({onDeleteClick, userList}:IChannelUsersList) => {

  return (
    <>
      <UserListWrapper>
        {userList.map((member: IUser, index:number) => {
          return (
            <UserList isFirst={index === 0} isLast={userList.length === index + 1}>
              <p>{member.name} - {member.email}</p>
              <Image mr={'14px'} maw={20} radius="md" src={closeTicketIcon} onClick={()=>{
                onDeleteClick(member.userId);
              }} />
            </UserList>
          )
        })}
      </UserListWrapper>
  
    </>
  );
};

export default ChannelUsersList;
