import useDashboard from "hooks/useDashboard";
import _ from "lodash";
import ChatArea from "./component/ChatArea";
import ChatHeader from "./component/ChatHeader";
import NoContentDialogue from "./component/NoContentDialogue";
import styled from "styled-components";

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  align-items: center;
`;

export const DivWrapper = styled.div`
  /* position: relative; */
  height: 100vh
`;

const Chat = () => {
  const { activeChat } = useDashboard();
  return (
    <DivWrapper>
      {_.isEmpty(activeChat) ? (
        <div style={{ height: "100vh" }}>
          <StyledContainer>
            <NoContentDialogue
              heading="No conversation selected"
              text="Select a conversation to view messages"
            />
          </StyledContainer>
        </div>
      ) : (
        <>
          <ChatHeader />
          <ChatArea />
        </>
      )}
    </DivWrapper>
  );
};

export default Chat;
