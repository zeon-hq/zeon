import { AppShell }from '@mantine/core';
import Details from 'components/details/Details';
import Sidebar from 'components/details/sidebar/Sidebar';
import Topbar from 'components/topbar/Topbar';
import { useEffect } from 'react';
import useDashboard from "hooks/useDashboard";
import {useDispatch} from "react-redux";
import { initDashboard, MessageType, updateConversation, updateInbox } from 'reducer/slice';
import {useParams} from "react-router-dom"
import socketInstance from 'socket';
import styled from 'styled-components'
import FinanceTopbar from '../../finance/expense/FinanceTopbar';
import ChatSidebar from 'components/chat/ChatSidebar';
import FinanceSidebar from 'finance/expense/FinanceSidebar';

const ChildWrapper = styled.div<
  {isFinance: boolean}
>`
  height: ${
    props => props.isFinance ? "calc(100vh - 100px)" : "calc(100vh - 53px)"
  } calc(100vh - 100px);
    overflow: hidden;
`

const Layout = ({children}:{children:any}) => {
  const dispatch = useDispatch();
  const {workspaceId} = useParams();
  const { showSidebar } = useDashboard();

  // get tge url
  const url = window.location.href;
  // check if location has finance
  const isFinance = url.includes("finance");
  
  useEffect(() => {
    //@ts-ignore
      dispatch(initDashboard(workspaceId));
      socketInstance.on('connect', () => {
        socketInstance.emit('dashboard-connect-event', workspaceId);
      });

      socketInstance.off("message").on('message', (data: any) => {
        console.log("message", data)
        dispatch(updateConversation({data, type:MessageType.SENT}))
      })

      socketInstance.on("open-ticket", (data:any) => {
        //@ts-ignore
        dispatch(updateInbox(workspaceId))
      })

      socketInstance.on("connect_error", (err: any) => {
        console.log(`connect_error due to ${err.message}`);
      });

      socketInstance.emit("dashboard-reconnect-event", workspaceId);
  },[socketInstance])

  return (
    <>
      <Topbar workspaceId={workspaceId || ""}/>
      {
        isFinance && <FinanceTopbar/>
      }
      
      <div
        style={{
          display: "grid",
          gridTemplateColumns: showSidebar ? "20% 80%" : "100%",
          height: isFinance ? "calc(100vh - 100px)" : "calc(100vh - 53px)",
          overflow: "hidden",
        }}
      >
        {workspaceId && showSidebar == true ? 
         (
          isFinance ? <FinanceSidebar workspaceId={workspaceId}/> : <ChatSidebar workspaceId={workspaceId} />
         ) : <></>}
        <ChildWrapper isFinance={isFinance}>
        {children}
        </ChildWrapper>
      </div>
     
    </>
    // <AppShell
    //   padding="0px"
    //   navbar={workspaceId && showSidebar == true ? <Sidebar workspaceId={workspaceId} /> : <></>}
    //   header={<Topbar workspaceId={workspaceId || ""}/>}
    //   styles={(theme) => ({
    //     main: { 
    //       height:'100vh',
    //       overflowY: 'auto',
    //       backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.white ,
    //       marginTop:'0px',
    //     },
          
    //   })}
    // >
    //   <Details/>
    // </AppShell>
  );
}

export default Layout