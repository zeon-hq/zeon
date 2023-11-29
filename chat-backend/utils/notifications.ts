import dotenv from "dotenv";
const SibApiV3Sdk = require("sib-api-v3-sdk");
const defaultClient = SibApiV3Sdk.ApiClient.instance;

dotenv.config();

const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY as string;

export async function sendEmailOnInvite({ email }: { email: string }) {
  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail = {
    to: [
      {
        email: email,
      },
    ],
    templateId: 21,
    params: {
      EMAIL: email,
    },
  };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data: any) {},
    function (error: any) {}
  );
}

export async function sendEmailOnSignUp_PersonalHello({
  email,
  firstName,
  lastName,
}: {
  email: string;
  firstName: string;
  lastName: string;
}) {
  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail = {
    to: [
      {
        email: email,
        name: `${firstName} ${lastName}`,
      },
    ],
    templateId: 6,
    params: {
      FIRSTNAME: firstName,
    },
  };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data: any) {},
    function (error: any) {}
  );
}

export async function sendEmailOnSignUp({
  email,
  firstName,
  lastName,
}: {
  email: string;
  firstName: string;
  lastName: string;
}) {
  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail = {
    to: [
      {
        email: email,
        name: `${firstName} ${lastName}`,
      },
    ],
    templateId: 5,
    params: {
      FIRSTNAME: firstName,
    },
  };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data: any) {},
    function (error: any) {}
  );
}

export async function sendEmail_3Days_Before_Trial_Ends({
  email,
  firstName,
  lastName,
}: {
  email: string;
  firstName: string;
  lastName: string;
}) {
  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail = {
    to: [
      {
        email: email,
        name: `${firstName} ${lastName}`,
      },
    ],
    templateId: 8,
    params: {
      FIRSTNAME: firstName,
    },
  };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data: any) {},
    function (error: any) {}
  );
}

export async function sendEmailTrialEnded({
  email,
  firstName,
  lastName,
}: {
  email: string;
  firstName: string;
  lastName: string;
}) {
  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail = {
    to: [
      {
        email: email,
        name: `${firstName} ${lastName}`,
      },
    ],
    templateId: 9,
    params: {
      FIRSTNAME: firstName,
    },
  };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data: any) {},
    function (error: any) {}
  );
}

export async function sendEmailFirstPayment({
  email,
  firstName,
  lastName,
}: {
  email: string;
  firstName: string;
  lastName: string;
}) {
  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail = {
    to: [
      {
        email: email,
        name: `${firstName} ${lastName}`,
      },
    ],
    templateId: 14,
    params: {
      FIRSTNAME: firstName,
    },
  };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data: any) {},
    function (error: any) {}
  );
}

export async function sendEmailPaymentFailed({
  email,
  firstName,
  lastName,
}: {
  email: string;
  firstName: string;
  lastName: string;
}) {
  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail = {
    to: [
      {
        email: email,
        name: `${firstName} ${lastName}`,
      },
    ],
    templateId: 16,
    params: {
      FIRSTNAME: firstName,
    },
  };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data: any) {},
    function (error: any) {}
  );
}
