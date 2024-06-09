import styled from "styled-components";
import { preProcessText } from "components/hooks/commonUtils";
import useWidget from "components/hooks/useWidget";
//@ts-ignore
import { format, isToday } from "date-fns";
import { Box, Flex, Text } from "@mantine/core";
import { differenceInMinutes } from "date-fns";

const Wrapper = styled(Box)<{type:any}>`
  background-color:${(props:any) => props.type === "received" ? "#f2f4f7" :"#ECF3FF"};
  padding: 10px 14px 10px 14px;
  color:${(props:any) => props.type === "received" ? "#101828" :"#243F8B"}; 
  font-size: 14px;
  font-weight: 400;
  border-radius: 8px;
  margin-left: 20px;
  margin-bottom: 10px;
`;

const MessageCard = ({ text, time, type }: any) => {
  const { widgetDetails } = useWidget();
  const getTime = (time: string) => {
    const inputTime = +time;
    const date = new Date(inputTime);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    const now = new Date();
    const diff = differenceInMinutes(now, date);

    if (diff <= 2) {
      return "Just now";
    } else if (diff <= 5) {
      return "A min ago";
    } else {
      const dateFormat = isToday(date) ? "h:mm a" : "d/M/yyyy h:mm a";
      return format(date, dateFormat);
    }
  };

  const { email } = useWidget();

  const newMessage = preProcessText(text, { email });
  return (
    <>
      <Box mb="md">
        <Flex mb="xs" justify="space-between" align="center">
          <Flex gap="4px">
            <img
              width={"17px"}
              style={{
                borderRadius:"6px"
              }}
              src={
                type === "received"
                  ? widgetDetails?.appearance?.widgetHeaderSection?.topLogo ||
                    "https://zeon-assets.s3.ap-south-1.amazonaws.com/Logomark.svg"
                  : "https://zeon-assets.s3.ap-south-1.amazonaws.com/userimg1.svg"
              }
              alt="zeon-logo"
            />
            <Text size="sm" weight={500} color="#344054">
              {type === "received" ? widgetDetails.aiName || "Agent" : "You"}
            </Text>
          </Flex>
          <Flex>
            <Text size="12px" color="#475467">
              {getTime(time)}
            </Text>
          </Flex>
        </Flex>
        {/* @ts-ignore */}
        <Wrapper type={type}>
          <Text dangerouslySetInnerHTML={{ __html: newMessage }} />
        </Wrapper>
      </Box>
    </>
  );
};

export default MessageCard;
