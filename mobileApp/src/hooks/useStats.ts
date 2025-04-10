import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import StatsService from '../api/statsService';
import {RootState} from '../redux/store';

const defaultStats = {
  wins: 0,
  losses: 0,
  draws: 0,
  totalGames: 0,
  winRate: 0,
};

const useStats = () => {
  const dispatch = useDispatch();
  const statsState = useSelector((state: RootState) => state.stats);
  const authState = useSelector((state: RootState) => state.auth);

  const getStats = useCallback(async () => {
    try {
      console.log('Getting stats from service...');
      console.log(
        'Auth state:',
        authState.isAuthenticated ? 'Authenticated' : 'Not authenticated',
      );

      if (!authState.isAuthenticated) {
        console.log('User is not authenticated, cannot fetch stats');
        // dispatch(statsFailure('Please login to view your statistics'));
        return null;
      }

      const data = await StatsService.getStats();
      console.log('Stats retrieved successfully:', data);

      const validData = {
        ...defaultStats,
        ...data,
      };
      return validData;
    } catch (error: any) {
      let errorMessage = 'Failed to get statistics';
      if (error.message) {
        errorMessage = error.message;
      }
      if (error.message && error.message.includes('Network Error')) {
        errorMessage =
          'Cannot connect to the server. Please check your network connection.';
      }
      return null;
    }
  }, [dispatch, authState]);

  const getLeaderboard = useCallback(async () => {
    try {
      console.log('Getting leaderboard from service...');
      if (!authState.isAuthenticated) {
        console.log('User is not authenticated, cannot fetch leaderboard');
        // dispatch(statsFailure('Please login to view the leaderboard'));
        return null;
      }
      const data = await StatsService.getLeaderboard();
      console.log('Leaderboard retrieved successfully:', data);
      return data;
    } catch (error: any) {
      let errorMessage = 'Failed to get leaderboard';
      if (error.message) {
        errorMessage = error.message;
      }
      if (error.message && error.message.includes('Network Error')) {
        errorMessage =
          'Cannot connect to the server. Please check your network connection.';
      }
      return null;
    }
  }, [dispatch, authState]);

  //TODO:
  const clearStats = useCallback(() => {
    // dispatch(clearStatsAction());
  }, [dispatch]);

  //TODO:
  const clearError = useCallback(() => {
    // dispatch(clearStatsError());
  }, [dispatch]);

  return {
    ...statsState,
    getStats,
    getLeaderboard,
    clearStats,
    clearError,
  };
};

export default useStats;
