import { ActionIcon, Box } from "@mantine/core";
import useWidget from "components/hooks/useWidget";
import { AiOutlineArrowLeft } from "components/icons/icons";
import { Text } from "components/ui-components/uStyleComponents";
import { useDispatch } from "react-redux";
import { IUIStepType, setActiveConversation, setMessage, setStep } from "redux/slice";
import styled from "styled-components";
import { Mail } from "tabler-icons-react";

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

const WidgetChatHeader = () => {
  const dispatch = useDispatch()
  const {widgetDetails} = useWidget()
  const ticketNumber = localStorage.getItem("ticketId")?.slice(-6);
  const handleBackClick = () => {
    dispatch(setStep(IUIStepType.INITIAL))
    dispatch(setActiveConversation(""))
    dispatch(setMessage([]))
  }

  let firstName = localStorage.getItem("us-firstName") || widgetDetails?.behavior.widgetBehavior.agentName
  firstName = firstName === "undefined" || firstName === "null" ? "Agent" : firstName

  let lastName = localStorage.getItem("us-lastName")
  lastName = lastName === "undefined" || lastName === "null" ? "" : lastName

  return (
    <Wrapper stroke={widgetDetails?.appearance.widgetHeaderSection.strokeColor}  bg={widgetDetails?.appearance?.widgetHeaderSection?.topBannerColor}>
      <IconWrapper>
        <ActionIcon size="lg" onClick={handleBackClick} radius="md" variant="outline">
        <AiOutlineArrowLeft color={widgetDetails?.appearance.widgetHeaderSection.textColor || "black"} size={"1rem"} />
        </ActionIcon>
        
        <Box sx={{display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%"}}>
          <Text size="medium" weight="bold">
            Ticket Number : {ticketNumber}
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

export default WidgetChatHeader;