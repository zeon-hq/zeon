import axios from "axios";
import { getConfig as Config } from "../config/Config";
export interface ResponseInterface {
  status: number;
  email: string; 
  message: string;
}
const ticketServiceUrl:string = Config("ticketService");

export const getChannelById = async (channelId: string) => {
  const res:any = await axios.get(`${ticketServiceUrl}/channel/${channelId}`);
  return res
}


export const getOpenTicket = async (widgetId:string)=>{
  const res:any = await axios.get(`${ticketServiceUrl}/ticket/${widgetId}`);
  return res
}