import { Text } from '@mantine/core'
import React, { ReactNode } from 'react'
import styled from "styled-components"
import {Gift} from "tabler-icons-react"

type Props = {
  text: string,
  icon: ReactNode
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 85vh;
  background-color: #F1F3F5;
` 

const Referral = ({text, icon}: Props) => {
  return (
    <Wrapper>
        {icon}
        <Text> {text} </Text>
    </Wrapper>
  )
}

export default Referral