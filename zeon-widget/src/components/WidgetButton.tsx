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
    localStorage.removeItem("test");
    localStorage.removeItem("threadId");
    localStorage.removeItem("usci");
    localStorage.removeItem("messages");
    dispatch(clearPrevChat())

    dispatch(setStep("initial")) 
  }

  useEffect(() => {
    socketInstance.on("message", (data) => {
      console.log(data)
      if (data.threadId) {
        localStorage.setItem("threadId", data.threadId);
      }
      localStorage.setItem("us-firstName", data.firstName)
      localStorage.setItem("us-lastName", data.lastName)
      localStorage.setItem("us-profileImg", data.image)
      handleMessageReceived(data.message)
      if(!showWidget){
        dispatch(setShowWidget(true))
      }
      playAudio()
    });

    socketInstance.on("typing", (data) => {
     console.log('typing',data);
    });

    socketInstance.on("close-ticket", (data)=> {
      handleCloseTicket()
    })

    socketInstance.on("open-ticket-complete", (info: {ticketId:string}) => {
      localStorage.setItem("ticketId",info.ticketId);
    });
      

    if(localStorage.getItem("ticketId")) {
      socketInstance.emit("reconnect",{ticketId:localStorage.getItem("ticketId")})
    }
  }, []);

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
            <AiOutlineClose size={"2rem"} color={widgetDetails?.appearance.newConversationButton.textColor} />
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
