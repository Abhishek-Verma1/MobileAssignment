import React, { useEffect, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme';
import connectivityManager from '../../utils/connectivityManager';

interface NetworkStatusBarProps {
  showOfflineOnly?: boolean;
}

const NetworkStatusBar: React.FC<NetworkStatusBarProps> = ({
  showOfflineOnly = false
}) => {
  const [isConnected, setIsConnected] = useState(true);
  const [visible, setVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const animation = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = connectivityManager.addListener((connected) => {
      setIsConnected(connected);
      setVisible(!connected || !showOfflineOnly);
      Animated.timing(animation, {
        toValue: !connected ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    return unsubscribe;
  }, [animation, showOfflineOnly]);
  if (isConnected && showOfflineOnly) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isConnected ? colors.success : colors.error,
          paddingTop: insets.top || 10,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              })
            }
          ]
        }
      ]}
    >
      <Text style={styles.text}>
        {isConnected
          ? 'Connected to network'
          : 'No internet connection'}
      </Text>
      {!isConnected && (
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            const connected = await connectivityManager.checkConnectivity();
            if (!connected) {
              setIsConnected(true);
              setTimeout(() => {
                setIsConnected(false);
              }, 1000);
            }
          }}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    zIndex: 999,
  },
  text: {
    color: colors.text.inverse,
    fontWeight: '600',
    flex: 1,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: colors.text.inverse,
    fontWeight: '600',
    fontSize: 12,
  }
});

export default NetworkStatusBar; 