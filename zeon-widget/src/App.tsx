import { getChannelById } from "api/api";
import ZeonWidgetModal from "components/modal/ZeonWidgetModal";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import { IMessageSource, setWidgetDetails } from "redux/slice";
import "./App.css";
import WidgetButton from "components/WidgetButton";
import ZThemeProvider from "components/provider/ZThemeProvider";
import useEmbeddable, { IEmbeddableOutput } from "components/hooks/useEmbeddable";
import socketInstance from "api/socket";

function App({ widgetId }: any) {
  const dispatch = useDispatch();
  const isEmbeddable:IEmbeddableOutput = useEmbeddable();

  const getChannel = async (id:string) => {
    try {
      const res = await getChannelById(id);
      socketInstance.emit("join_ticket", {
        widgetId:localStorage.getItem("widgetId"),
        source:IMessageSource.WIDGET
      })
      dispatch(setWidgetDetails(res.data.channel));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // get channelId from the invoke script of the widget
    getChannel(widgetId || isEmbeddable.channelId);
  }, [widgetId, isEmbeddable.channelId]);

  return (
    <>
      <ZThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/channel/:channelId" element={<ZeonWidgetModal />} />
            <Route path="/" element={<WidgetButton />} />
          </Routes>
        </BrowserRouter>
      </ZThemeProvider>
    </>
  );
}

export default App;
