import { ActionIcon, Flex, Input } from "@mantine/core";
import socketInstance from "api/socket";
import useEmbeddable, {
  IEmbeddableOutput,
} from "components/hooks/useEmbeddable";
import useWidget from "components/hooks/useWidget";
import styled, { keyframes } from "styled-components";

interface IChatMessageFooter {
  submitForm: () => void;
  setValue: any;
  watch: any;
}

const typing = keyframes`
  0%, 20% {
    color: rgba(0,0,0,0);
    text-shadow:
      .25em 0 0 rgba(0,0,0,0),
      .5em 0 0 rgba(0,0,0,0);
  }
  40% {
    color: black;
    text-shadow:
      .25em 0 0 rgba(0,0,0,0),
      .5em 0 0 rgba(0,0,0,0);
  }
  60% {
    text-shadow:
      .25em 0 0 black,
      .5em 0 0 rgba(0,0,0,0);
  }
  80%, 100% {
    text-shadow:
      .25em 0 0 black,
      .5em 0 0 black;
  }
`;

const TypingDots = styled.span`
  &:after {
    content: " ...";
    font-size: 1em;
    animation: ${typing} 1s steps(5, end) infinite;
  }
  color: rgb(52, 64, 84);
  font-size: 14px;
  font-weight: 500;
  margin-left: 8px;
`;

const ChatMessageFooter = ({
  submitForm,
  setValue,
  watch,
}: IChatMessageFooter) => {
  const { widgetDetails, aiTyping, agentName, widgetId } = useWidget();
  const ticketId = localStorage.getItem("ticketId");
  const isEmbeddable: IEmbeddableOutput = useEmbeddable();
  return (
    <>
      {aiTyping && (
        <>
          <TypingDots>{agentName} is typing</TypingDots>
        </>
      )}
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
          onChange={(e) => {
            setValue("message", e.target.value);
            socketInstance.emit("widget_typing", {
              workspaceId: widgetDetails?.workspaceId,
              ticketId: ticketId,
              channelId: isEmbeddable.channelId,
              source: "widget",
              widgetId:widgetId,
            });
          }}
          value={watch("message")}
          onBlur={() => {
            socketInstance.emit("widget_stop_typing", {
              workspaceId: widgetDetails?.workspaceId,
              ticketId: ticketId,
              channelId: isEmbeddable.channelId,
              source: "widget",
              widgetId:widgetId,
            });
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
    </>
  );
};

export default ChatMessageFooter;
