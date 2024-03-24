import { Flex, Space, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import Heading from "components/details/inbox/component/Heading";
import NoInfoScreen from "components/details/inbox/component/NoInfoScreen";
import CreateCannedResponseModal from "components/ui-components/CreateCannedResponseModal";
import useDashboard from "hooks/useDashboard";
import React, { useEffect } from "react";
import { ICannedResponse } from "reducer/slice";
import {
  deleteCannedResponse,
  getCannedResponseFromChannelId,
} from "service/DashboardService";
import styled from "styled-components";
import { Plus } from "tabler-icons-react";
import CannedResponseList from "./CannedResponseData";

const Wrapper = styled.div`
`;


const CannedResponse = () => {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [id, setId] = React.useState("");
  const [cannedResponse, setCannedResponse] = React.useState<ICannedResponse[]>(
    []
  );

  const { selectedPage } = useDashboard();

  const handleClick = (title: string, message: string, id: string) => {
    setTitle(title);
    setMessage(message);
    setId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setMessage("");
    setId("");
    getAllCannedResponse();
  };

  const getAllCannedResponse = async () => {
    try {
      const res = await getCannedResponseFromChannelId(selectedPage.name);
      setCannedResponse(res.canned);
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteCannedResponse(id);
      showNotification({
        title: "Success",
        message: "Canned Response Deleted",
        color: "green",
      });
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Canned Response Not Deleted",
        color: "red",
      });
    }

    getAllCannedResponse();
  };

  useEffect(() => {
    getAllCannedResponse();
  }, []); // eslint-disable-line

  return (
    <Wrapper>
      <Heading
        heading="Canned Responses"
        subheading="Create a canned response to save time and reply faster."
        showDivider
        onSave={() => setOpen(true)}
        buttonText="Create New"
        icon={<Plus />}
      />
      <Space h="10px" />

      {cannedResponse.length === 0 ? (
        <>
          <Space h="10px" />
          <NoInfoScreen
            heading="No Canned Response"
            text="Create a canned response to save time and reply faster."
          />
        </>
      ) : (
        <>
          <Flex
            sx={{
              borderRadius: "8px 8px 0px 0px",
              border: "1px solid #EAECF0",
              backgroundColor: "#F9FAFB",
            }}
            p="8px 24px"
            justify="space-between"
            align="center"
          >
            <Text
              color="#475467"
              sx={{
                fontWeight: 500,
                fontSize: "12px",
              }}
            >
              {" "}
              Saved Responses
            </Text>
          </Flex>

          {cannedResponse.map((item, index) => (
            <CannedResponseList
              item={item}
              index={index}
              deleteOnClick={(id) => {
                onDelete(id);
              }}
              editOnClick={(title, message, id) => {
                handleClick(title, message, id);
              }}
            />
          ))}
        </>
      )}
      {open && (
        <CreateCannedResponseModal
          channelId={selectedPage.name}
          id={id}
          title={title}
          message={message}
          opened={open}
          onClose={() => handleClose()}
        />
      )}
    </Wrapper>
  );
};

export default CannedResponse;
