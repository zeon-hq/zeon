import { ISignupBody } from "../types/types"
import axios from "axios"
import { IForgetPasswordBody } from "../types/types"

const fetch = require('node-fetch');

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
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': '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'
    },
    body: JSON.stringify(body)
  };
  
  fetch(mailerUrl, options)
    .then((res:any) => res.json())
    .then((json:any) => console.log(json))
    .catch((err:any) => console.error('error:' + err));
    // use sendMail function to send email
    return sendMail(body)
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

