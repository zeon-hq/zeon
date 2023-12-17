import React, { useState } from 'react'
import { Flex, Image, Text } from "@mantine/core";

type Props = {
    onClick: () => void;
    icon: string;
    label: string;
    badge?: number;
    selected?: boolean;
}

const NavItem = ({onClick, 
    icon, 
    label, 
    badge, 
    selected = false
}: Props) => {
    const [onHover, setOnHover] = useState(false);
  return (
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
        {" "}
        <Image maw={20} radius="md" src={icon} />
        <Text fz="13px" fw={"500"} color="#1D2939">
         {label}
        </Text>
      </Flex>
  )
}

export default NavItem