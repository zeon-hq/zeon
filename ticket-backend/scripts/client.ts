
// Client
const io = require('socket.io-client');
const socket = io('https://dev.userstak.com', {
  transports: ["websocket"]
});   // https://1bf8-105-112-18-87.eu.ngrok.io https://ticket-service-staging-8h3g2.ondigitalocean.app

let _data = {
  ticketId: '',
}

socket.on('connect', () => {
  console.log('connection status: ', socket.connected);
  const msg = "This is a test. Please ignore. Thanks!";
});


// @ts-ignore
socket.on("message", (data) => {
  _data.ticketId = data.ticketId;
  const response = ('You said: ' + data.message)
  socket.emit('message', {
    message: response,
    workspaceId: data.workspaceId,
    ticketId:data.ticketId,
    channelId: data.channelId
  });
});

socket.on("connect_error", (err: any) => {
  console.log(`connect_error due to ${err.message}`);
});