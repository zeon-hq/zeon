import { Text } from '@mantine/core'
import React from 'react'
import styled from "styled-components"
import { Icon } from 'tabler-icons-react'

type Props = {
  text: string,
  Icon: Icon
}


const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px 4px;
    background: #F1F3F5;
`

const DetailHeader = ({text,Icon}: Props) => {
  return (
    <Wrapper>
        <IconWrapper>
            <Icon size={15} strokeWidth={1.5} />
            <Text size="xs" weight="500"> {text} </Text> 
        </IconWrapper>
    </Wrapper>
   
  )
}

export default DetailHeader