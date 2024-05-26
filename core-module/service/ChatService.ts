const CHAT_API_DOMAIN = process.env.CHAT_API_DOMAIN;
import axios from 'axios';
import { Logger } from '../func';
import { ZeonServices } from '../types/types';

const logger = new Logger(ZeonServices.CORE);

export const getCustomPrompt = async (channelId:string) => {
    try {
        const res = await axios.get(`${CHAT_API_DOMAIN}/${channelId}/channel/customPrompt`);
        return res.data;
    } catch (error) {
        logger.error({message: `[ChatService]: Error while fetching custom prompt for channel: ${channelId}`})
        return ""
    }
}