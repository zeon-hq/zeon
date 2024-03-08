import { CopilotWidget, Root } from "@openchatai/copilot-widget"; // import the component
import { getAuthToken } from "util/dashboardUtils";
import useDashboard from "hooks/useDashboard";
import { getConfig as Config } from "config/Config";
// import '@openchatai/copilot-widget/index.css' // the required styles
const styles = {
  dropdown: {
    backgroundColor: "red",
  },
}

const containerProps = {
  className: "your-custom-class-name",
  style: {
    height: "800px",
    width: "400px",
  },
};


const Widget = () => {
  const { user } = useDashboard();
  const userFullName = user.name
  const userEmail = user.email;

  const options = {
    apiUrl: Config("API_URL"), // your base url where your are hosting OpenCopilot at (the API), usually it's http://localhost:5000/api
    socketUrl: Config("SOCKET_URL"), // the url of the socket url that will be used to send and receive messages
    initialMessage:
      "Hey there! I'm Robyn, your AI co-pilot. I can walk you through Zeon or help you carry out tasks for you. Ask me anything.", // optional: you can pass an array of messages that will be sent to the copilot when it's initialized
    token: "vFZxSznoIzK5vQs6", // you can get your token from the dashboard
    defaultOpen: true,
    user: {
      name: `${userFullName}`,
    },
    headers: {
      // optional: you can pass your authentication tokens to the copilot or any other header you want to send with every request
      Authorization: `Bearer ${getAuthToken()}`,
    },
  };

  return (
    <>
      <Root containerProps={containerProps} options={options}>
        <CopilotWidget triggerSelector='#copilot-trigger' />
      </Root>
    </>
  )
}

export default Widget