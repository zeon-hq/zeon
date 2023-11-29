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
  const isOutOfOperatingHours = (to:Date,from:Date,timezone:string) => {
  
    var tmz = timezone;
    var fmt = 'HH:mm:ss';
    var time = moment.tz(tmz);

    const beforeTime = moment(to).format(fmt);
    const afterTime = moment(from).format(fmt);

    var start = moment.tz(beforeTime, fmt, tmz);
    var end = moment.tz(afterTime, fmt, tmz);
    
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
  const activeConversation = useSelector((state: RootState ) => state.widget.activeConversation);

  return {
    step,
    email,
    messages,
    showWidget,
    formSubmitButtonLoading,
    widgetDetails,
    allOpenConversations,
    activeConversation,
    isOutOfOperatingHours
  };
};

export default useWidget;
