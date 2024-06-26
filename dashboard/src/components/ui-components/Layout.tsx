import ChatSidebar from "components/chat/ChatSidebar"
import Topbar from "components/topbar/Topbar"
import CRMSidebar from "crm/CRMSidebar"
import FinanceSidebar from "finance/expense/FinanceSidebar"
import useDashboard from "hooks/useDashboard"
import { useEffect, useState } from "react"
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
  const { showSidebar, isFinance, isChat, isCRM} = useDashboard()
  const [isConnected, setIsConnected] = useState(false)
  useEffect(() => {
    //@ts-ignore
    dispatch(initDashboard(workspaceId))

    // socketInstance.off("message").on("message", (data) => {
    //   dispatch(updateConversation({ data, type: MessageType.SENT }));
    // })

    socketInstance.on("message", (data) => {
      if (data?.messageSource === 'widget' || data?.messageSource ===  "both" || data?.messageSource ===  "slack") {
        if (data?.isNewTicket) {
          //@ts-ignore
          dispatch(updateInbox(workspaceId));
        } else {
          if(data?.messageSource ===  "slack") {
            dispatch(updateConversation({ data:{...data}, type: MessageType.RECEIVED }));
          } else {
            dispatch(updateConversation({ data:{...data}, type: MessageType.SENT }));
          }
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
    
    socketInstance.on("human_intervention_needed", (data)=>{
      dispatch(updateConversationAIStatus({
        data, 
        type:ITicketType.HUMAN_REQUIRED
      }));
    });

    socketInstance.on("ai_stop_responded", (data)=>{
      dispatch(updateConversationAIStatus({data}));
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socketInstance.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
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
            <ChatSidebar isConnected={isConnected}/>
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
