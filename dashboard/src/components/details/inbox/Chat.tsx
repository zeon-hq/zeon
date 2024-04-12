import useDashboard from "hooks/useDashboard";
import _ from "lodash";
import styled from "styled-components";
import ChatConfigRightSide from "./ChatConfigRightSide";
import ChatArea from "./component/ChatArea";
import DashboardChatHeader from "./component/ChatHeader";
import NoContentDialogue from "./component/NoContentDialogue";

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
          <div style={{
            display: 'flex',
            width: '100%'
          }}>
            <div
            style={{
              width: '100%',
            }}
            >
              <DashboardChatHeader />
              <ChatArea />
            </div>
            <ChatConfigRightSide/>
          </div>
        </>
      )}
    </DivWrapper>
  );
};

export default Chat;
