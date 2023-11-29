import io from 'socket.io-client';
import { getConfig as Config } from "config/Config";

const socketUrl = Config('TICKET_SERVICE');
const socket = io(socketUrl,{
    transports: ["websocket"],
    reconnection: true,
    // reconnectionAttempts: 0
});

const socketInstance = socket.connect();
export default socketInstance
