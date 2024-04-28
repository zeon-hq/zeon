import socketInstance from "api/socket";
import ZeonWidgetModal from "components/modal/ZeonWidgetModal";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { clearPrevChat, IUIStepType, setMessage, setShowWidget, setStep } from "redux/slice";
import styled from "styled-components";
import { MessageType } from "./chat/Chat.types";
import useWidget from "./hooks/useWidget";
import { AiOutlineClose } from "react-icons/ai";
import { notificationSound, widgetImageUrl } from "config/Config";
import { generateRandomString } from "./hooks/commonUtils";

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
  const { step ,widgetDetails, showWidget } = useWidget();

  const playAudio = () => {
    audioPlayer?.current?.play();
  }

  const handleMessageReceived  = (processedMessage:string) => {
    dispatch(
      setMessage({
        message: processedMessage,
        type: MessageType.RECEIVED,
        time: Date.now().toString()
      })
    );
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
      if (data?.messageSource == 'dashboard' || data?.messageSource ==  "both") {
        setIsMessageUpdated((prev)=> !prev);
        handleMessageReceived(data.message)
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
