import { ActionIcon, Flex, Input } from "@mantine/core";

interface IChatMessageFooter {
    submitForm: () => void;
    watch: any;
    register: any;
    
}

const ChatMessageFooter = ({submitForm, watch, register}:IChatMessageFooter) => {
  return (
    <Flex
    style={{
      width: "90%",
      justifyContent: "space-between",
      alignItems: "end",
      padding: "0px 24px",
      marginBottom: "24px",
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
      size="md"
      radius={"md"}
      {...register("message")}
    />

    <ActionIcon
    onClick={submitForm}
    // disabled={watch()?.message?.length == 0}
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