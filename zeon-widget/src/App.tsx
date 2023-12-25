import { getChannelById } from "api/api";
import ZeonWidgetModal from "components/modal/ZeonWidgetModal";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import { setWidgetDetails } from "redux/slice";
import "./App.css";
import WidgetButton from "components/WidgetButton";

function App({ widgetId }: any) {
  const dispatch = useDispatch();
  let { channelId } = useParams();

  const getChannel = async () => {
    try {
      const res = await getChannelById(widgetId || channelId);
      dispatch(setWidgetDetails(res.data.channel));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // get channelId from the invoke script of the widget
    getChannel();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/channel/:channelId" element={<ZeonWidgetModal />} />
          <Route path="/" element={<WidgetButton />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
