import { Card as MTCard, Space, Text, Tooltip } from "@mantine/core";
import { MessageType } from "components/chat/Chat.types";
import { preProcessText } from "components/hooks/commonUtils";
import useWidget from "components/hooks/useWidget";
import { ReactNode } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { setEmail, setMessage, setStep } from "redux/slice";
import {
  Book2,
  BrandDiscord,
  BrandInstagram,
  BrandLinkedin,
  BrandSlack,
  BrandTwitch,
  BrandTwitter,
  BrandYoutube,
  Calendar,
  Message2,
} from "tabler-icons-react";

type SingleCardProps = {
  heading: string;
  text: string;
  icon?: ReactNode;
  bg?: string;
  onClick?: () => void;
  textColor: "black" | "white";
  isNewConversation?: boolean;
  isContinueConversation?: boolean;
};

export const SingleCard = ({
  heading,
  text,
  icon,
  bg = "",
  textColor = "black",
  onClick = () => {},
  isNewConversation = false,
  isContinueConversation = false,
}: SingleCardProps) => {
  return (
    <MTCard
      styles={{
        root: {
          borderRadius: "12px",
          borderColor: "1px solid var(--gray-200, #EAECF0)",
          "&:hover": {
            cursor: "pointer",
          },
        },
      }}
      onClick={onClick}
      mt={isContinueConversation ? 0 : 15}
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
            {icon}
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
  );
};

/**
 *
 * Include props as Icon, Heading and Text
 */

// Remove after test

const Card = () => {
  const dispatch = useDispatch();
  const { widgetDetails, isOutOfOperatingHours, allOpenConversations } =
    useWidget();
  const iconAndNameMapping = (name: string) => {
    switch (name) {
      case "slack":
        return <BrandSlack size={20} color="black" strokeWidth={1} />;
      case "twitch":
        return <BrandTwitch size={20} color="black" strokeWidth={1} />;
      case "twitter":
        return <BrandTwitter size={20} color="black" strokeWidth={1} />;
      case "youtube":
        return <BrandYoutube size={20} color="black" strokeWidth={1} />;
      case "discord":
        return <BrandDiscord size={20} color="black" strokeWidth={1} />;
      case "instagram":
        return <BrandInstagram size={20} color="black" strokeWidth={1} />;
      case "calendly":
        return <Calendar size={20} color="black" strokeWidth={1} />;
      case "linkedin":
        return <BrandLinkedin size={20} color="black" strokeWidth={1} />;
      case "docs":
        return <Book2 size={20} color="black" strokeWidth={1} />;
      default:
        return <Message2 size={20} color="black" strokeWidth={1} />;
    }
  };

  return (
    <>
      {widgetDetails.behavior?.operatingHours?.enableOperatingHours &&
      widgetDetails.behavior.operatingHours
        .hideNewConversationButtonWhenOffline &&
      isOutOfOperatingHours(
        widgetDetails.behavior?.operatingHours?.operatingHours.to,
        widgetDetails.behavior?.operatingHours?.operatingHours.from,
        widgetDetails.behavior?.operatingHours?.timezone
      ) ? (
        <></>
      ) : (
        <>
          <Text size="sm" weight={500} mt="8px">
            Open Tickets
          </Text>
          {allOpenConversations.length > 0 &&
            allOpenConversations.map((data: any) => {
              const messageReplaced = preProcessText(
                data.messages[data.messages.length - 1]?.message || "",
                { email: data.customerEmail }
              );
              return (
                <>
                  <SingleCard
                    heading={`Ticket Number: ${data.ticketId}`}
                    text={`${
                      data.messages[data.messages.length - 1]?.type ===
                      MessageType.SENT
                        ? "You"
                        : "Agent"
                    } : ${messageReplaced}`}
                    onClick={() => {
                      localStorage.setItem("ticketId", data.ticketId);
                      const messageDataArray = [
                        ...[
                          {
                            type: MessageType.SENT,
                            time: data.createdAt,
                            message: data.text,
                          },
                        ],
                        ...data.messages,
                      ];
                      dispatch(setMessage(messageDataArray));
                      dispatch(setEmail(data.customerEmail));
                      dispatch(setStep("chat"));
                    }}
                    textColor={"black"}
                  />
                </>
              );
            })}
        </>
      )}

      <Text size="sm" weight={500} mt="16px">
        {" "}
        Resources{" "}
      </Text>
      {widgetDetails.inChatWidgets.map((item) => (
        <SingleCard
          key={item.title + item.subTitle}
          heading={item.title}
          text={item.subTitle}
          onClick={() => window.open(item.link, "_blank")}
          textColor={"black"}
        />
      ))}
    </>
  );
};

export default Card;
