import { CopilotWidget,Root } from "@openchatai/copilot-widget"; // import the component
// import '@openchatai/copilot-widget/index.css' // the required styles
const styles = {
  dropdown: {
    backgroundColor: "red",
  },
}
const options = {
  apiUrl: "https://cloud.opencopilot.so/backend", // your base url where your are hosting OpenCopilot at (the API), usually it's http://localhost:5000/api
  socketUrl: "https://cloud.opencopilot.so", // the url of the socket url that will be used to send and receive messages
  initialMessage: "How are the things", // optional: you can pass an array of messages that will be sent to the copilot when it's initialized
  token: "GiTH4rF0i4ETgpDh", // you can get your token from the dashboard
  defaultOpen: true,
  headers: {
    // optional: you can pass your authentication tokens to the copilot or any other header you want to send with every request
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJic3c1enMiLCJlbWFpbCI6InNhdGhpdGh5YXlvZ2k5OUBnbWFpbC5jb20iLCJuYW1lIjoic2F0aGl0aHlheW9naSIsImlhdCI6MTcwNTMxMzQyMSwiZXhwIjoxNzA1Mzk5ODIxfQ.WwuOjEMjCyvVPNuC11ozaP5U6wC8ZzeQ95SAoyyjwKw",
    AnyKey: "AnyValue",
  },
};
const containerProps = {
    className: "your-custom-class-name",
    style: {
      height: "800px",
      width: "400px",
    },
  };
  

const Widget = () => {
  return (
    <>
    <Root containerProps={containerProps} options={options}>
    <CopilotWidget triggerSelector='#copilot-trigger' />
    </Root>
    </>
  )
}

export default Widget