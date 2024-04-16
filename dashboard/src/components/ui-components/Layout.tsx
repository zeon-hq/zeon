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
} from "reducer/slice"
import socketInstance from "socket"
import styled from "styled-components"
import FinanceTopbar from "../../finance/expense/FinanceTopbar"

const ChildWrapper = styled.div<{ isFinance: boolean, isCRM: boolean }>`
  height: ${(props) =>
      props.isFinance ? "calc(100vh - 93px)" : "calc(100vh - 53px)"};
  overflow: hidden;
`

const Layout = ({ children }: { children: any }) => {
  const dispatch = useDispatch()
  const { workspaceId } = useParams()
  const { showSidebar, isFinance, isChat, isCRM, activeChat } = useDashboard()

  useEffect(() => {
    //@ts-ignore
    dispatch(initDashboard(workspaceId))
    socketInstance.on("connect", () => {
      socketInstance.emit("dashboard-connect-event", { workspaceId, ticketId:activeChat?.ticketId });
    })

    socketInstance.off("message").on("message", (data) => {
      dispatch(updateConversation({ data, type: MessageType.SENT }));
    })

    socketInstance.on("open-ticket", (data) => {
      //@ts-ignore
      dispatch(updateInbox(workspaceId));
      // Join the room for a new ticket
      socketInstance.emit("join-room", data.ticketId);
    })

    socketInstance.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    })

    socketInstance.emit("dashboard-reconnect-event", { workspaceId, ticketId:activeChat?.ticketId });
  }, [socketInstance, dispatch, workspaceId, activeChat?.ticketId]);

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
