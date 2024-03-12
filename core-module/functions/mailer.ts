import { ISignupBody } from "../types/types"
import axios from "axios"
import { IForgetPasswordBody } from "../types/types"
var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_KEY;

// Uncomment below two lines to configure authorization using: partner-key
// var partnerKey = defaultClient.authentications['partner-key'];
// partnerKey.apiKey = 'YOUR API KEY';

var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();


export const sendMail = async  (body: any) => {
  sendSmtpEmail = {...body}
  // construct header
  apiInstance.sendTransacEmail(sendSmtpEmail).then(function() {
    console.log('API called successfully.');
  }, function(error:any) {
    console.error(error);
  });
}

export const sendSignupEmail = (body: ISignupBody) => {
  const options = {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_KEY
    }
  };

  axios.post("mailerUrl", body, options)
    .then((response:any) => {
      console.log(response.data);
      // use sendMail function to send email
      sendMail(body);
    })
    .catch((error:any) => {
      console.error('error:', error);
    });
}

export const sendForgetPasswordEmail = (body: any) => {
    // use sendMail function to send email
    return sendMail(body)
}

export const sendInviteEmail = (body: any) => {
    // use sendMail function to send email
    return sendMail(body)
}

export const sendAddContactEmail = (body: any) => {
    // use sendMail function to send email
    return sendMail(body)
}

export const sendInviteUserEmail = (body: any) => {
    // use sendMail function to send email
    return sendMail(body)
}

