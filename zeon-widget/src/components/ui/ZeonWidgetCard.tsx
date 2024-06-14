import { Text } from "@mantine/core";
import { getChannelById, getOpenTicket } from "api/api";
import socketInstance from "api/socket";
import { IPropsType, MessageType } from "components/chat/Chat.types";
import { generateRandomString, preProcessText } from "components/hooks/commonUtils";
import useEmbeddable, { IEmbeddableOutput } from "components/hooks/useEmbeddable";
import useWidget from "components/hooks/useWidget";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { IMessageSource, IUIStepType, setAiTyping, setAllOpenConversations, setEmail, setMessage, setStep, setWidgetDetails } from "redux/slice";
import styled from "styled-components";
import SingleCard from "./SingleCard";
const WholeWrapper = styled.div`
${(props: IPropsType) => props.theme.isEmbeddable ? 'height: 100%;' : ''}
`;

const ZeonWidgetCard = () => {
  const dispatch = useDispatch();
  const { widgetDetails, isOutOfOperatingHours, allOpenConversations } = useWidget();
  const isEmbeddable: IEmbeddableOutput = useEmbeddable();
  const enableDuringOperatingHours = widgetDetails?.behavior?.operatingHours?.enableOperatingHours;
  const hideNewConversationButtonWhenOffline = widgetDetails?.behavior?.operatingHours?.hideNewConversationButtonWhenOffline;
  const operatingHoursToTime = widgetDetails?.behavior?.operatingHours?.operatingHours.to;
  const operatingHoursFromTime = widgetDetails?.behavior?.operatingHours?.operatingHours.from;
  const operatingHoursTimeZone = widgetDetails?.behavior?.operatingHours?.timezone;

  const hideNewConversationButtonWhenOfflineAndOutOfOperatingHours = enableDuringOperatingHours && hideNewConversationButtonWhenOffline && isOutOfOperatingHours(operatingHoursFromTime, operatingHoursToTime, operatingHoursTimeZone);

  useEffect(() => {
    getOpenTicketData();
    dispatch(setAiTyping(false));
  }, []);


  const getOpenTicketData = async () => {
    const getWidgetId: any = localStorage.getItem("widgetId");
    if (getWidgetId) {
      const getData: any = await getOpenTicket(getWidgetId);
      dispatch(setAllOpenConversations(getData.data.ticket));
    } else {
      const widgetId = generateRandomString(6);
      localStorage.setItem("widgetId", widgetId);
    }
  };
  const getChannel = async (channelId: string) => {
    try {
      const res = await getChannelById(channelId);
      if (res.status != 200) {
        socketInstance.emit("join_ticket", {
          widgetId:localStorage.getItem("widgetId"),
          source:IMessageSource.WIDGET
        })
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
    isEmbeddable?.channelId && getChannel(isEmbeddable?.channelId as string);
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
                allOpenConversations.map((data: any, index: number) => {
                  const message = data.messages[data.messages.length - 1]?.message || "";
                  const contextMessage = { email: data.customerEmail };
                  const replacedMessage = preProcessText(message, contextMessage);

                  return (
                    <>
                      <SingleCard
                        key={data.ticketId}
                        totalUnreadMessage={data.unreadMessage}
                        heading={`Ticket Number: ${data.ticketId}`}
                        text={`${data.messages[data.messages.length - 1]?.type === MessageType.SENT ? "You" : "Agent"} : ${replacedMessage}`}
                        onClick={() => {
                          socketInstance.emit("join_ticket", {
                            widgetId:localStorage.getItem("widgetId"),
                            source:IMessageSource.WIDGET,
                          })

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
                          dispatch(setStep(IUIStepType.CHAT));
                        }}
                        textColor={"black"}
                      />
                    </>
                  );
                })}
            </>
          )}

        {/* {widgetDetails?.inChatWidgets.length > 0 &&
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
        ))} */}

      </WholeWrapper>
    </>
  );
};

export default ZeonWidgetCard;
