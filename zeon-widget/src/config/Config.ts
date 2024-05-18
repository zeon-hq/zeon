import dotProp from 'dot-prop';
import configDev from './dev.json';
import configLocal from './local.json';
import configProd from './prod.json';

export const getConfig = (key: string): any => {
  const config = getEnvConfig();
  return dotProp.get(config, key);
};
function getEnvConfig(): any {
  if (process.env['REACT_APP_ENVIRONMENT'] === 'local') {
    return configLocal as any;
  } else if (process.env['REACT_APP_ENVIRONMENT'] === 'dev') {
    return configDev as any;
  } else if (process.env['REACT_APP_ENVIRONMENT'] === 'prod') {
    return configProd as any;
  } else {
    return configDev as any;
  }
}


export const notificationSound = 'https://zeonhq.b-cdn.net/notification.mp3';

export const widgetImageUrl = 'https://zeon-assets.s3.ap-south-1.amazonaws.com/aichatMIX.svg';
export const chevronDown = 'https://zeon-assets.s3.ap-south-1.amazonaws.com/chevron-down+(1).svg';