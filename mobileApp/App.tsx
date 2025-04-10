import React from 'react';
import {LogBox, StatusBar, Text, TouchableOpacity, View} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import AppNavigator from './src/navigation';
import {persistor, store} from './src/redux/store';

//TODO: Code cleaning and optimization required

LogBox.ignoreLogs([
  'ViewPropTypes will be removed from React Native',
  'AsyncStorage has been extracted from react-native',
]);

const AppLoading = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f6fa',
    }}>
    <Text
      style={{
        fontSize: 16,
        color: '#2c3e50',
        textAlign: 'center',
        padding: 20,
      }}>
      {message}
    </Text>
    {onRetry && (
      <TouchableOpacity
        onPress={onRetry}
        style={{
          backgroundColor: '#3498db',
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 5,
          marginTop: 20,
        }}>
        <Text style={{color: '#fff', fontWeight: '600'}}>Retry</Text>
      </TouchableOpacity>
    )}
  </View>
);

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<AppLoading message="Loading data..." />}
        persistor={persistor}>
        <StatusBar
          translucent={true}
          hidden={false}
          backgroundColor={false ? '#333333' : '#fff'}
          barStyle={false ? 'light-content' : 'dark-content'}
        />
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
};

class ErrorBoundary extends React.Component<
  {children: React.ReactNode},
  {hasError: boolean; error: Error | null}
> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  static getDerivedStateFromError(error: Error) {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <AppLoading
          message={`Something went wrong: ${
            this.state.error?.message || 'Unknown error'
          }`}
          onRetry={() => this.setState({hasError: false, error: null})}
        />
      );
    }

    return this.props.children;
  }
}

export default () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
