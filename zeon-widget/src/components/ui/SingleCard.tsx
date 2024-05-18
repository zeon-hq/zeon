import { Badge, Card as MTCard, Space, Text } from "@mantine/core";
import { ReactNode } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";

type SingleCardProps = {
  heading: string;
  text: string;
  icon?: ReactNode;
  bg?: string;
  onClick?: () => void;
  textColor: "black" | "white";
  isContinueConversation?: boolean;
  totalUnreadMessage?: number;
};

const SingleCard = ({
  heading,
  text,
  icon,
  bg = "",
  textColor = "black",
  onClick = () => {},
  isContinueConversation = false,
  totalUnreadMessage = 0,
}: SingleCardProps) => {
  return (
    // <MTCard
    //     styles={{
    //         root: {
    //             borderRadius: "12px",
    //             borderColor: "1px solid var(--gray-200, #EAECF0)",
    //             "&:hover": {
    //                 cursor: "pointer",
    //             },
    //         },
    //     }}
    //     onClick={onClick}
    //     mt={isContinueConversation ? 0 : 15}
    //     style={{
    //         cursor: 'pointer',
    //         width: "100%",
    //         border: "1px solid #DEE2E6",
    //         backgroundColor: bg ? bg : " #fff",
    //     }}
    // >
    //     <MTCard.Section p={10}>
    //         <div
    //             style={{
    //                 display: "flex",
    //                 alignItems: "center",
    //                 justifyContent: "space-between",
    //             }}
    //         >
    //             <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
    //                 {icon}
    //                 <Text
    //                     color={textColor === "black" ? "dark" : "white"}
    //                     size="sm"
    //                     weight={500}
    //                 >
    //                     {" "}
    //                     {heading}{" "}
    //                 </Text>
    //             </div>
    //             <div>
    //                 {
    //                     totalUnreadMessage > 0 ?
    //                         <Badge color="blue" size="sm">{totalUnreadMessage}</Badge>
    //                         :
    //                         <AiOutlineArrowRight />
    //                 }
    //             </div>
    //         </div>

    //         <Space h={5}></Space>
    //         <Text
    //             truncate
    //             color={textColor === "black" ? "dark" : "white"}
    //             size="sm"
    //         >
    //             {" "}
    //             {text}{" "}
    //         </Text>
    //     </MTCard.Section>
    // </MTCard>
    <MTCard
      onClick={onClick}
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
              {/* Show only first 35 character */}
                {text.slice(0, 35)}...
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

export default SingleCard;
