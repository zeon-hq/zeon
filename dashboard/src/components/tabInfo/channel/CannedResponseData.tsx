import { ActionIcon, Box, Flex, Space, Text } from "@mantine/core";
import styled from "styled-components";
import { Edit, Trash } from "tabler-icons-react";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0px;
`;

const StyledBorderDiv = styled.div`
  border-top: 0px;
  border-left: 1px;
  border-right: 1px;
  border-bottom: 1px;
  border-color: #eaecf0;
  border-style: solid;
`;

interface ICannedResponseData {
  item: any;
  index: number;
  deleteOnClick: (id: any) => void;
  editOnClick: (title: string, message: string, id: string) => void;
}
const CannedResponseData = ({
  item,
  index,
  deleteOnClick,
  editOnClick,
}: ICannedResponseData) => {
  return (
    <StyledBorderDiv>
      <div style={{ padding: "0px 24px" }} key={item._id}>
        <Header key={index} style={{ padding: "10px 0px" }}>
          <Box>
            <Text style={{ fontSize: "14px", fontWeight: "600" }}>
              {" "}
              {item.title}{" "}
            </Text>
            <Space h="10px" />
            <Text style={{ fontSize: "14px", fontWeight: "400" }}>
              {" "}
              {item.message}{" "}
            </Text>
          </Box>
          <Flex style={{ cursor: "pointer" }} align="center" gap="xs">
            <ActionIcon
              onClick={() => editOnClick(item.title, item.message, item._id)}
            >
              <Edit color="#475467" size="1.5rem" />
            </ActionIcon>

            <ActionIcon onClick={() => deleteOnClick(item._id)}>
              <Trash color="#475467" size="1.5rem" />
            </ActionIcon>
          </Flex>
        </Header>
        <Space h="10px" />
      </div>
    </StyledBorderDiv>
  );
};

export default CannedResponseData;