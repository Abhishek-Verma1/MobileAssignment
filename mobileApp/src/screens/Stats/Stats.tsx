//TODO: Code cleaning and optimization required

import useStats from '@hooks/useStats';
import {useFocusEffect} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Header from '../../components/Header';
import useAuth from '../../hooks/useAuth';
import statsStyles from './Stats.styles';

const Stats = () => {
  const {isAuthenticated} = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [result, setResult] = useState({
    wins: 0,
    losses: 0,
    draws: 0,
    winRate: 0,
    totalGames: 0,
  });

  const {getStats} = useStats();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      setFetchError(null);
      setRefreshing(true);

      console.log('Fetching stats.......');
      const result = await getStats();

      if (!result) {
        console.log('No stats data returned.......');
        setFetchError('No statistics data available. Try refreshing.');
      }

      setResult(result);
    } catch (err: any) {
      setFetchError(err.message || 'Failed to load statistics.......');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [getStats]);

  useEffect(() => {
    fetchStats();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        console.log('Stats screen focused, refreshing data.....');
        fetchStats();
      }
      return () => {};
    }, [isAuthenticated, fetchStats]),
  );

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.content}>
          <Text style={styles.title}>Game Stats</Text>
          <View style={styles.noStatsContainer}>
            <Text style={styles.noStatsText}>
              Please login to view your stats.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Game Stats</Text>
          </View>

          {loading ? (
            <SafeAreaView style={styles.container}>
              <Header />
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={styles.loadingText}>Loading stats...</Text>
              </View>
            </SafeAreaView>
          ) : (
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{result?.totalGames || 0}</Text>
                <Text style={styles.statLabel}>total games</Text>
              </View>

              <View style={styles.statsRow}>
                <View style={[styles.statCard, styles.winCard]}>
                  <Text style={styles.statValue}>{result.wins || 0}</Text>
                  <Text style={styles.statLabel}>wins</Text>
                </View>

                <View style={[styles.statCard, styles.lossCard]}>
                  <Text style={styles.statValue}>{result.losses || 0}</Text>
                  <Text style={styles.statLabel}>losses</Text>
                </View>

                <View style={[styles.statCard, styles.drawCard]}>
                  <Text style={styles.statValue}>{result.draws || 0}</Text>
                  <Text style={styles.statLabel}>draws</Text>
                </View>
              </View>

              <View style={[styles.statCard, styles.winRateCard]}>
                <Text style={styles.statValue}>
                  {result?.winRate?.toFixed(1) || 0}%
                </Text>
                <Text style={styles.statLabel}>Winning percentage</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

//TODO: Move to a new style file
const styles = StyleSheet.create({
  ...(statsStyles as any),
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  refreshButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  tryAgainButton: {
    marginTop: 10,
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  tryAgainButtonText: {
    color: '#3498db',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Stats;
