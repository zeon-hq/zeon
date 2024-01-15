import { Flex, Text } from "@mantine/core";
import CreateCannedResponseModal from "components/ui-components/CreateCannedResponseModal";
import useDashboard from "hooks/useDashboard";
import { useEffect, useState } from "react";
import { ICannedResponse } from "reducer/slice";
import { getCannedResponseFromChannelId } from "service/DashboardService";
import ChatCannedResponsesList from "./ChatCannedResponsesList";

type Props = {
  handleChange: (e: string | React.ChangeEvent<HTMLInputElement>) => void;
  setActiveTab: (tab: string) => void;
  query: string;
};

const SelectCannedResponse = ({ handleChange, setActiveTab, query }: Props) => {
  const { activeChat } = useDashboard();
  const [allCannedResponses, setAllCannedResponse] = useState<
    ICannedResponse[] | []
  >([]);
  const [open, setOpen] = useState(false);
  const getAllCannedResponses = async () => {
    try {
      const res = await getCannedResponseFromChannelId(activeChat?.channelId || "")
      setAllCannedResponse(res.canned)
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   getAllCannedResponses();
  // }, [activeChat]);

  // moved the above code to below, because in the above code while sending each message, get canned message in get triggered
  useEffect(() => {
    getAllCannedResponses();
  }, []);

  return (
    <div>
      <Flex justify="space-between" align="center" style={{backgroundColor:'#F9FAFB', padding:'12px 24px'}}>
        <Text size="xs" weight={500} color="dark">
          Saved Responses
        </Text>
        <Text
          className="pointer"
          onClick={() => setOpen(true)}
          size="sm"
          weight={600}
          color="#3054B9"
        >
          {" "}
          + Create Canned Response{" "}
        </Text>
      </Flex>

      <div className="pointer">
        <ChatCannedResponsesList
          allCannedResponses={allCannedResponses}
          query={query}
          onActiveTabSet={(key) => {
            setActiveTab(key);
          }}
          handleChange={(message) => {
            handleChange(message);
          }}
        />
      </div>
      {
        open && (
          <CreateCannedResponseModal
            opened={open}
            channelId={activeChat?.channelId || ""}
            onClose={() => {
              setOpen(false)
              getAllCannedResponses()
            }}
          />
        )
      }
    </div>
  );
};

export default SelectCannedResponse;
