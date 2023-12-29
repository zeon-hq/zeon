export enum MessageType  {
    RECEIVED = "received",
    SENT  = "sent"
}

export type IThemeType = {
    isEmbeddable?: boolean;
    channelId?: string;
  };

  export type IPropsType = {
    theme: IThemeType;
  };