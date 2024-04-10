import { Card as MTCard, Space, Text } from "@mantine/core";
import { getChannelById, getOpenTicket } from "api/api";
import { IPropsType, MessageType } from "components/chat/Chat.types";
import { generateRandomString, preProcessText } from "components/hooks/commonUtils";
import useEmbeddable, { IEmbeddableOutput } from "components/hooks/useEmbeddable";
import useWidget from "components/hooks/useWidget";
import { ReactNode, useEffect } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { setAllOpenConversations, setEmail, setMessage, setStep, setWidgetDetails } from "redux/slice";
import styled from "styled-components";
const WholeWrapper = styled.div`
${(props: IPropsType) => props.theme.isEmbeddable ? 'height: 100%;' : ''}
`;

type SingleCardProps = {
  heading: string;
  text: string;
  icon?: ReactNode;
  bg?: string;
  onClick?: () => void;
  textColor: "black" | "white";
  isContinueConversation?: boolean;
};

export const SingleCard = ({
  heading,
  text,
  icon,
  bg = "",
  textColor = "black",
  onClick = () => {},
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

const ZeonWidgetCard = () => {
  const dispatch = useDispatch();
  const { widgetDetails, isOutOfOperatingHours, allOpenConversations } = useWidget();
  const isEmbeddable:IEmbeddableOutput = useEmbeddable();
  const enableDuringOperatingHours = widgetDetails?.behavior?.operatingHours?.enableOperatingHours;
  const hideNewConversationButtonWhenOffline = widgetDetails?.behavior?.operatingHours?.hideNewConversationButtonWhenOffline;
  const operatingHoursToTime = widgetDetails?.behavior?.operatingHours?.operatingHours.to;
  const operatingHoursFromTime = widgetDetails?.behavior?.operatingHours?.operatingHours.from;
  const operatingHoursTimeZone = widgetDetails?.behavior?.operatingHours?.timezone;

  const hideNewConversationButtonWhenOfflineAndOutOfOperatingHours = enableDuringOperatingHours && hideNewConversationButtonWhenOffline && isOutOfOperatingHours(operatingHoursFromTime,operatingHoursToTime, operatingHoursTimeZone);

  useEffect(() => {
    getOpenTicketData();
  }, []);


  const getOpenTicketData = async () => {
    const getWidgetId: any = localStorage.getItem("widgetId");
    if (getWidgetId) {
      const getData: any = await getOpenTicket(getWidgetId);
      // dispatch(setMessage(getData.data.ticket))
      dispatch(setAllOpenConversations(getData.data.ticket));
    } else {
      const widgetId = generateRandomString(6);
      localStorage.setItem("widgetId", widgetId);
    }
  };
  const getChannel = async (channelId:string) => {
    try {
      const res = await getChannelById(channelId);
      if (res.status != 200) {
        dispatch(setWidgetDetails(res.data.channel));
        getOpenTicketData();
      } else {
        // Handle Error here
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // get channelId from the invoke script of the widget
    (isEmbeddable?.channelId) && getChannel(isEmbeddable?.channelId as string);
  }, [isEmbeddable?.channelId]);
  return (
    <>
    <WholeWrapper>
      {hideNewConversationButtonWhenOfflineAndOutOfOperatingHours
      ? (
        <></>
      ) : (
        <>
        {
          allOpenConversations.length > 0 && 
          <Text size="sm" weight={500} mt="8px">
            Open Tickets
          </Text>
          }
          {allOpenConversations.length > 0 &&
            allOpenConversations.map((data: any, index:any) => {
              const messageReplaced = preProcessText(
                data.messages[data.messages.length - 1]?.message || "",
                { email: data.customerEmail }
              );
              return (
                <>
                  <SingleCard
                  key={index}
                    heading={`Ticket Number: ${data.ticketId}`}
                    text={`${data.messages[data.messages.length - 1]?.type === MessageType.SENT ? "You" : "Agent"} : ${messageReplaced}`}
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

{widgetDetails?.inChatWidgets.length > 0 &&
      <Text size="sm" weight={500} mt="16px">
        {" "}
        Resources{" "}
      </Text>
}
      {widgetDetails?.inChatWidgets.map((item, index) => (
        <SingleCard
          key={index}
          heading={item.title}
          text={item.subTitle}
          onClick={() => window.open(item.link, "_blank")}
          textColor={"black"}
        />
      ))}

      </WholeWrapper>
    </>
  );
};

export default ZeonWidgetCard;
