import socketInstance from "api/socket";
import ZeonWidgetModal from "components/modal/ZeonWidgetModal";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { clearPrevChat, setMessage, setShowWidget, setStep } from "redux/slice";
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

  function playAudio() {
    //@ts-ignore
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

    dispatch(setStep("initial")) 
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

    socketInstance.on("messageReceived", (data) => {
      localStorage.setItem("us-firstName", data.firstName)
      localStorage.setItem("us-lastName", data.lastName)
      localStorage.setItem("us-profileImg", data.image)
      handleMessageReceived(data.message)
      //TODO: commented this out, need to implement in a better way
      // correct implementation will be showing a indicator icon, no of messages
      
      // if(!showWidget){
      //   dispatch(setShowWidget(true))
      // }
      playAudio()
    });
    socketInstance.on("message", (data) => {
      if (data?.messageSource == 'dashboard') {
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
  }, [socketInstance]);

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
  const {showWidget, widgetDetails} = useWidget();
  
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
