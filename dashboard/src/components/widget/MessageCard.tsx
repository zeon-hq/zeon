import { Box,Flex,Text } from '@mantine/core'
import React from 'react'
import styled from 'styled-components'
import useDashboard from "hooks/useDashboard";

type Props = {
    text:string
}

const Wrapper = styled(Box)`
    background-color: #F2F4F7;
    padding: 10px 14px 10px 14px;
    color:#101828;
    font-size:14px;
    font-weight:400;
    border-radius:8px;
    margin-left:20px;
`

const MessageCard = ({text}: Props) => {
    const { channelsInfo, selectedPage } = useDashboard();
  const appearenceDetails = channelsInfo[selectedPage.name]?.appearance;
    const topLogo = appearenceDetails?.widgetHeaderSection?.topLogo;
  return (
    <Box>
        <Flex
            
            mb='xs'
            justify='space-between'
            align='center'
        >
            <Flex
                gap="4px"
            >
                <img
                    width={"25px"}
                    src={topLogo ?? "https://zeon-assets.s3.ap-south-1.amazonaws.com/Logomark.svg"}
                    alt="zeon-logo"
                />
                <Text weight="500"  color='#344054'> Zeon </Text>
            </Flex>
            <Flex>
                <Text size="12px" color='#475467'> Just Now </Text>
            </Flex>
          </Flex>
          <Wrapper>
            <Text>{text}</Text>
          </Wrapper>
        
    </Box>
  )
}

export default MessageCard