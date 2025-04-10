import NetInfo from '@react-native-community/netinfo';
import {Platform} from 'react-native';
import connectivityManager from './connectivityManager';

//TODO: Code cleaning and optimization required
export const checkNetworkConnection = async (): Promise<boolean> => {
  try {
    const isConnected = await connectivityManager.checkConnectivity();
    const state = await NetInfo.fetch();
    return isConnected;
  } catch (error) {
    return true;
  }
};

export const testApiConnection = async (apiUrl: string): Promise<boolean> => {
  try {
    const isConnected = await connectivityManager.checkConnectivity();
    if (!isConnected) {
      return false;
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(`${apiUrl}/system/health`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response.status !== 0;
  } catch (error: any) {
    //TODO:
    if (error.name === 'AbortError') {
    } else {
    }
    return false;
  }
};

export const getDebugInfo = () => {
  return {
    platform: Platform.OS,
    version: Platform.Version,
    isEmulator:
      Platform.OS === 'android'
        ? Platform.constants.Brand === 'google' &&
          Platform.constants.Manufacturer === 'Google'
        : false,
  };
};

export const logNetworkInfo = async () => {
  try {
    const netInfo = await NetInfo.fetch();
    console.log('===== NETWORK DEBUG INFO =====');
    console.log('Is Connected:', netInfo.isConnected);
    console.log(
      'Connectivity Manager Connected:',
      connectivityManager.isConnected(),
    );
    console.log('Connection Type:', netInfo.type);
    console.log('Is Wifi Enabled:', netInfo.isWifiEnabled);
    console.log('Details:', netInfo.details);
    console.log('Environment:', getDebugInfo());
    console.log('==============================');
  } catch (error) {
  }
};
