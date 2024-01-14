import React from "react";
import Lottie from "react-lottie-player";
import NotfoundAnimation from "assets/NotFound.json";
import { Text } from "@mantine/core"
import styled from "styled-components"

type Props = {
    message:string
};

const NotFoundText = styled(Text)`
    
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: 600;
    color: #101828;
`

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const NotFound = ({message}: Props) => {
  return (
    <Container>
        <Lottie
        loop
        animationData={NotfoundAnimation}
        play
        style={{ width: "50%", height: "50%" }}
        />
        <NotFoundText>{message || "Not found"}</NotFoundText>
    </Container>
  );
};

export default NotFound;
