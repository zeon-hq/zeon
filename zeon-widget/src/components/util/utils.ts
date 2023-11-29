export const generateId = (length: number) => {
    var result = '';
    var alphaNumeric = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var alphabets = 'abcdefghijklmnopqrstuvwxyz';
    var charactersLength = alphaNumeric.length;
  
    result += alphaNumeric.charAt(Math.floor(Math.random() * alphabets.length));
    for (var i = 1; i < length; i++) {
      result += alphaNumeric.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export enum CommonConstants {
    "OPEN-CONVERSATIONS" = "open-conversations",
}