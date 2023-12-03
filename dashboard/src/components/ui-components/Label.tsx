import { MantineSize, Text } from "@mantine/core";
import React from "react";
import styled from "styled-components";

type Props = {
  text: string;
  style?: React.CSSProperties;
  size?: MantineSize;
};

const TextInputLabel = styled(Text)`
  color: #344054;

  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  margin-top: 32px;
  margin-bottom: 6px;
`;

const Label = ({ style = {}, text, size = "xs" }: Props) => {
  return <TextInputLabel> {text} </TextInputLabel>;
};

export default Label;
