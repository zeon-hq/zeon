import dotProp from 'dot-prop';
import configDev from './dev.json';
import configLocal from './local.json';
import configProd from './prod.json';
import configDocker from './docker.json';

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
  } else if (process.env['REACT_APP_ENVIRONMENT'] === 'docker') {
    return configDocker as any;
  } else {
    return configDev as any;
  }
}
 