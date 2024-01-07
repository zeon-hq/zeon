import { ISignupBody } from "../types/types"
import axios from "axios"
import { IForgetPasswordBody } from "../types/types"


const mailerUrl = 'https://api.brevo.com/v3/contacts';

const url = "https://api.brevo.com/v3/smtp/email"


export const sendMail = async  (body: any) => {
  // construct header
  const headers = {
    "Content-Type": "application/json",
    "api-Key": "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",
  }

  // construct body
  const data = {
    ...body,
  }

  // send request
  try {
    const res = await axios.post(url, data, { headers })
    return res
  } catch (err) {
    console.log(err)
    return err
  }
}

export const sendSignupEmail = (body: ISignupBody) => {
  const options = {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'api-key': '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'
    }
  };

  axios.post(mailerUrl, body, options)
    .then((response:any) => {
      console.log(response.data);
      // use sendMail function to send email
      sendMail(body);
    })
    .catch((error:any) => {
      console.error('error:', error);
    });
}

export const sendForgetPasswordEmail = (body: IForgetPasswordBody) => {
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

