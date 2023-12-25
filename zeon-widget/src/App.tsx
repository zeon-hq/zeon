import { getChannelById } from "api/api";
import ZeonWidgetModal from "components/modal/ZeonWidgetModal";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import { setWidgetDetails } from "redux/slice";
import "./App.css";

function App({ widgetId }: any) {
  const dispatch = useDispatch();
  let { embedd_flag } = useParams();

  const getChannel = async () => {
    try {
      const res = await getChannelById("mR3D18");
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
      {/* <WidgetButton/> */}
      <BrowserRouter>
        <Routes>
          <Route path="/test/:embedd_flag" element={<ZeonWidgetModal />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
