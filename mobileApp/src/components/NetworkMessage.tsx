import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import useAuth from '../hooks/useAuth';
import {getApiBaseUrl} from '../utils/apiHelper';
import connectivityManager from '../utils/connectivityManager';
import {
  checkNetworkConnection,
  testApiConnection,
} from '../utils/networkDebug.ts';

const NetworkMessage = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [networkStatus, setNetworkStatus] = useState<
    'checking' | 'connected' | 'disconnected' | 'api-error'
  >('checking');

  useEffect(() => {
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

  const getNetworkStatusMessage = () => {
    switch (networkStatus) {
      case 'checking':
        return 'Checking network connectivity...';
      case 'connected':
        return 'Connected to the network';
      case 'disconnected':
        return 'No internet connection. Please check your network settings.';
      case 'api-error':
        return 'Cannot connect to the server. Please check your API configuration.';
      default:
        return '';
    }
  };

  const getNetworkStatusColor = () => {
    switch (networkStatus) {
      case 'checking':
        return '#f39c12';
      case 'connected':
        return '#2ecc71';
      case 'disconnected':
      case 'api-error':
        return '#e74c3c';
      default:
        return '#7f8c8d';
    }
  };

  return (
    <View
      style={{
        backgroundColor: getNetworkStatusColor(),
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
      }}>
      <Text style={{color: 'white', textAlign: 'center'}}>
        {getNetworkStatusMessage()}
      </Text>
      {(networkStatus === 'disconnected' || networkStatus === 'api-error') && (
        <TouchableOpacity
          onPress={checkNetwork}
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: 8,
            borderRadius: 5,
            marginTop: 8,
          }}>
          <Text style={{color: 'white', textAlign: 'center'}}>
            Retry Connection
          </Text>
        </TouchableOpacity>
      )}

      {(networkStatus === 'disconnected' || networkStatus === 'api-error') && (
        <TouchableOpacity
          onPress={() => navigation.navigate('NetworkDiagnostic')}
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: 8,
            borderRadius: 5,
            marginTop: 8,
          }}>
          <Text style={{color: 'white', textAlign: 'center'}}>
            Run Network Diagnostics
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default NetworkMessage;
