import { Text } from "components/ui-components/uStyleComponents";
import { TextInput } from "@mantine/core";
import styled from "styled-components";
import { Textarea } from "@mantine/core";
import { Button } from "@mantine/core";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import useWidget from "components/hooks/useWidget";
import { useEffect } from "react";
import socketInstance from "api/socket";
import { AiOutlineArrowRight } from "react-icons/ai";
import {
  clearPrevChat,
  IChatType,
  IMessageSource,
  IUIStepType,
  setEmail,
  setMessage,
  setStep,
} from "redux/slice";
import { MessageType } from "components/chat/Chat.types";
import { generateId } from "components/util/utils";
import { ErrorMessage } from "@hookform/error-message";
import { getIPAddress, sendMessage } from "api/api";

/**
 *
 * open-conversations : {
 *  "unique_id" : [..allConversations],
 *  "unique_id" : [..allConversations],
 *  ...
 * }
 *
 */

type FormDataType = {
  email: string;
  message: string;
};

const Wrapper = styled.div`
  border-radius: 8px;
  height: 100%;
`;

const ZeonWidgetForm = () => {
  const dispatch = useDispatch();

  const { widgetDetails, isOutOfOperatingHours } = useWidget();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataType>({ 
    defaultValues: {
      email: "",
      message: "",
    },
  });

  const submitForm = async (data: FormDataType) => {
    const { email, message } = data;
    dispatch(setEmail(email));
    const widgetId = localStorage.getItem("widgetId") || "";
    const workspaceId = widgetDetails?.workspaceId;
    const channelId = widgetDetails?.channelId;
    const ticketId = generateId(6);
    localStorage.setItem("ticketId", ticketId);
    try {
      const output = await getIPAddress();
      dispatch(clearPrevChat());

      const sendMessagePayload = {
        ticketId: ticketId,
        workspaceId,
        isNewTicket: true,
        messageData: {
          workspaceId,
          channelId,
          chatType: IChatType.HUMAN_MESSAGE,
          customerEmail: email,
          createdAt: Date.now().toString(),
          message,
          isOpen: true,
          widgetId,
          type: MessageType.SENT,
          ticketId,
          ipAddress: output?.data?.ip || "",
          messageSource: IMessageSource.WIDGET
        },
        messageSource: IMessageSource.WIDGET,
      };

      await sendMessage(sendMessagePayload);
      dispatch(
        setMessage({
          message: message || "Hey this is hardcoded",
          type: MessageType.SENT,
          time: Date.now().toString(),
        })
      );

      dispatch(setStep(IUIStepType.CHAT));

      const checkIsOutOfOperatingHours = isOutOfOperatingHours(widgetDetails?.behavior.operatingHours.operatingHours.from,widgetDetails?.behavior.operatingHours.operatingHours.to,widgetDetails?.behavior.operatingHours.timezone);

      const sendAutoReplyMessageWhenOffline = widgetDetails?.behavior.operatingHours.enableOperatingHours && checkIsOutOfOperatingHours;

      if (sendAutoReplyMessageWhenOffline) {

        setTimeout(() => {
          dispatch(
            setMessage({
              message: widgetDetails?.behavior?.operatingHours.autoReplyMessageWhenOffline,
              type: MessageType.RECEIVED,
              time: Date.now().toString(),
            })
          );

          const sendMessagePayload = {
            ticketId: ticketId,
            workspaceId,
            messageData: {
              workspaceId,
              channelId,
              customerEmail: email,
              createdAt: Date.now().toString(),
              chatType: IChatType.OUT_OF_OFFICE,
              message:widgetDetails?.behavior?.operatingHours.autoReplyMessageWhenOffline,
              isOpen: true,
              widgetId,
              type: MessageType.RECEIVED,
              ticketId,
              ipAddress: output?.data?.ip || "",
              messageSource: IMessageSource.WIDGET
            },
            messageSource: IMessageSource.WIDGET,
          };
    
          sendMessage(sendMessagePayload);


        },3000)

      } else if (widgetDetails?.behavior?.widgetBehavior.autoReply) {
        setTimeout(() => {
          dispatch(
            setMessage({
              message: widgetDetails?.behavior?.widgetBehavior.autoReply,
              type: MessageType.RECEIVED,
              time: Date.now().toString(),
            })
          );

          const sendMessagePayload = {
            ticketId: ticketId,
            workspaceId,
            messageData: {
              workspaceId,
              channelId,
              customerEmail: email,
              createdAt: Date.now().toString(),
              chatType: IChatType.AUTO_REPLY,
              message:widgetDetails?.behavior?.widgetBehavior.autoReply,
              isOpen: true,
              widgetId,
              type: MessageType.RECEIVED,
              ticketId,
              ipAddress: output?.data?.ip || "",
              messageSource: IMessageSource.WIDGET
            },
            messageSource: IMessageSource.WIDGET,
          };
    
          sendMessage(sendMessagePayload);

        },3000)
      }
    } catch (error) {
    }
  };

  return (
    <Wrapper as={"form"} onSubmit={handleSubmit(submitForm)}>
      <Text size="medium" weight="bold">
        {widgetDetails?.behavior.widgetBehavior.emailTitle}
      </Text>
      <TextInput
        {...register("email", {
          required: true,
          validate: (value) => {
            const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            return emailRegex.test(value) ? true : "Invalid email address";
          },
        })}
        type="email"
        placeholder={
          widgetDetails?.behavior.widgetBehavior.placeholderTextForEmailCapture
        }
        required
        radius={"sm"}
        style={{}}
      />

      <ErrorMessage
        errors={errors}
        name="email"
        render={({ message }) => (
          <Text color="red" weight="normal" size="small">
            {message}
          </Text>
        )}
      />
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div className="" style={{ height: "100%" }}>
          <Textarea
            placeholder={"Enter message here"}
            label="Description"
            style={{
              height: "100% !important",
            }}
            autosize
            radius={"sm"}
            py="sm"
            {...register("message", {
              required: "Message can't be empty",
            })}
          />
          <ErrorMessage
            errors={errors}
            name="message"
            render={({ message }) => (
              <Text color="red" weight="normal" size="small">
                {message}
              </Text>
            )}
          />
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            style={{
              backgroundColor: `${widgetDetails?.appearance?.newConversationButton?.buttonColor}`,
              color: `${widgetDetails?.appearance?.newConversationButton?.textColor}`,
              borderRadius: "8px",
              // padding:'18px'
            }}
            rightIcon={<AiOutlineArrowRight size={14} />}
            loaderPosition="right"
            type="submit"
          >
            Submit
          </Button>
        </div>
      </div>
    </Wrapper>
  );
};

export default ZeonWidgetForm;
