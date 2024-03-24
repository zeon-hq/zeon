import { ActionIcon, Button, Flex, Image, Input, Tabs } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import chatSendIcon from "assets/chatSendIcon.svg";
import useDashboard from "hooks/useDashboard";
import { FormEvent, useEffect, useState } from "react";
import { BsArrow90DegDown } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { MessageType, updateConversation } from "reducer/slice";
import socketInstance from "socket";
import { IMessage } from "../inbox.types";
import SelectCannedResponse from "./SelectCannedResponseChatArea";
import SingleMessage from "./SingleMessage";
// import { relative } from "path";

interface ITabContent {
  onFormSubmit: (e: any, type: MessageType) => void;
  type: MessageType;
  value: string;
  inputPlaceHolder: string;
  onIconClick: () => void;
  onInputOnChange: (e: any) => void;
}

const TabContent = ({
  onFormSubmit,
  type,
  value,
  onInputOnChange,
  onIconClick,
  inputPlaceHolder,
}: ITabContent) => {
  return (
    <>
      <Flex
        style={{
          width: "auto",
          justifyContent: "space-between",
          padding: "8px 8px",
        }}
      >
        <form
          onSubmit={(e) => {
            e?.preventDefault();
            onFormSubmit(e, type);
          }}
          style={{ width: "100%", padding: "0px 8px" }}
        >
          <Input
            value={value}
            style={{ borderRadius: "8px" }}
            onChange={onInputOnChange}
            placeholder={inputPlaceHolder}
            
          />
        </form>
        <ActionIcon
          onClick={() => {
            onIconClick();
          }}
          variant="filled"
          style={{
            width: "35px",
            height: "35px",
            borderRadius: "4px",
            backgroundColor: "#3054B9",
          }}
        >
          <Image maw={20} radius="md" src={chatSendIcon} />
        </ActionIcon>
      </Flex>
    </>
  );
};

const ChatArea = () => {
  const { activeChat, workspaceInfo } = useDashboard();
  const [value, handleChange] = useInputState("");
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<string | null>("reply");
  const [query, setQuery] = useInputState("");

  
  

  const scrollToBottom = () => {
      const chatContainerParentDiv: any = document.getElementById('chat_container_div');
      const lastChild = chatContainerParentDiv.lastElementChild;
      lastChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  const sendMessage = (message: string, type: MessageType) => {
    socketInstance.emit("dashboard-message-event", {
      workspaceId: workspaceInfo?.workspaceId,
      channelId: localStorage.getItem("usci"),
      type,
      isRead: true,
      message,
      ticketId: activeChat?.ticketId,
    });

    dispatch(
      updateConversation({
        data: {
          createdAt: new Date(),
          ticketId: activeChat?.ticketId || "",
          isRead: true,
          type,
          message,
        },
        type,
      })
    );

    handleChange("");
  };

  const submit = (e: FormEvent, type: MessageType) => {
    e?.preventDefault();
    sendMessage(value, type);
  };

  useEffect(()=>{
    // when tab change clear the query text and value
    setQuery("");
    // handleChange("");
  },[activeTab]) // eslint-disable-line

  useEffect(()=>{
    scrollToBottom();
  },[activeChat?.messages]) // eslint-disable-line

  return (
      <>
          <div
              style={{
                  display: "flex",
                  // height: "100%",
                  flexDirection: "column",
                  position:"relative",
                  height: "calc(100vh - 180px)"
              }}
          >
              <div
              id='chat_container_div'
                  style={{
                      padding: "0px 12px 24px 12px",
                      height: "calc(100vh - 171px)",
                      backgroundColor: "#F9FAFB",
                      overflowY: "scroll"
                  }}
              >
                      {(activeChat?.messages?.length || 0) > 10 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                leftIcon={<BsArrow90DegDown size={"1rem"} />}
                style={{
                  color: "black",
                  backgroundColor: "#f6f6f6",
                  fontWeight: 500,
                }}
                onClick={() => scrollToBottom()}
              >
                {" "}
                Scroll to bottom!{" "}
              </Button>
            </div>
          )}
                  {activeChat && (
                      <>
                          {/* Hardcoding first message */}
                          <SingleMessage
                              info={{
                                  createdAt: activeChat.createdAt,
                                  ticketId: activeChat._id,
                                  isRead: true,
                                  type: MessageType.SENT,
                                  message: activeChat.text,
                              }}
                          />
                          {activeChat?.messages?.map((message: IMessage) => (
                              <SingleMessage info={message} />
                          ))}
                           {/* <div ref={elementRef} /> */}
                      </>
                  )}
              </div>

              <div
                  className=""
                  style={{
                    
                      width: "100%",
                      bottom: "0px"

  
                  }}
              >
                  <Tabs
                      color="gray"
                      value={activeTab}
                      onTabChange={setActiveTab}
                      style={{
                          // position: "absolute",
                          // bottom: "0px",
                          width: "100%",
                          background: "white",
                          borderTop: "1px solid #EAECF0",
                          padding: "0px 0px",
                      }}
                      defaultValue="reply"
                  >
                      <Tabs.Panel value="canned">
                          <SelectCannedResponse
                              setActiveTab={setActiveTab}
                              handleChange={handleChange}
                              query={query}
                          />
                      </Tabs.Panel>

                      <Tabs.List pl={"12px"}>
                          <Tabs.Tab
                              style={{
                                  color: "#667085",
                                  fontSize: "12px",
                                  fontWeight: "500",
                              }}
                              value="reply"
                          >
                              Reply
                          </Tabs.Tab>
                          <Tabs.Tab
                              value="notes"
                              style={{
                                  color: "#667085",
                                  fontSize: "12px",
                                  fontWeight: "500",
                              }}
                          >
                              Post Note
                          </Tabs.Tab>
                          <Tabs.Tab
                              style={{
                                  color: "#667085",
                                  fontSize: "12px",
                                  fontWeight: "500",
                              }}
                              value="canned"
                          >
                              Canned Responses
                          </Tabs.Tab>
                      </Tabs.List>

                      <Tabs.Panel value="reply">
                          <TabContent
                              type={MessageType.RECEIVED}
                              value={value}
                              onIconClick={() => {
                                value && sendMessage(value, MessageType.RECEIVED);
                              }}
                              inputPlaceHolder="Enter your reply"
                              onInputOnChange={handleChange}
                              onFormSubmit={(e, type) => {
                                value && sendMessage(value, MessageType.RECEIVED);
                              }}
                          />
                      </Tabs.Panel>

                      <Tabs.Panel value="notes">
                          <TabContent
                              type={MessageType.NOTE}
                              inputPlaceHolder="Type your Notes here"
                              onIconClick={() => {
                                value && sendMessage(value, MessageType.NOTE);
                              }}
                              value={value}
                              onInputOnChange={handleChange}
                              onFormSubmit={(e, type) => {
                                value && submit(e.target.value, type);
                              }}
                          />
                      </Tabs.Panel>

                      <Tabs.Panel value="canned">
                          <TabContent
                              type={MessageType.NOTE}
                              onIconClick={() => {
                                
                                  // sendMessage(value, MessageType.NOTE);
                              }}
                              inputPlaceHolder="Search for Canned Response"
                              value={query}
                              onInputOnChange={setQuery}
                              onFormSubmit={(e, type) => {
                                  // sendMessage(value, MessageType.NOTE);
                              }}
                          />
                      </Tabs.Panel>
                  </Tabs>
              </div>
          </div>
      </>
  );
};

export default ChatArea;
