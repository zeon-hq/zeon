import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "store";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
const widgetDiv = document.getElementById('userstak-widget') as HTMLDivElement;


ReactDOM.render(
  
    <Provider store={store}>
      <App widgetId={widgetDiv.dataset.symbol}/>
    </Provider>
  , widgetDiv
)


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
