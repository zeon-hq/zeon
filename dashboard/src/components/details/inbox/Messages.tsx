import styled from "styled-components";
import { MessageListHeader } from "./MessageListHeader";
import MessageContainer from "./component/MessageContainer";

const DivWrapper = styled.div`
  position: relative;
  border-right: 1px solid #eaecf0;
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 16px 0px;
`;

const HeaderAndSearchContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const Messages = () => {
  return (
      <DivWrapper>
          <MessageListHeader />
          <HeaderAndSearchContainer>
              <MessageContainer />
          </HeaderAndSearchContainer>
      </DivWrapper>
  );
};

export default Messages;
