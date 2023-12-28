export enum MessageType  {
    RECEIVED = "received",
    SENT  = "sent"
}

export type IThemeType = {
    isEmbeddable: boolean;
  };

  export type IPropsType = {
    theme: IThemeType;
  };