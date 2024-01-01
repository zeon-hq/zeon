import { CompanySize, CompanyWorth } from "./type";

export const companySizeFormatter = (value?: CompanySize) => {
  switch (value) {
    case CompanySize.MICRO:
      return "1-10";
    case CompanySize.SMALL:
      return "11-50";
    case CompanySize.MEDIUM:
      return "51-200";
    case CompanySize.LARGE:
      return "201-500";
    case CompanySize.XLARGE:
      return "501-1000";
    case CompanySize.XXLARGE:
      return "1001-5000";
    case CompanySize.XXXLARGE:
      return "5001-10000";
    case CompanySize.SUPER:
      return "10000+";
    default:
      return "Unknown";
  }
};

export const companyWorthFormatter = (value?: CompanyWorth) => {
  switch (value) {
    case CompanyWorth.MICRO:
      return "0-1M";
    case CompanyWorth.SMALL:
      return "1M-10M";
    case CompanyWorth.MEDIUM:
      return "10M-50M";
    case CompanyWorth.LARGE:
      return "50M-100M";
    case CompanyWorth.XLARGE:
      return "100M-500M";
    case CompanyWorth.XXLARGE:
      return "500M-1B";
    case CompanyWorth.XXXLARGE:
      return "1B-5B";
    case CompanyWorth.SUPER:
      return "5B-10B";
    case CompanyWorth.MEGA:
      return "10B+";
    default:
      return "Unknown";
  }
};
