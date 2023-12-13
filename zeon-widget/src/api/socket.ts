import io from 'socket.io-client';
import { getConfig as Config } from "../config/Config";


const socketUrl:string = Config("ticketService");
const socket = io(socketUrl,{
    transports: ["websocket"],
    reconnection: true,
    // reconnectionAttempts: 10
});
const socketInstance = socket.connect();


export default socketInstance
