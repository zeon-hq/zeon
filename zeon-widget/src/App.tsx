import './App.css';
import WidgetButton from 'components/WidgetButton';
import { useEffect } from 'react';
import { getChannelById } from 'api/api';
import { useDispatch } from 'react-redux';
import { setWidgetDetails } from 'redux/slice';



function App({widgetId}:any) {
  const dispatch = useDispatch()
  const getChannel = async () => {
    try {
      const res = await getChannelById(widgetId)
      dispatch(setWidgetDetails(res.data.channel))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // get channelId from the invoke script of the widget
    getChannel()
  },[])

  return (
    <>  
      <WidgetButton/>
    </>
    
  );
}

export default App;
