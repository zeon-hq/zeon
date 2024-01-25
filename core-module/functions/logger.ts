// create a logger class such that it has three methods
// info, warn, error
import axios from "axios";
import { ZLoggerInput, ZeonError, ZeonServices } from "../types/types"

export default class Logger {
    webhook: string
    service: ZeonServices
    constructor(service: ZeonServices) {
        // private variable for webhook
        this.webhook = process.env.SLACK_WEBHOOK;
        this.service = service;
    }
    
    info(input:ZLoggerInput) {
        input.type = "INFO";
        input.service = this.service;
        console.log(`[INFO]: ${JSON.stringify(input)}`);
        this.sendToSlack(input);
    }
    
    warn(input:ZLoggerInput) {
        input.type = "WARN";
        input.service = this.service;
        console.log(`[WARN]: ${JSON.stringify(input)}`);
        this.sendToSlack(input);

    }
    
    error(input:ZLoggerInput) {
        input.type = "ERROR";
        input.service = this.service;
        console.log(`[ERROR]: ${JSON.stringify(input)}`);
        this.sendToSlack(input);
    }

    private async sendToSlack(message: any) {
        // send message to slack
        await axios.post(this.webhook, {
            message
        })
    }
}
