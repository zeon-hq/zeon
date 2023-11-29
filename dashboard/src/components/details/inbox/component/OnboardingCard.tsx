import { Text, Tooltip } from '@mantine/core'
import styled from "styled-components"

type Props = {
    imgSrc: string
    heading: string,
    subHeading: string
    disabled?: boolean
}

const Wrapper = styled.div`
    border:${(props:{disabled ?: boolean}) => props.disabled ? "2px solid #909296" : "2px solid #4263EB" } ;
    border-radius: 8px;
`

const Info = styled.div`
    padding: 16px
`

const OnboardingCard = ({imgSrc,subHeading,heading, disabled}: Props) => {
  return (
    <Tooltip label={disabled ? "Coming Soon!!" : heading}>
        <Wrapper disabled={disabled}>
            <img alt={imgSrc} style={{borderRadius:"8px 8px 0px 0px"}} width="100%" src={imgSrc} />
            <Info>
                <Text style={{color: disabled ? "#909296" : "#4263EB" , fontWeight:"500"}} size="md"> {heading} </Text>
                <Text style={{color: disabled ? "#909296" : "#4263EB" }}  size="sm"> {subHeading} </Text>
            </Info>
        </Wrapper>
    </Tooltip>
  )
}

export default OnboardingCard