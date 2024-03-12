import { Flex } from "@mantine/core"
import useDashboard from "hooks/useDashboard"
import { useState } from "react"
import Chat from "./Chat"
import Messages from "./Messages"
import NoContentDialogue from "./component/NoContentDialogue"
import styled from "styled-components"
import CreateChannelModalNew from "components/channel/CreateChannelModalNew"

const MainWrapper = styled.div`
  display: grid;
  grid-template-columns: ${(props: { activeChat?: boolean }) =>
    props?.activeChat ? " 35% 65%" : "35% 65%"};
  // margin-top: -32px;
  // margin-left: -16px;
  height: 100vh;
`

const Inbox = () => {
  const { activeChat, channel } = useDashboard()
  const [openChannelModal, setOpenChannelModal] = useState(false)
  return (
    <>
      {channel?.length === 0 ? (
        <Flex style={{ height: "100vh" }} justify={"center"} align={"center"}>
          <NoContentDialogue
            onClick={() => {
              setOpenChannelModal(true)
            }}
            buttonTitle="Create Channel"
            heading="Welcome to Zeon"
            text="Get started by creating a new channel to receive in coming customer queries. If you have any questions, you can reach out to us via e-mail: team@zeonhq.com"
          />
        </Flex>
      ) : (
        <MainWrapper activeChat={activeChat ? true : false}>
          <Messages />
          <Chat />
        </MainWrapper>
      )}

      <CreateChannelModalNew
        opened={openChannelModal}
        setOpened={setOpenChannelModal}
      />
    </>
  )
}

export default Inbox
