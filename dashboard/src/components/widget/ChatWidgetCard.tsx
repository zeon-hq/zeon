import { Card as MTCard, Space, Text } from "@mantine/core";
import { AiOutlineArrowRight } from "react-icons/ai";

type Props = {
    color ?: string,
    text: string,
    heading: string,
    textColor ?: "black" | "white"
    bg ?: string,
    link?:string
}

const ChatWidgetCard = ({ textColor="black" , color="", text, heading,bg, link}: Props) => {
  return (
    <MTCard
    onClick={()=>{
      if (link){
        window.open(link, "_blank");
      }
    }}
    styles={{
      root: {
        borderRadius: "12px",
        borderColor: "1px solid var(--gray-200, #EAECF0)",
        "&:hover": {
          cursor: "pointer",
        },
      },
    }}
    mt={15}
    style={{
      cursor:'pointer',
      width: "100%",
      border: "1px solid #DEE2E6",
      backgroundColor: bg ? bg : " #fff",
    }}
  >
    <MTCard.Section p={10}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Text
            color={textColor === "black" ? "dark" : "white"}
            size="sm"
            weight={500}
          >
            {" "}
            {heading}{" "}
          </Text>
        </div>
        <div>
          <AiOutlineArrowRight />
        </div>
      </div>

      <Space h={5}></Space>
      <Text
        truncate
        color={textColor === "black" ? "dark" : "white"}
        size="sm"
      >
        {" "}
        {text}{" "}
      </Text>
    </MTCard.Section>
  </MTCard>
  )
}

export default ChatWidgetCard