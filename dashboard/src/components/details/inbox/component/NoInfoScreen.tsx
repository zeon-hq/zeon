import { Text } from '@mantine/core'
import React from 'react'
import styled from "styled-components"


type Props = {
    heading: string
    text: string
}

const Wrapper = styled.div`
    background: #F8F9FA;
    /* Gray/Gray 4 */

    border: 1px solid #CED4DA;
    border-radius: 8px;
    padding: 16px;
    text-align: center;
`

const NoInfoScreen = ({heading, text}: Props) => {
  return (
    <Wrapper> 
        <Text  weight={500} > {heading} </Text>
        <p> {text} </p>
    </Wrapper>
  )
}

export default NoInfoScreen