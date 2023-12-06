import { Text, TextInput } from "@mantine/core";
import styled from "styled-components";

interface IListWrapper {
  showBorder: boolean;
}

export const IconWithText = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  border-right: ${(props: { selected?: boolean; last?: boolean }) =>
    props?.last ? "" : "1px solid #EAECF0"};
  justify-content: center;
  padding: 6px 8px;
  background-color: ${(props: { selected?: boolean }) =>
    props?.selected ? "#F9FAFB" : "none"};
`;

export const DivWrapper = styled.div`
  position: relative;
  padding: 32px 10px;
`;

export const ChatDivWrapper = styled.div`
  border-right: border-right: 1px solid #EAECF0;
  position: relative;
  padding: 32px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const InfoDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px;
`;

export const GoBackText = styled(Text)`
  font-size: 14px;
  color: #3054b9;
  font-weight: 500;
  margin-left: 12px;
`;

export const MenuList = styled.div`
  display: flex;
  // justify-content: center;
  padding: 10px 9px;
  border-bottom: 1px solid #eaecf0;
  cursor: pointer; /* To indicate the clickability */
`;

export const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  // padding: 10px 9px;
  // background-color:red;
`;

export const ListWrapper = styled.div<IListWrapper>`
  display: flex;
  flex-direction: row;
  padding: 0px;
  border-bottom: ${(props) =>
    props.showBorder === true ? "1px solid #EAECF0" : "0px solid #fff"};
`;

export const ListText = styled(Text)`
  color: #344054;
  font-weight: 500;
  font-size: 14px;
  padding: 10px 9px;
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
`;

export const TextHeading = styled.p`
  font-size: 16px;
  color: #333;
  margin: 0px;
  margin-top: 32px;
  padding: 0px;
`;

export const TextDesc = styled.p`
  color: #475467;

  font-size: 14px;
  margin: 0px;
  padding: 0px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
`;

export const SideBarTopWrapper = styled.div`
  padding: 8px 0px 16px 0px;
`;

export const SideBarInnerWrapper = styled.div``;

export const Block = styled.div`
  display: flex;
  width: 100%;
`;

export const DNDContainer = styled.div`
  border: 1px dashed #eaecf0;
  border-radius: 12px;
  padding: 16px 24px;
  width: 428px;
`;

export const HelperText = styled.p`
  font-size: 12px;
  color: #475467;
  text-align: center;
`;

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const IconP = styled.p`
  padding: 8px;
  border-radius: 100%;
  background: #f9fafb;
`;

export const Label = styled.p`
  font-weight: ${(props: { large?: boolean; bold?: boolean }) =>
    props?.bold ? "600" : "400"};
  font-size: ${(props: { large?: boolean }) =>
    props?.large ? "14px" : "12px"};
  margin-bottom: 4px;
`;

export const SettingInbox = styled(TextInput)`
  height: 44px;
  width: 244px;
  border-radius: 8px;
`;

export const SettingLabel = styled(Text)`
  color: #344054;
  /* Text sm/Medium */

  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 142.857% */
`;

export const SettingSubLabel = styled(Text)`
  color: #475467;
  /* Text sm/Regular */

  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
`;

export const OuterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
`;

export const LeftWrapper = styled.div`
  display: flex;
  flex: 4;
`;

export const RightWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 6;
`;
