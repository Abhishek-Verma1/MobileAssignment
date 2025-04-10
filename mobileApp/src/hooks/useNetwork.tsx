import {getApiBaseUrl} from '@utils/apiHelper';
import connectivityManager from '@utils/connectivityManager';
import {
  checkNetworkConnection,
  logNetworkInfo,
  testApiConnection,
} from '@utils/networkDebug';
import React from 'react';
import {Alert} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import NetInfo, {
  NetInfoState,
  NetInfoSubscription,
} from '@react-native-community/netinfo';

const useNetwork = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const gameState = useSelector((state: RootState) => state.game);

  const [networkStatus, setNetworkStatus] = React.useState<
    'checking' | 'connected' | 'disconnected' | 'api-error'
  >('checking');

  React.useEffect(() => {
    const unsubscribe = connectivityManager.addListener(isConnected => {
      if (isConnected) {
        setNetworkStatus('connected');
        testApiConnection(getApiBaseUrl());
      } else {
        setNetworkStatus('disconnected');
      }
    });

    checkNetwork();

    return () => {
      unsubscribe();
    };
  }, []);

  const checkNetwork = async () => {
    try {
      await logNetworkInfo();

      const hasNetwork = await checkNetworkConnection();
      if (!hasNetwork) {
        setNetworkStatus('disconnected');
        return;
      }
      const apiUrl = getApiBaseUrl();
      const apiReachable = await testApiConnection(apiUrl);
      if (!apiReachable) {
        setNetworkStatus('api-error');
      } else {
        setNetworkStatus('connected');
      }
    } catch (err) {
      setNetworkStatus('api-error');
    }
  };

  React.useEffect(() => {
    if (networkStatus === 'disconnected') {
      Alert.alert(
        'No Internet Connection!',
        'Please check your network settings and try again......',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Retry',
            onPress: () => checkNetwork(),
          },
        ],
      );
      return;
    }

    if (networkStatus === 'api-error') {
      Alert.alert(
        'Server Unreachable!',
        'Cannot connect to the server. Please try again later.....',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Retry',
            onPress: () => checkNetwork(),
          },
        ],
      );
      return;
    }
  }, [authState?.loading, gameState?.loading, networkStatus]);

  return {
    ...authState,
  };
};

export default useNetwork;
