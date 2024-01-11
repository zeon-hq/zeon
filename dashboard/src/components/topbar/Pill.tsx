import React from 'react'
import { Image, Text } from "@mantine/core";

type Props = {
    label: string,
    status?: string,
    onClick: any,
    selected?: boolean;
}

const Pill = ({
    label,
    status,
    onClick,
    selected = false
}: Props) => {
    return (
        <Text
        className={!selected ? `pointer pill` : `pointer pill pill-bg`}
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
            onClick={onClick}>
            {label}
        </Text>
    )
}

export default Pill