import axios from "axios";
import { getConfig as Config } from "../config/Config";
export interface ResponseInterface {
  status: number;
  email: string; 
  message: string;
}

console.log(Config("ticketService"),'-----------1', process.env.TICKET_SERVICE_URL);
const ticketServiceUrl:string = Config("ticketService");

export const getChannelById = async (channelId: string) => {
  const res:any = await axios.get(`${ticketServiceUrl}/channel/${channelId}`);
  return res
}


export const getOpenTicket = async (widgetId:string)=>{
  const res:any = await axios.get(`${ticketServiceUrl}/ticket/${widgetId}`);
  return res
}