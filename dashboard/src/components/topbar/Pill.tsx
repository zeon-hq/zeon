import React from 'react'
import { Image, Text } from "@mantine/core";

type Props = {
    label: string,
    status?: string,
    onClick: any
}

const Pill = ({
    label,
    status,
    onClick
}: Props) => {
  return (
            <Text
            className="pointer"
            fw={"500"}
            fz="14px"
            style={{
            borderRadius: "6px",
            }}
            color="#101828"
        pl={'12px'}
        pr={'12px'}
        pt={'4px'}
        pb={'4px'}
            bg={'#f2f4f7'}
            onClick={onClick}
        >
            {label}
        </Text>
  )
}

export default Pill