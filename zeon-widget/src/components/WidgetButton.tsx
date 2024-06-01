import socketInstance from "api/socket";
import ZeonWidgetModal from "components/modal/ZeonWidgetModal";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { IMessageSource, setAgentName, setAiTyping, setAllOpenConversations, setMessage, setShowWidget, setTyping } from "redux/slice";
import styled from "styled-components";
import { MessageType } from "./chat/Chat.types";
import useWidget from "./hooks/useWidget";
import { AiOutlineClose } from "react-icons/ai";
import { chevronDown, notificationSound, widgetImageUrl } from "config/Config";
import { generateRandomString } from "./hooks/commonUtils";
import { cloneDeep } from "lodash";

const ZeonWidgetWrapper = styled.div`
  z-index: 10000000000;
  position: fixed;
  right: 15px;
  bottom: 25px;
  padding: 10px;
  border-radius: 8px;
  background-color: ${(props:{bg?:string}) => props.bg || "#4c6ef5"};
`;

const WidgetButton = () => {
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const [isMessageUpdated, setIsMessageUpdated] = useState(false);
  const { step ,widgetDetails, showWidget, allOpenConversations, messages, typing } = useWidget();
  const playAudio = () => {
    // audioPlayer?.current?.play();
  }

  const handleMessageReceived = (processData: any, isNewTicket:boolean) => {
    if (isNewTicket) {
      // Clone the current state of all open conversations to avoid direct mutation
      const copiedAllOpenConversations = cloneDeep(allOpenConversations);

      // Find the conversation that matches the provided ticketId
      const currentActiveConversation = copiedAllOpenConversations.find(
        (conversation) => conversation.ticketId === processData.ticketId
      );

      // Check if the conversation exists
      if (currentActiveConversation) {
        // Push the new message into the messages array of the active conversation
        currentActiveConversation.unreadMessage = (currentActiveConversation?.unreadMessage || 0) + 1;
        currentActiveConversation.messages.push({
        message: processData.message,
          type: MessageType.RECEIVED,
          time: Date.now().toString()
        });

        // Dispatch the updated conversations to the Redux store
        dispatch(setAllOpenConversations(copiedAllOpenConversations));
      } else {
        // Handle the case where no conversation matches the ticketId
        console.error('No active conversation found for the provided ticketId');
        // Optionally, add logic to create a new conversation or show an error message, etc.
      }

    } else {
      dispatch(
        setMessage({
          message: processData.message,
          type: MessageType.RECEIVED,
          time: Date.now().toString()
        })
      );
    }
  }

  useEffect(()=>{
    const ticketId = localStorage.getItem("ticketId");
      if (ticketId) {
        socketInstance.emit("join_ticket", {
          ticketId,
          workspaceId: widgetDetails?.workspaceId,
          source:IMessageSource.WIDGET
        });
      }
  },[])

  useEffect(() => {
    const ticketId = localStorage.getItem("ticketId");
    socketInstance.on('connect', function() {
      if (ticketId) {
        socketInstance.emit("join_ticket", {
          ticketId,
          workspaceId: widgetDetails?.workspaceId,
          source:IMessageSource.WIDGET
        });
      }
    });

    socketInstance.on("ai_responding", (data)=>{
      console.log("ai_responding", data);
      dispatch(setAiTyping(true));
      dispatch(setAgentName(data?.agentName || "Agent"));
    });  
    
    socketInstance.on("ai_stop_responded", (data)=>{
      console.log("ai_stop_responding", data);
      dispatch(setAiTyping(false));
      dispatch(setAgentName(data?.agentName || "Agent"));
    });  

    socketInstance.on("message", (data) => { 
      if (data?.messageSource == IMessageSource.DASHBOARD || data?.messageSource ==  IMessageSource.BOTH || data?.messageSource ==  IMessageSource.SLACK) {
        setIsMessageUpdated((prev)=> !prev);
        const checkIsThisNewTicket:boolean = (!!allOpenConversations.find((conversation) => conversation.ticketId === data.ticketId))
        handleMessageReceived(data, checkIsThisNewTicket);
        playAudio()
      }
    });

    socketInstance.on("dashboard_typing",(data)=>{
      if (!typing && data.ticketId == localStorage.getItem("ticketId")) {
        dispatch(setTyping(true));
      }
    });

    socketInstance.on("dashboard_stop_typing",(data)=>{
      // if (typing && data.ticketId == localStorage.getItem("ticketId")) {
        dispatch(setTyping(false));
      // }
    });

    return () => {
      socketInstance.off("message");
    }
  }, [socketInstance, isMessageUpdated]);

  const openWidget = () => {
    const getWidgetId = localStorage.getItem("widgetId");
    if (getWidgetId){
      dispatch(setShowWidget(true))
    }else {
      const widgetId = generateRandomString(6);
      localStorage.setItem("widgetId", widgetId);
      dispatch(setShowWidget(true))
    }
  }

  const dispatch = useDispatch();
  
  return (
    <>
      <ZeonWidgetWrapper bg={widgetDetails?.appearance?.widgetButtonSetting?.widgetButtonColor} onClick={openWidget}>
        {
          !showWidget ? (
            <img width={"35px"} src={widgetImageUrl} alt="wserstak-widget"/>
          ) : (
            <div style={{paddingTop:"4px"}}>
            <img  width={"35px"} src={chevronDown} alt="wserstak-widget"/>
            </div>
          )
        }
        
      </ZeonWidgetWrapper>
      {
        showWidget && (
            <ZeonWidgetModal/>
        )
      }
      <audio ref={audioPlayer} src={notificationSound} />
    </>
  );
};

export default WidgetButton;
