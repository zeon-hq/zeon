import React from "react";
import Lottie from "react-lottie-player";
import LoadingAnimation from "assets/Animation - 1705157026551.json";
import styled from "styled-components"

type Props = {};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Loader = (props: Props) => {
  return (
    <Container>
      <Lottie
        loop
        animationData={LoadingAnimation}
        play
        style={{ width: "30%", height: "30%" }}
      />
    </Container>
  );
};

export default Loader;
