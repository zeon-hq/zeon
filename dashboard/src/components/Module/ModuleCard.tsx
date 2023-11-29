import { Badge, Divider, Flex, Space, Text } from "@mantine/core";
import ReadDocsButton from "components/ui-components/Button/ReadDocsButton";
import SwitchWithLabel from "components/ui-components/SwitchWithLabel";
import styled from "styled-components";

const StyledGuideCards = styled.div`
  background: #ffffff;
  border: 1px solid #eaecf0;
  border-radius: 12px;
`;

const HeaderText = styled(Text)`
  color: #101828;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
`;

const ContentText = styled(Text)`
  color: #475467;
  /* Text sm/Regular */
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
`;

type Props = {
  name: string;
  link: string;
  isLaunched: boolean;
  description: string;
};

const ModuleCard = ({ name, link, isLaunched, description }: Props) => {
  return (
    <StyledGuideCards>
      <Flex p="24px" direction={"column"}>
        <HeaderText>{name}</HeaderText>
        <Space h="16px" />
        <ContentText>{description}</ContentText>
      </Flex>

      <Divider />
      <Flex
        align={"center"}
        justify={"space-between"}
        pr={"24px"}
        pt={"17px"}
        pb={"16px"}
      >
        <ReadDocsButton hideDocIcon />

        {isLaunched ? (
          <SwitchWithLabel onClick={(e) => {}} value={true} />
        ) : (
          <Badge
            style={{
              backgroundColor: "white",
              border: "1px solid #344054",
              color: "#344054",
            }}
            color="blue"
          >
            coming soon
          </Badge>
        )}
      </Flex>
    </StyledGuideCards>
  );
};

export default ModuleCard;
