import io from 'socket.io-client';
import { getConfig as Config } from "../config/Config";

const socketUrl:string = Config("ticketService");
const socket = io(socketUrl,{
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts:Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000
});
const socketInstance = socket.connect();


export default socketInstance
