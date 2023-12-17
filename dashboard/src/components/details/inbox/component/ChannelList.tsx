import { Flex, Image, Text } from "@mantine/core";
import channelIcon from "assets/channelIcon.svg";
import { useState } from "react";
import useDashboard from "hooks/useDashboard";

export interface IChannelData {
  name: string;
  channelId: string;
}

interface IChannelList {
  channelData: IChannelData[];
  onChannelClick: (data: IChannelData) => void;
}

interface IChannel {
  channelInfo: IChannelData;
  onChannelClick: (data: IChannelData) => void;
  selected: boolean;
}
/**
 * Created a separate root component called NavItem
 */
const Channel = ({ channelInfo, onChannelClick, selected }: IChannel) => {
  const [onHover, setOnHover] = useState(false);
  return (
    <>
      <Flex
        gap={"sm"}
        onMouseEnter={() => {
          setOnHover(true); // Assuming setSelected is a function that changes the state for selected
        }}
        onMouseLeave={() => {
          setOnHover(false); // Reset the state on mouse leave
        }}
        style={{
          paddingLeft: "12px",
          cursor: "pointer",
          paddingRight: "12px",
          paddingTop: "8px",
          marginTop:'2px',
          paddingBottom: "8px",
          borderRadius: "6px",
          backgroundColor: selected ? "#F2F4F7" : onHover ? '#F5F8FF' : '',
        }}
        onClick={() => {
          onChannelClick(channelInfo);
        }}
      >
        {" "}
        <Image maw={20} radius="md" src={channelIcon} />
        <Text fz="13px" fw={"500"} color="#1D2939">
          {channelInfo.name}
        </Text>
      </Flex>
    </>
  );
};

const ChannelList = ({ channelData, onChannelClick }: IChannelList) => {
  const { selectedPage } = useDashboard();
  return (
    <>
      {selectedPage.channelId && channelData.map((channel: IChannelData, index) => {
        return (
          <>
            <Channel
            key={index}
              selected={selectedPage.channelId === channel.channelId}
              channelInfo={channel}
              onChannelClick={(data: IChannelData) => {
                onChannelClick(data);
              }}
            />
          </>
        );
      })}
    </>
  );
};

export default ChannelList;