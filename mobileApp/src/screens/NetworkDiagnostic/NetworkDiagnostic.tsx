import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import GameService from '../../api/gameService';
import Button from '../../components/Button';
import Header from '../../components/Header';
import {authSuccess, logout} from '../../redux/slices/authSlice';
import {RootState, store} from '../../redux/store';
import {
  getApiBaseUrl,
  getConnectionInfo,
  isUrlReachable,
} from '../../utils/apiHelper';
import {logNetworkInfo} from '../../utils/networkDebug';
import networkDiagnosticStyles from './NetworkDiagnostic.styles';

const styles = StyleSheet.create(networkDiagnosticStyles as any);

const NetworkDiagnostic = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [apiResults, setApiResults] = useState<any>(null);
  const [results, setResults] = useState<{[key: string]: any}>({});
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const authToken = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      await logNetworkInfo();

      const connectionInfo = await getConnectionInfo();

      const apiUrl = getApiBaseUrl();
      const apiBaseReachable = await isUrlReachable(apiUrl);
      const apiHealthReachable = await isUrlReachable(
        `${apiUrl}/system/health`,
      );
      const googleReachable = await isUrlReachable('https://www.google.com');

      const portResults = await testMultipleApiPorts();

      setDiagnosticResults({
        connectionInfo,
        endpoints: {
          apiBaseReachable,
          apiHealthReachable,
          googleReachable,
        },
        portResults,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      Alert.alert(
        'Diagnostic Error',
        'An error occurred while running network diagnostics',
      );
    } finally {
      setLoading(false);
    }
  };

  const testMultipleApiPorts = async () => {
    const results = {};
    const ports = [8000, 8080, 3000];
    const baseHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

    for (const port of ports) {
      const baseUrl = `http://${baseHost}:${port}`;
      try {
        console.log(`Testing API on port ${port}...`);
        const isReachable = await isUrlReachable(baseUrl);
        const healthEndpoint = await isUrlReachable(`${baseUrl}/system/health`);
        const gameEndpoint = await isUrlReachable(
          `${baseUrl}/game/create_game_session`,
          'HEAD',
        );

        results[port] = {
          baseUrl,
          isReachable,
          healthEndpoint,
          gameEndpoint,
          timestamp: new Date().toISOString(),
        };

        if (isReachable && (healthEndpoint || gameEndpoint)) {
          console.log(`Found potentially working API on port ${port}`);
        }
      } catch (error) {
        results[port] = {error: String(error)};
      }
    }

    return results;
  };

  const testApiEndpoints = async () => {
    setLoading(true);
    try {
      const apiUrl = getApiBaseUrl();

      const results = {
        health: await fetchWithTimeout(`${apiUrl}/system/health`),
        auth: await fetchWithTimeout(
          `${apiUrl}/auth/login`,
          'POST',
          undefined,
          JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
          }),
        ),
        gameSession: await fetchWithTimeout(
          `${apiUrl}/game/create_game_session`,
          'POST',
          undefined,
          JSON.stringify({
            startWithPlayer: true,
          }),
        ),
        player: await fetchWithTimeout(`${apiUrl}/player/stats`),
        stats: await fetchWithTimeout(`${apiUrl}/stats/leaderboard`),
      };

      setApiResults(results);
    } catch (error) {
      Alert.alert(
        'API Test Error',
        'An error occurred while testing API endpoints',
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchWithTimeout = async (
    url: string,
    method: string = 'GET',
    timeout = 5000,
    body?: string,
  ) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const options: RequestInit = {
        method,
        headers: {'Content-Type': 'application/json'},
        signal: controller.signal,
      };

      if (
        body &&
        (method === 'POST' || method === 'PUT' || method === 'PATCH')
      ) {
        options.body = body;
      }

      console.log(`Fetching ${url} with method ${method}`);
      const response = await fetch(url, options);
      console.log(`Response for ${url}: status=${response.status}`);

      clearTimeout(timeoutId);

      return {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      };
    } catch (error: any) {
      return {
        error:
          error.name === 'AbortError' ? 'Request timed out' : error.message,
        ok: false,
      };
    }
  };

  const testGameSession = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'You need to log in first to test game session creation.',
      );
      return;
    }

    setLoading(true);
    try {
      if (!authToken) {
        throw new Error('No authentication token available');
      }

      console.log(
        `Auth token for game session test: ${authToken.substring(0, 15)}...`,
      );

      const apiUrl = getApiBaseUrl();
      const apiBaseReachable = await isUrlReachable(apiUrl);

      if (!apiBaseReachable) {
        throw new Error(`API base URL (${apiUrl}) is not reachable`);
      }

      console.log('Attempting to create a game session...');
      console.log('Request payload: ', {startWithPlayer: true});

      const gameSessionData = await GameService.createGameSession(true);

      console.log('Game session created successfully:', gameSessionData);

      setResults({
        ...results,
        gameSession: {
          success: true,
          sessionId: gameSessionData.sessionId,
          timestamp: new Date().toISOString(),
          status: gameSessionData.status,
        },
      });

      Alert.alert(
        'Game Session Test',
        `Successfully created game session with ID: ${gameSessionData.sessionId}.\n\nStatus: ${gameSessionData.status}\n\nThis indicates that authentication is working correctly and the game API is accessible.`,
        [{text: 'OK'}],
      );
    } catch (error: any) {
      setResults({
        ...results,
        gameSession: {
          success: false,
          error: error.message || 'Unknown error',
          timestamp: new Date().toISOString(),
        },
      });

      let errorMessage = error.message || 'Unknown error';
      let suggestions = '';

      if (
        errorMessage.includes('authentication') ||
        errorMessage.includes('401')
      ) {
        suggestions =
          '\n\nSuggestions:\n• Try enabling Debug Auth\n• Check if your token has expired\n• Verify the token format is correct';
      } else if (
        errorMessage.includes('network') ||
        errorMessage.includes('reach')
      ) {
        suggestions =
          '\n\nSuggestions:\n• Check your internet connection\n• Ensure the backend server is running\n• Try running the basic diagnostics';
      } else if (errorMessage.includes('timeout')) {
        suggestions =
          '\n\nSuggestions:\n• The server may be slow or overloaded\n• Check backend server logs\n• Try again later';
      }

      Alert.alert(
        'Game Session Error',
        `Failed to create game session: ${errorMessage}${suggestions}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDebugAuth = () => {
    if (isAuthenticated) {
      dispatch(logout());
      console.log('Logged out from debug authentication');
      Alert.alert('Debug Auth Cleared', 'You have been logged out.');
    } else {
      const mockAuthData = {
        token:
          'mockToken123456789.thisIsAMockTokenForDebuggingPurposesOnly.shouldBeReplacedWithRealToken',
        user: {
          id: '123',
          name: 'Test User',
          email: 'test@test.com',
        },
      };

      dispatch(authSuccess(mockAuthData));

      console.log('Debug authentication enabled with token');
      console.log(
        'Auth token set:',
        mockAuthData.token.substring(0, 15) + '...',
      );
      console.log('Token length:', mockAuthData.token.length);

      setTimeout(() => {
        const state = store.getState();
        console.log('Auth state after setting debug token:', {
          isAuthenticated: state.auth?.isAuthenticated,
          hasToken: Boolean(state.auth?.token),
          tokenLength: state.auth?.token ? state.auth.token.length : 0,
        });
      }, 100);

      Alert.alert(
        'Debug Auth Enabled',
        'You are now logged in with a debug API token.',
      );
    }
  };

  const testGameSessionEndpoint = async () => {
    if (!isAuthenticated || !authToken) {
      Alert.alert(
        'Authentication Required',
        'You need to be logged in to test this endpoint.',
      );
      return;
    }

    setLoading(true);

    try {
      const apiUrl = getApiBaseUrl();
      const endpoint = `${apiUrl}/game/create_game_session`;

      console.log(`Testing direct fetch to ${endpoint} with auth token`);
      console.log('Auth token being used:', authToken.substring(0, 15) + '...');
      console.log('Auth token length:', authToken.length);
      console.log('Auth header:', `Bearer ${authToken}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const baseUrlResponse = await fetch(apiUrl, {
          method: 'HEAD',
          signal: controller.signal,
        });
        console.log(
          `Base URL connection test result: ${baseUrlResponse.status}`,
        );
      } catch (baseUrlError) {
        console.log(`Base URL connection test failed: ${baseUrlError}`);
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({startWithPlayer: true}),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`Response status: ${response.status}`);
      console.log('Response headers:', response.headers);

      let resultText = '';
      let responseData = null;

      if (response.ok) {
        try {
          responseData = await response.json();
          resultText = `SUCCESS: Created game session with ID: ${responseData.sessionId}`;
          console.log('Response data:', responseData);
        } catch (parseError) {
          resultText = `SUCCESS with status ${response.status}, but failed to parse JSON response`;
        }
      } else {
        try {
          responseData = await response.text();
          resultText = `FAILED with status ${response.status}: ${responseData}`;
        } catch (textError) {
          resultText = `FAILED with status ${response.status}`;
        }
      }

      setResults({
        ...results,
        directTest: {
          endpoint,
          status: response.status,
          ok: response.ok,
          data: responseData,
          timestamp: new Date().toISOString(),
        },
      });

      Alert.alert('Direct Endpoint Test Result', resultText, [{text: 'OK'}]);
    } catch (error: any) {
      let errorMessage = '';
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out after 10 seconds';
      } else {
        errorMessage = error.message || 'Unknown error occurred';
      }

      setResults({
        ...results,
        directTest: {
          error: errorMessage,
          timestamp: new Date().toISOString(),
        },
      });

      Alert.alert('Direct Endpoint Test Failed', `Error: ${errorMessage}`, [
        {text: 'OK'},
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Network Diagnostic Tool</Text>
          <Text style={styles.subtitle}>
            Use this tool to diagnose network connectivity issues in the app
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Authentication Status</Text>
            <Text style={styles.label}>
              Authenticated:{' '}
              <Text
                style={[
                  styles.value,
                  isAuthenticated ? styles.success : styles.error,
                ]}>
                {isAuthenticated ? 'Yes' : 'No'}
              </Text>
            </Text>
            {authToken && (
              <Text style={styles.label}>
                Auth Token:{' '}
                <Text style={styles.value}>
                  {authToken.substring(0, 15)}...
                </Text>
              </Text>
            )}
            <Button
              title={isAuthenticated ? 'Clear Auth Debug' : 'Enable Auth Debug'}
              onPress={handleDebugAuth}
              style={styles.button}
            />
            {isAuthenticated && (
              <Button
                title="Test Game Session"
                onPress={testGameSession}
                style={[styles.button, {marginTop: 8}]}
              />
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={runDiagnostics}
              disabled={loading}>
              <Text style={styles.buttonText}>Run Basic Diagnostics</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={testApiEndpoints}
              disabled={loading}>
              <Text style={styles.buttonText}>Test API Endpoints</Text>
            </TouchableOpacity>

            {isAuthenticated && (
              <TouchableOpacity
                style={styles.button}
                onPress={testGameSessionEndpoint}
                disabled={loading}>
                <Text style={styles.buttonText}>
                  Test Game Session Endpoint
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3498db" />
              <Text style={styles.loadingText}>Running diagnostics...</Text>
            </View>
          )}

          {diagnosticResults && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>Network Diagnostics</Text>
              <Text style={styles.timestamp}>
                Timestamp:{' '}
                {new Date(diagnosticResults.timestamp).toLocaleString()}
              </Text>

              <View style={styles.resultCard}>
                <Text style={styles.resultHeading}>Connection Status</Text>
                <Text style={styles.resultItem}>
                  Connected:{' '}
                  {String(diagnosticResults.connectionInfo.isConnected)}
                </Text>
                <Text style={styles.resultItem}>
                  Connection Type:{' '}
                  {diagnosticResults.connectionInfo.connectionType}
                </Text>
                <Text style={styles.resultItem}>
                  Internet Reachable:{' '}
                  {String(diagnosticResults.connectionInfo.isInternetReachable)}
                </Text>
              </View>

              <View style={styles.resultCard}>
                <Text style={styles.resultHeading}>Endpoint Reachability</Text>
                <Text style={styles.resultItem}>
                  API Base URL:{' '}
                  {String(diagnosticResults.endpoints.apiBaseReachable)}
                </Text>
                <Text style={styles.resultItem}>
                  API Health Endpoint:{' '}
                  {String(diagnosticResults.endpoints.apiHealthReachable)}
                </Text>
                <Text style={styles.resultItem}>
                  Google.com:{' '}
                  {String(diagnosticResults.endpoints.googleReachable)}
                </Text>
              </View>

              {diagnosticResults.portResults && (
                <View style={styles.resultCard}>
                  <Text style={styles.resultHeading}>API Port Tests</Text>
                  {Object.entries(diagnosticResults.portResults).map(
                    ([port, data]: [string, any]) => (
                      <View key={port} style={styles.portTestItem}>
                        <Text style={styles.portLabel}>Port {port}:</Text>
                        {data.error ? (
                          <Text style={styles.errorText}>
                            Error: {data.error}
                          </Text>
                        ) : (
                          <>
                            <Text
                              style={[
                                styles.portStatus,
                                data.isReachable
                                  ? styles.success
                                  : styles.error,
                              ]}>
                              Base URL:{' '}
                              {data.isReachable ? 'Reachable' : 'Not Reachable'}
                            </Text>
                            <Text
                              style={[
                                styles.portStatus,
                                data.healthEndpoint
                                  ? styles.success
                                  : styles.error,
                              ]}>
                              Health Endpoint:{' '}
                              {data.healthEndpoint
                                ? 'Available'
                                : 'Not Available'}
                            </Text>
                            <Text
                              style={[
                                styles.portStatus,
                                data.gameEndpoint
                                  ? styles.success
                                  : styles.error,
                              ]}>
                              Game Endpoint:{' '}
                              {data.gameEndpoint
                                ? 'Available'
                                : 'Not Available'}
                            </Text>
                            {data.isReachable &&
                              (data.healthEndpoint || data.gameEndpoint) && (
                                <TouchableOpacity
                                  style={styles.usePortButton}
                                  onPress={() => {
                                    const {
                                      updateApiBaseUrl,
                                    } = require('../../api/apiConfig');
                                    updateApiBaseUrl(data.baseUrl);
                                    Alert.alert(
                                      'API URL Updated',
                                      `API base URL updated to: ${data.baseUrl}`,
                                      [{text: 'OK'}],
                                    );
                                  }}>
                                  <Text style={styles.usePortButtonText}>
                                    Use This Port
                                  </Text>
                                </TouchableOpacity>
                              )}
                          </>
                        )}
                      </View>
                    ),
                  )}
                </View>
              )}
            </View>
          )}

          {apiResults && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>API Endpoint Tests</Text>

              <View style={styles.resultCard}>
                <Text style={styles.resultHeading}>Health Endpoint</Text>
                {apiResults.health.error ? (
                  <Text style={styles.errorText}>
                    Error: {apiResults.health.error}
                  </Text>
                ) : (
                  <>
                    <Text style={styles.resultItem}>
                      Status: {apiResults.health.status}
                    </Text>
                    <Text style={styles.resultItem}>
                      OK: {String(apiResults.health.ok)}
                    </Text>
                  </>
                )}
              </View>

              <View style={styles.resultCard}>
                <Text style={styles.resultHeading}>Auth Login Endpoint</Text>
                {apiResults.auth.error ? (
                  <Text style={styles.errorText}>
                    Error: {apiResults.auth.error}
                  </Text>
                ) : (
                  <>
                    <Text style={styles.resultItem}>
                      Status: {apiResults.auth.status}
                    </Text>
                    <Text style={styles.resultItem}>
                      OK: {String(apiResults.auth.ok)}
                    </Text>
                  </>
                )}
              </View>

              <View style={styles.resultCard}>
                <Text style={styles.resultHeading}>Game Session Endpoint</Text>
                {apiResults.gameSession.error ? (
                  <Text style={styles.errorText}>
                    Error: {apiResults.gameSession.error}
                  </Text>
                ) : (
                  <>
                    <Text style={styles.resultItem}>
                      Status: {apiResults.gameSession.status}
                    </Text>
                    <Text style={styles.resultItem}>
                      OK: {String(apiResults.gameSession.ok)}
                    </Text>
                  </>
                )}
              </View>

              <View style={styles.resultCard}>
                <Text style={styles.resultHeading}>Player Stats Endpoint</Text>
                {apiResults.player.error ? (
                  <Text style={styles.errorText}>
                    Error: {apiResults.player.error}
                  </Text>
                ) : (
                  <>
                    <Text style={styles.resultItem}>
                      Status: {apiResults.player.status}
                    </Text>
                    <Text style={styles.resultItem}>
                      OK: {String(apiResults.player.ok)}
                    </Text>
                  </>
                )}
              </View>

              <View style={styles.resultCard}>
                <Text style={styles.resultHeading}>
                  Stats Leaderboard Endpoint
                </Text>
                {apiResults.stats.error ? (
                  <Text style={styles.errorText}>
                    Error: {apiResults.stats.error}
                  </Text>
                ) : (
                  <>
                    <Text style={styles.resultItem}>
                      Status: {apiResults.stats.status}
                    </Text>
                    <Text style={styles.resultItem}>
                      OK: {String(apiResults.stats.ok)}
                    </Text>
                  </>
                )}
              </View>
            </View>
          )}

          <View style={styles.helpContainer}>
            <Text style={styles.helpTitle}>Having Trouble?</Text>
            <Text style={styles.helpText}>
              If diagnostics show network issues, try the following:
            </Text>
            <Text style={styles.helpItem}>
              • Ensure your device has internet connectivity
            </Text>
            <Text style={styles.helpItem}>
              • Check if the backend API server is running
            </Text>
            <Text style={styles.helpItem}>
              • For Android emulator, use 10.0.2.2 instead of localhost
            </Text>
            <Text style={styles.helpItem}>
              • For physical devices, use your computer's IP address
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NetworkDiagnostic;
