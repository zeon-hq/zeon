import { Flex } from "@mantine/core";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { GoBackText } from "../inbox/inbox.styles";

interface ISidebarBack {
  onBackClick: () => void;
}

const SidebarBack = ({ onBackClick }: ISidebarBack) => {
  return (
    <Flex align={"center"} className="pointer" onClick={onBackClick}>
      <AiOutlineArrowLeft fontWeight={"800"} color="#3054B9" />
      <GoBackText>Go Back</GoBackText>
    </Flex>
  );
};

export default SidebarBack;