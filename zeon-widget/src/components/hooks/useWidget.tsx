// Added ts ignore to this file. Unable to resolve the issue. Will check it later.
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import { RootState } from "store";

const useWidget = () => {

 
  /**
   * 
   * @param to 
   * @param from 
   * @param timezone 
   * @returns takes operating hours and returns true if the current time is within the operating hours
   */
  const isOutOfOperatingHours = (from:Date,to:Date,timezone:string) => {
  
    var fmt = 'HH:mm:ss';
    var time = moment.tz(timezone);

    const beforeTime = moment(from).format(fmt);
    const afterTime = moment(to).format(fmt);

    var start = moment.tz(beforeTime, fmt, timezone);
    var end = moment.tz(afterTime, fmt, timezone);
    
    const check = time.isBetween(start, end)
    return !check
    
  }


  const step = useSelector((state: RootState ) => state.widget.step);
  const email = useSelector((state: RootState ) => state.widget.email);
  const messages = useSelector((state: RootState ) => state.widget.messages);
  const showWidget = useSelector((state: RootState ) => state.widget.showWidget);
  const formSubmitButtonLoading = useSelector((state: RootState ) => state.widget.formSubmitButtonLoading);
  const widgetDetails = useSelector((state: RootState ) => state.widget.widgetDetails);
  const allOpenConversations = useSelector((state: RootState ) => state.widget.allOpenConversations);

  const typing = useSelector((state: RootState ) => state.widget.typing);
  const aiTyping = useSelector((state: RootState ) => state.widget.aiTyping);
  const agentName = useSelector((state: RootState ) => state.widget.agentName);
  const widgetId = useSelector((state: RootState ) => state.widget.widgetId);

  return {
    step,
    email,
    messages,
    showWidget,
    formSubmitButtonLoading,
    widgetDetails,
    allOpenConversations,
    isOutOfOperatingHours,
    typing,
    aiTyping,
    agentName,
    widgetId
  };
};

export default useWidget;
