import { Flex } from "@mantine/core";
import { AiOutlineClose } from "react-icons/ai";
import styled from "styled-components";

const ModalHeaderTitle = styled.p`
  color: var(--gray-900, #101828);
  /* Text lg/Semibold */

  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 28px; /* 155.556% */
`;

const ModalLabel = styled.p`
  color: var(--gray-600, #475467);
  /* Text sm/Regular */

  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  margin-bottom: 20px;
`;

interface ICreateChannelHeader {
  header: string;
  label: string;
  onCloseClick: () => void;
}

const CreateChannelHeader = ({
  header,
  label,
  onCloseClick,
}: ICreateChannelHeader) => {
  return (
    <>
      <Flex w={"100%"} justify={"space-between"} align={"center"}>
        <ModalHeaderTitle>{header}</ModalHeaderTitle>
        <AiOutlineClose
          className="pointer"
          onClick={() => {
            onCloseClick();
          }}
        />
      </Flex>
      <ModalLabel>{label}</ModalLabel>
    </>
  );
};

export default CreateChannelHeader;
