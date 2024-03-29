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
  setActiveConversation,
  setEmail,
  setMessage,
  setStep,
} from "redux/slice";
import { MessageType } from "components/chat/Chat.types";
import { generateId } from "components/util/utils";
import { ErrorMessage } from '@hookform/error-message';
import { getIPAddress } from "api/api";

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

  const { register, handleSubmit, formState: { errors } } = useForm<FormDataType>({
    defaultValues: {
      email: "",
      message: "",
    },
  });

  const submitForm = async (data: FormDataType) => {
    const { email, message } = data;
    dispatch(setEmail(email));
    const widgetId = localStorage.getItem('widgetId');
    try {
      const output = await getIPAddress();
      dispatch(clearPrevChat());
      socketInstance.emit(
        "open-ticket",
        {
          workspaceId: widgetDetails?.workspaceId ,
          channelId: widgetDetails?.channelId,
          customerEmail: email,
          createdAt: Date.now().toString(),
          message,
          isOpen: true,
          widgetId,
          type: "Computer (laptop)",
          ticketId: localStorage.getItem("ticketId") || "",
          threadId: localStorage.getItem("threadId") || "",
          ipAddress:output?.data?.ip || ""
        },(data:any) => console.log("emited",data)
      );
      const uniqueId = generateId(6);
      dispatch(
        setMessage({
          message: message || "Hey this is hardcoded",
          type: MessageType.SENT,
          time: Date.now().toString(),
        })
      );

      dispatch(setActiveConversation(uniqueId));
      dispatch(setStep("chat"));
        
      const checkIsOutOfOperatingHours = isOutOfOperatingHours(widgetDetails?.behavior.operatingHours.operatingHours.from, widgetDetails?.behavior.operatingHours.operatingHours.to, widgetDetails?.behavior.operatingHours.timezone)

      const sendAutoReplyMessageWhenOffline = widgetDetails?.behavior.operatingHours.enableOperatingHours && checkIsOutOfOperatingHours
      if (sendAutoReplyMessageWhenOffline) {
        setTimeout(() => {
          dispatch(
            setMessage({
              message: widgetDetails?.behavior?.operatingHours.autoReplyMessageWhenOffline,
              type: MessageType.RECEIVED,
              time: Date.now().toString(),
            })
          );

          socketInstance.emit("message", {
            createdAt: Date.now().toString(),
            threadId: localStorage.getItem("threadId"),
            ticketId: localStorage.getItem("ticketId"),
            workspaceId: widgetDetails?.workspaceId,
            channelId: localStorage.getItem("usci"),
            type: MessageType.RECEIVED,
            message: widgetDetails?.behavior?.operatingHours.autoReplyMessageWhenOffline,
          })
        },3000)
      } else if(widgetDetails?.behavior?.widgetBehavior.autoReply ) {
        setTimeout(() => {
          dispatch(
            setMessage({
              message: widgetDetails?.behavior?.widgetBehavior.autoReply,
              type: MessageType.RECEIVED,
              time: Date.now().toString(),
            })
          );

          socketInstance.emit("message", {
            threadId: localStorage.getItem("threadId"),
            workspaceId: widgetDetails?.workspaceId,
            channelId: localStorage.getItem("usci"),
            message: widgetDetails?.behavior?.widgetBehavior.autoReply,
            createdAt: Date.now().toString(),
            ticketId: localStorage.getItem("ticketId"),
            type: MessageType.RECEIVED,
          })
        },3000)
      }

     
      // localStorage.removeItem("threadId");
      // localStorage.removeItem("ticketId");
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    socketInstance.on("connect", () => {
    });

    return () => {
      socketInstance.off("connect");
    };
  }, []);

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
            }
          })}
          type="email"
          placeholder={
            widgetDetails?.behavior.widgetBehavior.placeholderTextForEmailCapture
          }
          required
          radius={'sm'}
          style={{
          }}
        />
        
        <ErrorMessage 
          errors={errors} name="email"
          render={({ message }) => <Text color="red" weight="normal" size="small">{message}</Text>}
        />
        <div style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
<div className="" style={{height:'100%'}}>
        <Textarea
          placeholder={
            'Enter message here'
          }
          label="Description"
          style={{
            height:'100% !important'
          }}
          autosize
          radius={'sm'}
          py="sm"
          {...register("message",{
            required: "Message can't be empty"
          })}
        />
        <ErrorMessage 
          errors={errors} name="message"
          render={({ message }) => <Text color="red" weight="normal" size="small">{message}</Text>}
        />
        </div>
        <div style={{
          width:'100%',
          display:'flex',
          justifyContent:'flex-end',
        }}>

        <Button
          style={{
            backgroundColor: `${widgetDetails?.appearance?.newConversationButton?.buttonColor}`,
            color: `${widgetDetails?.appearance?.newConversationButton?.textColor}`,
            borderRadius:'8px',
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
