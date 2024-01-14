import { FormattedPhoneNumber } from "../schema/Contact";
import { ContactPhoneNumbers } from "../schema/Contact";
import { ContactEmail } from "../schema/Contact";
import phone from 'google-libphonenumber';

export function formatEmailAddress(emails: string[]): ContactEmail[] {
  try {
    const formattedEmails: ContactEmail[] = [];

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];

      // check if email is valid
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        throw new Error(`Invalid email address: ${email}`);
      }

      const em_id = i + 1; // Generate a unique em_id for each email
      const is_primary = i === 0; // Set the first email as primary

      const emailObject: ContactEmail = {
        em_id,
        email_id: email,
        is_primary,
      };
      formattedEmails.push(emailObject);
    }

    return formattedEmails;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export function formatPhoneNumber(
  phoneNumbers: string[],
): ContactPhoneNumbers[] {
  try {
    const formattedPhoneNumbers: ContactPhoneNumbers[] = [];

    const phoneUtil = phone.PhoneNumberUtil.getInstance();

    for (let i = 0; i < phoneNumbers.length; i++) {
      const phoneNumberStr = phoneNumbers[i];
      const phoneNumber = phoneUtil.parse(phoneNumberStr, 'US'); // You can specify the default country code

      if (!phoneUtil.isValidNumber(phoneNumber)) {
        throw new Error(`Invalid phone number: ${phoneNumberStr}`);
      }

      const pn_id = i + 1; // Generate a unique pn_id for each phone number
      const is_primary = i === 0; // Set the first phone number as primary
      const countryCode = phoneUtil
        .getCountryCodeForRegion(
          phoneUtil.getRegionCodeForNumber(phoneNumber) || 'US',
        )
        .toString();

      const formattedPhoneNumber: FormattedPhoneNumber = {
        e164: phoneUtil.format(phoneNumber, phone.PhoneNumberFormat.E164),
        national: phoneUtil.format(
          phoneNumber,
          phone.PhoneNumberFormat.NATIONAL,
        ),
        international: phoneUtil.format(
          phoneNumber,
          phone.PhoneNumberFormat.INTERNATIONAL,
        ),
        country: phoneUtil.getRegionCodeForNumber(phoneNumber) || '',
        countryCode,
        phone: phoneNumberStr,
      };

      formattedPhoneNumbers.push({
        pn_id,
        phone_number: formattedPhoneNumber,
        is_primary,
      });
    }

    return formattedPhoneNumbers;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
