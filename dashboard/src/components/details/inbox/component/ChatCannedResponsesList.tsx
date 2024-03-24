import { Flex, Text } from "@mantine/core";
import { ICannedResponse } from "reducer/slice";

interface IChatCannedResponsesList {
  allCannedResponses: ICannedResponse[];
  query: string;
  handleChange: (message: string) => void;
  onActiveTabSet: (key: string) => void;
}

const ChatCannedResponsesList = ({
  allCannedResponses,
  query,
  handleChange,
  onActiveTabSet,
}: IChatCannedResponsesList) => {
  return (
    <>
      {allCannedResponses
        .filter((cannedResponse: ICannedResponse) => {
          return (
            cannedResponse.message
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            cannedResponse.title.toLowerCase().includes(query.toLowerCase())
          );
        })
        ?.map((cannedResponse: ICannedResponse) => {
          return (
            <>
              <Flex
                style={{
                  borderBottom:'1px solid #EAECF0',
                  padding:'10px 24px'
                }}
                justify="space-between"
                onClick={() => {
                  handleChange(cannedResponse.message);
                  onActiveTabSet("reply");
                }}
              >
                <div>
                  <Text size="sm" weight={500} color="dark">
                    {" "}
                    {cannedResponse.title}{" "}
                  </Text>
                  <Text size="xs" weight={400} color="gray">
                    {" "}
                    {cannedResponse.message}{" "}
                  </Text>
                </div>
              </Flex>
            </>
          );
        })}
    </>
  );
};

export default ChatCannedResponsesList;
