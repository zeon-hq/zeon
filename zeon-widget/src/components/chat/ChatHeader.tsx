import styled from "styled-components";
import { ActionIcon, Avatar, Box } from "@mantine/core";
import { AiOutlineArrowLeft } from "components/icons/icons";
import { Text } from "components/ui-components/uStyleComponents";
import {useDispatch} from "react-redux"
import { setActiveConversation, setMessage, setStep } from "redux/slice";
import useWidget from "components/hooks/useWidget";
import { Mail } from "tabler-icons-react";

 //@ts-ignore
const Wrapper = styled.div`
  background-color: ${(props:{bg:string}) => props.bg};
  color: white;
  padding: 16px 24px;
  position: sticky;
  top: 0;
  border-radius: 12px 12px 0px 0px;
  border-bottom: ${(props:{bg:string, stroke:string}) => props.stroke === "dark" ? "1px solid #cccccc" : "1px solid white" };
`;

const IconWrapper = styled.div`
  display: flex;
  /* justify-content: space-evenly; */
  align-items: center;
  /* justify-content: center; */
  gap: 23px;
  justify-content: flex-start;
  &:hover {
    cursor: pointer;
  }
  
`;

const InfoWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: flex-start;
`;

const ChatHeader = () => {

  const dispatch = useDispatch()
  const {widgetDetails} = useWidget()
  
  const handleBackClick = () => {
    dispatch(setStep("initial"))
    dispatch(setActiveConversation(""))
    dispatch(setMessage([]))
  }

  let firstName = localStorage.getItem("us-firstName") || widgetDetails.behavior.widgetBehavior.agentName
  firstName = firstName === "undefined" || firstName === "null" ? "Agent" : firstName

  let lastName = localStorage.getItem("us-lastName")
  lastName = lastName === "undefined" || lastName === "null" ? "" : lastName

  return (
    //@ts-ignore
    <Wrapper stroke={widgetDetails.appearance.widgetHeaderSection.strokeColor}  bg={widgetDetails?.appearance?.widgetHeaderSection?.topBannerColor}>
      <IconWrapper>
        <ActionIcon size="lg" onClick={handleBackClick} radius="md" variant="outline">
        <AiOutlineArrowLeft color={widgetDetails.appearance.widgetHeaderSection.textColor || "black"} size={"1rem"} />
        </ActionIcon>
        
        <Box sx={{display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%"}}>
          <Text size="medium" weight="bold">
            Ticket Number : {localStorage.getItem("ticketId")?.slice(-6)}
          </Text>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Mail size={20} color="#475467" strokeWidth={1.5}/> 
            <Text 
            onClick={()=>{
              window.location.href =  `mailto:ajay@zeon.com`;
            }}
            style={{
              color:"#475467"
            }} size="small" weight="bold">
            Send Us Email
            </Text>
          </div>
        </Box>
      </IconWrapper>
    </Wrapper>
  );
};

export default ChatHeader;
