import React from "react";
import styled from "styled-components";
import { channelListData } from "util/Constant";
import WorkSpaceProfile from "assets/Checkbox_base.svg";
import { Container, Flex } from "@mantine/core";

interface ISingleChannelCard {
  title: string;
  label: string;
  selected: boolean;
}

interface ISingleCardWrapper {
  selected: boolean;
}

const ChannelCardTitle = styled.p<ISingleCardWrapper>`
  color: ${(props: ISingleCardWrapper) =>
    props.selected === true ? "#243f8b" : "#344054"};
  /* Text sm/Medium */

  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 142.857% */
`;

const ChannelCardLable = styled.p<ISingleCardWrapper>`
  color: ${(props: ISingleCardWrapper) =>
    props.selected === true ? "#243f8b" : "#344054"};
  /* Text sm/Regular */

  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
`;

const SingleCardWrapper = styled.div<ISingleCardWrapper>`
  border-radius: 12px;
  margin-top: 12px;

  border: ${(props: ISingleCardWrapper) =>
    props.selected === true ? "2px solid #3C69E7" : "1px solid #EAECF0"};
  background: ${(props: ISingleCardWrapper) =>
    props.selected === true ? " #F5F8FF" : "#FFF"};

  display: flex;
  padding: 16px;
  flex-direction: column;
  // width:436px;
  align-items: flex-start;
  gap: 4px;
  height: 92px;
  justify-content: center;
  align-self: stretch;
`;

const ComingSoonCardWrapper = styled.div`
  display: flex;
  padding: 2px 8px;
  align-items: center;
  border-radius: 16px;
  width: 104px;
  margin-left: 8px;
  background: #f2f4f7;
`;
const ComingSoonText = styled.p`
  color: var(--gray-700, #344054);
  text-align: center;
  /* Text xs/Medium */

  font-size: 12px;
  width: 432px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px; /* 150% */
`;
const ComingSoonCard = () => {
  return (
    <ComingSoonCardWrapper>
      <ComingSoonText>Coming Soon</ComingSoonText>
    </ComingSoonCardWrapper>
  );
};

const SingleChannelCard = ({ title, label, selected }: ISingleChannelCard) => {
  return (
    <>
      <SingleCardWrapper selected={selected}>
        <Flex>
          <Container m={0} p={0}>
            <ChannelCardTitle selected={selected}>{title}</ChannelCardTitle>
            <ChannelCardLable selected={selected}>{label}</ChannelCardLable>
          </Container>
          <Container m={0} p={0}>
            {selected ? (
              <img alt="profile" src={WorkSpaceProfile} />
            ) : (
              <>
                <ComingSoonCard />
              </>
            )}
          </Container>
        </Flex>
      </SingleCardWrapper>
    </>
  );
};

const ChooseChannel = () => {
  return (
    <>
      <div style={{ marginBottom: "50px" }}>
        {channelListData.map((channelData: any, index: number) => {
          return (
            <>
              <SingleChannelCard
                selected={index === 0}
                title={channelData.title}
                label={channelData.description}
              />
            </>
          );
        })}
      </div>
    </>
  );
};

export default ChooseChannel;
