import React from "react";
import Lottie from "react-lottie-player";
import LoadingAnimation from "assets/Animation - 1705157026551.json";

type Props = {};

const Loader = (props: Props) => {
  return (
    <Lottie
      loop
      animationData={LoadingAnimation}
      play
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default Loader;
