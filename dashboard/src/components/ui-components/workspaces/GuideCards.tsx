import { Flex, Space, Text } from "@mantine/core";
import styled from "styled-components";

const StyledGuideCards = styled.div`
  background: #ffffff;
  /* Gray/200 */

  border: 1px solid #eaecf0;
  border-radius: 12px;
  padding: 16px;
`;

type Props = {
  name: string;
  link: string;
};

const GuideCards = ({ name, link }: Props) => {
  return (
    <StyledGuideCards>
      <Flex>
        {" "}
        <Text color="#344054" weight="500">
          {" "}
        </Text>
        {name}
      </Flex>
      <Space h="10px" />
      <Flex direction="row-reverse">
        <a style={{ textDecoration:"none", fontWeight:"600", color:"#3054B9"}} target="_black" href={link}>
          {" "}
          Read doc{" "}
          <span> -&gt; </span>
        </a>
      </Flex>
    </StyledGuideCards>
  );
};

export default GuideCards;
