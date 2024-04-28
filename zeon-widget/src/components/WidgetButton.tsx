import socketInstance from "api/socket";
import ZeonWidgetModal from "components/modal/ZeonWidgetModal";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { clearPrevChat, IMessageSource, IUIStepType, setAllOpenConversations, setMessage, setShowWidget, setStep } from "redux/slice";
import styled from "styled-components";
import { MessageType } from "./chat/Chat.types";
import useWidget from "./hooks/useWidget";
import { AiOutlineClose } from "react-icons/ai";
import { notificationSound, widgetImageUrl } from "config/Config";
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
  const { step ,widgetDetails, showWidget, allOpenConversations } = useWidget();
  const playAudio = () => {
    audioPlayer?.current?.play();
  }

  const handleMessageReceived = (processData: any) => {
    if (step == IUIStepType.INITIAL) {
      // Clone the current state of all open conversations to avoid direct mutation
      const copiedAllOpenConversations = cloneDeep(allOpenConversations);

      // Find the conversation that matches the provided ticketId
      const activeConversation = copiedAllOpenConversations.find(
        (conversation) => conversation.ticketId === processData.ticketId
      );

      // Check if the conversation exists
      if (activeConversation) {
        // Push the new message into the messages array of the active conversation
        activeConversation.messages.push({
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

    } else if (step == IUIStepType.CHAT) {
      dispatch(
        setMessage({
          message: processData.message,
          type: MessageType.RECEIVED,
          time: Date.now().toString()
        })
      );
    }
  }

  const handleCloseTicket = () => {
    localStorage.removeItem("channelId");
    localStorage.removeItem("messages");
    dispatch(clearPrevChat())

    dispatch(setStep(IUIStepType.INITIAL)); 
  }

  useEffect(() => {
    console.log('socketInstance',socketInstance);
    
    socketInstance.on('connect', function() {
      const socketId = socketInstance.id;
      console.log('socketId',socketId)
      
      const ticketId = localStorage.getItem("ticketId");
      if (ticketId) {
        socketInstance.emit("join-room", ticketId);
      }
    });

    socketInstance.on("message", (data) => {
      if (data?.messageSource == IMessageSource.DASHBOARD || data?.messageSource ==  IMessageSource.BOTH) {
        setIsMessageUpdated((prev)=> !prev);
        handleMessageReceived(data)
        playAudio()
      }
    })

    socketInstance.on("typing", (data) => {
     console.log('typing',data);
    });

    socketInstance.on("close-ticket", (data)=> {
      handleCloseTicket()
    })

    socketInstance.on("open-ticket-complete", (info: {ticketId:string}) => {
      //TODO: Kaush review
      // localStorage.setItem("ticketId",info.ticketId);
    });

    if(localStorage.getItem("ticketId")) {
      socketInstance.emit("reconnect",{ticketId:localStorage.getItem("ticketId")})
    }

    return () => {
      socketInstance.off("message");
      socketInstance.off("typing");
      socketInstance.off("close-ticket");
      socketInstance.off("open-ticket-complete");
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
            <>
            <AiOutlineClose size={"2rem"} color={widgetDetails?.appearance?.newConversationButton?.textColor} />
            </>
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
