import { Space, Text, Box, Button, Flex } from "@mantine/core";
import styled from "styled-components";
import { SaveButtonContainer } from "components/tabInfo/tabInfo.styles";
import { ReactNode } from "react";
import { FiPlus } from "react-icons/fi";
import ReadDocsButton from "components/ui-components/Button/ReadDocsButton";
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

type Props = {
  heading: string;
  subheading: string;
  showDocsBtn?: boolean;
  onSave?: () => void;
  buttonText?: string;
  icon?: ReactNode;
};

const Heading = ({
  heading,
  subheading,
  onSave,
  showDocsBtn,
  buttonText = "Save",
  icon = <FiPlus />,
}: Props) => {
  return (
    <>
      <Wrapper style={{ padding: "32px 16px" }}>
        <Box>
          <Text color="#101828" weight="600" sx={{ fontSize: "30px" }}>
            {" "}
            {heading}{" "}
          </Text>
          <Space h={5} />
          <Text
            sx={{
              color: "#475467",
            }}
          >
            {" "}
            {subheading}{" "}
          </Text>
        </Box>

        <Flex>
          {showDocsBtn && (
            <SaveButtonContainer>
            <ReadDocsButton/>
            </SaveButtonContainer>
          )}{" "}
          {onSave && (
            <SaveButtonContainer>
              <Button
                radius="md"
                leftIcon={icon}
                className="primary"
                onClick={onSave}
              >
                {buttonText}
              </Button>
            </SaveButtonContainer>
          )}
        </Flex>
      </Wrapper>
      {/* <Space h={} /> */}
    </>
  );
};

export default Heading;
