import { Request, Response } from 'express';
import CommunicationService from '../service/CommunicationService';

export default class CommunicationController {

    public static async sendEmail(req: Request, res: Response): Promise<any> {
        try {
            const {email, templateId, params} = req.body;
            const emailBodyPayload = {
                "to": [
                  {
                    "email": email
                  }
                ],
                "templateId": templateId,
                "params":params
              }
            console.log(`Email Initiating to ${email}`);
            const sendEmailResponse = await CommunicationService.sendEmail(emailBodyPayload);

            if (sendEmailResponse) {
                return res.status(201).json({
                    code: '200',
                    message: `Email sent to ${email} successfully`,
                });
            } else {
                return res.status(400).json({
                    code: '400',
                    message: `Email Sending Failed to the user ${email}`
                });
            }

        } catch (error) {
            
        }
    }
}