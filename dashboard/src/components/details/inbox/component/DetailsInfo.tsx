import { Button, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import useDashboard from "hooks/useDashboard";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import {
  IUser,
  updateAssignedUser
} from "reducer/slice";
import { assignUser } from "service/DashboardService";
import styled from "styled-components";
import {
  Activity,
  Directions
} from "tabler-icons-react";
import { showFullDate } from "util/dashboardUtils";
import { InfoDiv } from "../inbox.styles";
import DetailHeader from "./DetailHeader";

const Container = styled.div`
  padding: 10px;
`;


const DetailsInfo = () => {
  const { activeChat, workspaceInfo, channelsInfo } = useDashboard();
  const { allUsers } = workspaceInfo;
  const [options, setOptions] = React.useState<any>([]);

  const dispatch = useDispatch();
  useEffect(() => {
    let newOptions: any = [];
    if (activeChat?.channelId) {
      newOptions = allUsers
        ?.filter((user: IUser) =>
          channelsInfo[activeChat?.channelId].members.includes(user.userId)
        )
        ?.map((user: IUser) => {
          return {
            value: user.userId,
            label: `${user.name}`,
          };
        });
    }

    setOptions(newOptions || []);
  }, [workspaceInfo]);

  const assignTicketToUser = async (userId: string) => {
    try {
      const res = await assignUser(activeChat?.ticketId || "", userId);
      dispatch(
        updateAssignedUser({
          ticketId: activeChat?.ticketId || "",
          assignedUser: res.assignedUserInfo.userId,
          assignedUserInfo: res.assignedUserInfo,
        })
      );
      showNotification({
        title: "Ticket Assigned",
        message: "Ticket has been assigned to user",
        color: "green",
      });
    } catch (error) {
      showNotification({
        title: "Something went wrong",
        message: "Please try again",
        color: "red",
      });
    }
  };

  const handleUnassign = async () => {
    try {
      const res = await assignUser(activeChat?.ticketId || "", "", true);
      dispatch(
        updateAssignedUser({
          ticketId: activeChat?.ticketId || "",
          assignedUser: "",
          assignedUserInfo: undefined,
        })
      );
      showNotification({
        title: "Ticket Unassigned",
        message:
          "Ticket has been unassigned. If the changes are not reflected please refresh the page",
        color: "green",
      });
    } catch (error) {
      console.log("errpr", error);
      showNotification({
        title: "Something went wrong",
        message: "Please try again",
        color: "red",
      });
    }
  };

  useEffect(() => {
    console.log(">> triggered");
  }, [activeChat]);

  return (
    <>
      {/* <InfoDiv> 
                <Text size="sm" weight="400"> Name </Text>
                <Text size="sm" weight="400"> {activeChat?.} {activeChat?.assignedUser?.lastName} </Text>
            </InfoDiv> */}
      {console.log(options, activeChat?.assignedUserInfo?.userId)}
      <DetailHeader text="Ticket details" Icon={Activity} />
      <InfoDiv>
        <Text size="sm" weight="400">
          {" "}
          Email{" "}
        </Text>
        <Text size="sm" weight="400">
          {" "}
          {activeChat?.customerEmail}{" "}
        </Text>
      </InfoDiv>
      <InfoDiv>
        <Text size="sm" weight="400">
          {" "}
          Created{" "}
        </Text>
        <Text size="sm" weight="400">
          {" "}
          {showFullDate(activeChat?.createdAt)}{" "}
        </Text>
      </InfoDiv>
      <InfoDiv>
        <Text size="sm" weight="400">
          {" "}
          Source{" "}
        </Text>
        <Text size="sm" weight="400">
          {" "}
          {activeChat?.type}{" "}
        </Text>
      </InfoDiv>
      <Container>
        <Text size="sm" weight="400" mb="4px">
          {" "}
          Assign{" "}
        </Text>

        <Select
          placeholder="Select option"
          options={options}
          onChange={(value) => assignTicketToUser(value.value || "")}
          value={options.find(
            (option: any) => option.value === activeChat?.assignedUserInfo?.userId
          )}
        />

        <Button
          radius="md"
          onClick={handleUnassign}
          mt="20px"
          mb="20px"
          variant="outline"
          color="dark"
          fullWidth
        >
          {" "}
          Unassign User{" "}
        </Button>
      </Container>
      <DetailHeader text="Actions" Icon={Directions} />
      <Container>
        <Button
          radius="md"
          mt="20px"
          mb="20px"
          variant="outline"
          color="dark"
          fullWidth
        >
          <a
            style={{ color: "black", textDecoration: "none" }}
            rel="noreferrer"
            target="_blank"
            href={`mailto:${activeChat?.customerEmail}`}
          >
            {" "}
            Send Email{" "}
          </a>
        </Button>
      </Container>
    </>
  );
};

export default DetailsInfo;
