import styled from "styled-components";
import { MessageType } from "components/chat/Chat.types";
import { Text } from "components/ui-components/uStyleComponents";
import { preProcessText } from "components/hooks/commonUtils";
import useWidget from "components/hooks/useWidget";
//@ts-ignore
import { format, isToday } from 'date-fns';

interface WrapperProps {
  type: MessageType;
}

const SingleChat = styled.div<WrapperProps>`
  display: flex;
  flex-direction: column;
  align-items:${props => props.type === MessageType.RECEIVED ? "start" : "end"} ;
  margin-left: ${props => props.type === MessageType.RECEIVED ? "" : "20px"} ;
  margin-right: ${props => props.type === MessageType.RECEIVED ? "20px" : ""} ;;
`

const Wrapper = styled.div<WrapperProps>`
  background-color: ${(props) =>
  props.type === MessageType.RECEIVED ? " #F2F4F7" : "#3C69E7"};
  padding: 10px 14px;
  margin-top: 16px;
  width: fit-content;
  color:${(props) =>
    props.type === MessageType.RECEIVED ? "" : "white"};
  border-radius: 8px;
  `

const MessageCard = ({info}:any) => {

  const getTime  = (time: string) => {
    const inputTime = +time;
    const date = new Date(inputTime);
  
    const dateFormat = isToday(date) ? 'h:mm a' : 'd/M/yyyy h:mm a';
    return format(date, dateFormat);
  }

  const {email} = useWidget()

  const {type, message} = info
  const newMessage = preProcessText(message,{email})
  return (
    <>
      
      <SingleChat type={type}>
        <Wrapper type={type}>
          <Text style={{margin:0}} dangerouslySetInnerHTML={{ __html: newMessage }} linkColor = {type === MessageType.SENT ? "white" : ""} color={type === MessageType.SENT ? "white" : "black"} size="medium" weight="normal"/>
        </Wrapper>
        <Text size="small" weight="normal" >{getTime(info.createdAt || info.time)} </Text>
      </SingleChat>
      
      
      
    </>
  );
};

export default MessageCard;
