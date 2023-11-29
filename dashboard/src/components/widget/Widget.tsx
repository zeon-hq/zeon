import { Avatar } from "@mantine/core";
import useDashboard from 'hooks/useDashboard';
import styled from "styled-components";
import AppearenceWidgetContent from './AppearenceWidgetContent';
import BehaviorWidgetContent from './BehaviorWidgetContent';
import WidgetIcon from "./WidgetIcon";

import { Text } from "components/ui-components/Dashboard.styles";
import { AiOutlineArrowLeft } from 'react-icons/ai';

type Props = {
    configType: "appearance" | "behavior" | "inChatWidgets";    
}

const Wrapper = styled.div`
  /* height: 25%; */
  background-color: ${(props:{bg:string,stroke:string}) => props.bg};
  color: white ;
  padding: 24px 24px 8px 24px;
  border-radius: 12px;
  position: sticky;
  top: 0;
  z-index: 10000000;
`

const ModalWrapper = styled.div`
  /* TODO: Discuss with ajay if we need fixed height or thr height should depend upon content */
  /* height: 92vh; */
  /* width: 400px; */
  max-height: 70vh;
  border: 1px solid #ced4da;
  border-radius: 8px 8px 8px 8px;
  // box-shadow: rgb(0 0 0 / 35%) 0px 7px 59px;
  box-shadow: 0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08);
  /* right: 16px;
  bottom: 12vh; */
  z-index: 100000000000;
  display: flex;
  flex-direction: column;

  @media only screen and (max-width: 1300px) {
    width: 350px;
  }

  @media only screen and (max-width: 1024px) {
    width: 350px;
  }

  @media only screen and (max-width: 650px) {
    width: 80vw;
    max-height: 100vh;
    position: relative;
    right: 0px;
    bottom: 0px;

  }

  @media only screen and (max-width: 500px) {
    width: 100vw;
    max-height: 100vh;
    position: relative;
    right: 0px;
    bottom: 0px;
  }
`;

const Info = styled.div`
  padding: 10px 20px 20px;
  gap: 10px;
  max-height: 47vh;
  overflow: auto;
  background: white;
  border-radius: 8px;

  @media only screen and (max-width: 650px) {
    max-height: 100vh;
  }

  @media only screen and (max-width: 500px) {
    max-height: 100vh;
  }
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  &:hover {
    cursor: pointer;
  }
`

const Widget = ({configType}: Props) => {
  const { channelsInfo, selectedPage } = useDashboard();
  const appearenceDetails = channelsInfo[selectedPage.name]?.appearance;
  
  return (
    <>
      <ModalWrapper>
        <Wrapper stroke={appearenceDetails?.widgetHeaderSection?.strokeColor} bg={appearenceDetails?.widgetHeaderSection?.topBannerColor}>
          
          <IconContainer>
            <div>
              {
                configType !== "behavior" &&
                <Avatar src={appearenceDetails?.widgetHeaderSection?.topLogo || "https://uploads-ssl.webflow.com/63ff8de5d1f47e7825c30910/63ff9a6ff5a715e67545858d_logowhite.svg"}/>
                // <GiUnicorn size={"1.5rem"} color={appearenceDetails.widgetHeaderSection?.textColor}/>
              }
              {configType === "behavior" && <AiOutlineArrowLeft size={"1rem"} color={appearenceDetails.widgetHeaderSection?.textColor}/>}
            </div>
            {/* <div>
              <AiOutlineClose size={"1.5rem"} color={appearenceDetails.widgetHeaderSection?.textColor}/>
            </div> */}
          </IconContainer>
          {
            configType !== "behavior" &&
            <Text color={appearenceDetails.widgetHeaderSection?.textColor} size='large' weight='bold'> {appearenceDetails.widgetHeaderSection?.mainHeading} </Text>  
          }
          
          <Text color={appearenceDetails.widgetHeaderSection?.textColor} size='medium' weight='normal'> {appearenceDetails.widgetHeaderSection?.subHeading} </Text>
        </Wrapper>
        <Info>
          {
            configType === "appearance" ? 
            <AppearenceWidgetContent/> :
            configType === "behavior" ?
            <BehaviorWidgetContent/> :
            <AppearenceWidgetContent/>
          }
        </Info>
      </ModalWrapper>
      <WidgetIcon/>
    </>
  )
}

export default Widget