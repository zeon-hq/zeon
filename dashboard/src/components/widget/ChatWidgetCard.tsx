import { Card as MTCard, Space, Text } from "@mantine/core";
import { AiOutlineArrowRight } from "react-icons/ai";

type Props = {
  color?: string;
  text: string;
  heading: string;
  textColor?: "black" | "white";
  bg?: string;
  link?: string;
};

const ChatWidgetCard = ({
  textColor = "black",
  color = "",
  text,
  heading,
  bg,
  link,
}: Props) => {
  return (
    <MTCard
      onClick={() => {
        if (link) {
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
        cursor: "pointer",
        width: "100%",
        border: "1px solid #EAECF0",
        backgroundColor: "rgb(255, 255, 255)",
        boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
      }}
    >
      <MTCard.Section p={6}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Text
              truncate
              color={textColor === "black" ? "#344054" : "white"}
              size="sm"
            >
              {" "}
              {text}{" "}
            </Text>
           
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Text
              color={textColor === "black" ? "#3054B9" : "white"}
              size="sm"
              weight={500}
            >
              {" "}
              {heading}{" "}
            </Text>
            <AiOutlineArrowRight color="#3054B9" />
          </div>
        </div>

        <Space h={5}></Space>
      </MTCard.Section>
    </MTCard>
  );
};

export default ChatWidgetCard;
