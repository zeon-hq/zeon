import { ActionIcon, Flex, Input } from "@mantine/core";
import socketInstance from "api/socket";
import useEmbeddable, { IEmbeddableOutput } from "components/hooks/useEmbeddable";
import useWidget from "components/hooks/useWidget";

interface IChatMessageFooter {
    submitForm: () => void;
    setValue: any;   
}

const ChatMessageFooter = ({submitForm, setValue}:IChatMessageFooter) => {
  const { widgetDetails, typing } = useWidget();
  const ticketId = localStorage.getItem("ticketId");
  const isEmbeddable: IEmbeddableOutput = useEmbeddable();
  return (
    <Flex
    style={{
      width: "98%",
      justifyContent: "space-between",
      alignItems: "end",
      padding: "0px 6px",
    }}
  >
    <Input
      sx={{
        position: "sticky",
        bottom: 0,
        fontSize: "14px",
        width: "85%",
        borderRadius: "8px",
      }}
      placeholder="Message"
      mt="8px"
      onChange={(e)=>{
        setValue('message', e.target.value)
        socketInstance.emit("widget_typing", {
          workspaceId:widgetDetails?.workspaceId,
          ticketId:ticketId,
          channelId:isEmbeddable.channelId,
          source:'widget'
        }) 
      }}

      onBlur={()=>{
        socketInstance.emit("widget_stop_typing", {
          workspaceId:widgetDetails?.workspaceId,
          ticketId:ticketId,
          channelId:isEmbeddable.channelId,
          source:'widget'
        }) 
      }}
      size="md"
      radius={"md"}
      // {...register("message")}
    />

    <ActionIcon
    onClick={submitForm}
      variant={"filled"}
      style={{
        width: "42px",
        height: "42px",
        borderRadius: "8px",
        backgroundColor: "#3054B9",
      }}
    >
      <img
        width={"20px"}
        src="https://zeonhq.b-cdn.net/send-01.svg"
        alt="zeon-logo"
      />
    </ActionIcon>

  </Flex>
  )
}

export default ChatMessageFooter;