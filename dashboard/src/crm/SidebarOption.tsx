import { Flex, Image, Text } from "@mantine/core";
import { useState } from "react";

interface ISidebarOption {
    name: string;
    icon: string;
    onClick: () => void;
    selected: boolean;
  }


const SidebarOption = ({ name, icon, onClick, selected = false }: ISidebarOption) => {
    const [onHover, setOnHover] = useState(false);
    return (
      <>
        <Flex
          gap={"sm"}
          onMouseEnter={() => {
            setOnHover(true); // Assuming setSelected is a function that changes the state for selected
          }}
          onMouseLeave={() => {
            setOnHover(false); // Reset the state on mouse leave
          }}
          style={{
            paddingLeft: "12px",
            cursor: "pointer",
            paddingRight: "12px",
            paddingTop: "8px",
            marginTop:'2px',
            paddingBottom: "8px",
            borderRadius: "6px",
            backgroundColor: selected ? "#F2F4F7" : onHover ? '#F5F8FF' : '',
          }}
          onClick={onClick}
        >
          <Image maw={20} radius="md" src={icon} />
          <Text fz="md" fw={"500"} color="#1D2939">
            {name}
          </Text>
        </Flex>
      </>
    );
  };

  export default SidebarOption;