import ChatSidebar from "components/chat/ChatSidebar"
import Topbar from "components/topbar/Topbar"
import CRMSidebar from "crm/CRMSidebar"
import FinanceSidebar from "finance/expense/FinanceSidebar"
import useDashboard from "hooks/useDashboard"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import {
  initDashboard,
  MessageType,
  updateConversation,
  updateInbox,
  setTyping,
  updateConversationAIStatus
} from "reducer/slice"
import socketInstance from "socket"
import styled from "styled-components"
import FinanceTopbar from "../../finance/expense/FinanceTopbar"
import { ITicketType } from "components/details/inbox/component/MessageContainer"

const ChildWrapper = styled.div<{ isFinance: boolean, isCRM: boolean }>`
  height: ${(props) =>
      props.isFinance ? "calc(100vh - 93px)" : "calc(100vh - 53px)"};
  overflow: hidden;
`

const Layout = ({ children }: { children: any }) => {
  const dispatch = useDispatch()
  const { workspaceId } = useParams()
  const { showSidebar, isFinance, isChat, isCRM, activeChat, typing } = useDashboard()

  useEffect(() => {
    //@ts-ignore
    dispatch(initDashboard(workspaceId))

    // socketInstance.off("message").on("message", (data) => {
    //   dispatch(updateConversation({ data, type: MessageType.SENT }));
    // })

    socketInstance.on("message", (data) => {
      if (data?.messageSource === 'widget' || data?.messageSource ===  "both") {
        if (data?.isNewTicket) {
          //@ts-ignore
          dispatch(updateInbox(workspaceId));
        } else {
          dispatch(updateConversation({ data, type: MessageType.SENT }));
        }
      }
    });

    socketInstance.on("widget_typing", (data)=> {
      // have the check to compare the ticket with the selected ticketId
        dispatch(setTyping(true));
    });
 
    socketInstance.on("widget_stop_typing", (data)=> {
      // have the check to compare the ticket with the selected ticketId
      dispatch(setTyping(false));
    });

    socketInstance.on("ai_responding", (data)=>{
      dispatch(updateConversationAIStatus({
        data, 
        type:ITicketType.AI_RESPONDING
      }));
    });

    socketInstance.on("ai_stop_responded", (data)=>{
      dispatch(updateConversationAIStatus({data}));
    });

  }, [socketInstance, workspaceId]); // eslint-disable-line

  return (
    <>
      <Topbar workspaceId={workspaceId || ""} />
      {isFinance && <FinanceTopbar />}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: showSidebar ? "20% 80%" : "100%",
          height: isFinance ? "calc(100vh - 100px)" : "calc(100vh - 53px)",
          overflow: "hidden",
        }}
      >
        {workspaceId && showSidebar === true ? (
          isFinance ? (
            <FinanceSidebar workspaceId={workspaceId} />
          ) : isChat ? (
            <ChatSidebar workspaceId={workspaceId} />
          ) : (
            <CRMSidebar workspaceId={workspaceId} />
          )
        ) : (
          <></>
        )}
        <ChildWrapper isCRM={isCRM} isFinance={isFinance}>{children}</ChildWrapper>
      </div>
    </>
  )
}

export default Layout
