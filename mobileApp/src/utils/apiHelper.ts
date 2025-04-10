//TODO: Code cleaning and optimization required

import NetInfo from '@react-native-community/netinfo';
import {Platform} from 'react-native';
import connectivityManager from './connectivityManager';

export const getApiBaseUrl = (customUrl?: string): string => {
  if (customUrl) return customUrl;
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080'; //TODO
  } else {
    return 'http://localhost:8080';
  }
};

export const isEmulator = (): boolean => {
  if (Platform.OS === 'android') {
    return (
      Platform.constants.Brand === 'google' &&
      Platform.constants.Manufacturer === 'Google'
    );
  } else if (Platform.OS === 'ios') {
    return __DEV__ && process.env.NODE_ENV === 'development';
  }
  return false;
};

//TODO: Need to change this
export const formatApiError = (error: any): string => {
  if (!connectivityManager.isConnected()) {
    return 'No internet connection. Please check your network settings.';
  }
  if (!error.response) {
    return 'Network error: Unable to reach the server. Please try again later.';
  }
  const status = error.response.status;
  if (status === 401) {
    return 'Authentication error: Please log in again';
  } else if (status === 403) {
    return 'Access denied: You do not have permission for this action';
  } else if (status === 404) {
    return 'Resource not found';
  } else if (status >= 500) {
    return 'Server error: Please try again later';
  }
  if (error.response.data && error.response.data.message) {
    return error.response.data.message;
  }

  return 'unexpected error.....';
};

export const isUrlReachable = async (
  url: string,
  method: string = 'HEAD',
  body?: string,
): Promise<boolean> => {
  try {
    if (!(await connectivityManager.checkConnectivity())) {
      return false;
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const options: RequestInit = {
      method,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = body;
    }
    const response = await fetch(url, options);
    clearTimeout(timeoutId);

    if (
      url.includes('/game/') ||
      url.includes('/player/') ||
      url.includes('/stats') ||
      url.includes('/system/') ||
      url.includes('/auth/')
    ) {
      const apiStatusCodes = [200, 201, 401, 403, 404, 405];
      return apiStatusCodes.includes(response.status);
    }
    if (!url.includes('/')) {
      return response.status !== 0;
    }
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const getCommonHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const getConnectionInfo = async () => {
  const netInfo = await NetInfo.fetch();
  return {
    isConnected: netInfo.isConnected,
    connectionType: netInfo.type,
    details: netInfo.details,
    isInternetReachable: netInfo.isInternetReachable,
    connectivityManagerState: connectivityManager.isConnected(),
  };
};

export default {
  getApiBaseUrl,
  isEmulator,
  formatApiError,
  isUrlReachable,
  getCommonHeaders,
  getConnectionInfo,
};
