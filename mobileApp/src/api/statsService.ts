import api from './apiConfig';

//TODO: Code cleaning and optimization required

interface Stats {
  wins: number;
  losses: number;
  draws: number;
  totalGames?: number;
  winRate?: number;
}

const validateStats = (data: any): Stats => {
  if (!data) {
    throw new Error('No stats data received from server');
  }

  const statsData = data.stats || data;

  const validatedStats: Stats = {
    wins: typeof statsData.wins === 'number' ? statsData.wins : 0,
    losses: typeof statsData.losses === 'number' ? statsData.losses : 0,
    draws: typeof statsData.draws === 'number' ? statsData.draws : 0,
    totalGames:
      typeof statsData.totalGames === 'number'
        ? statsData.totalGames
        : undefined,
    winRate:
      typeof statsData.winRate === 'number' ? statsData.winRate : undefined,
  };
  if (
    !validatedStats.totalGames &&
    (validatedStats.wins || validatedStats.losses || validatedStats.draws)
  ) {
    validatedStats.totalGames =
      validatedStats.wins + validatedStats.losses + validatedStats.draws;
  }

  if (
    !validatedStats.winRate &&
    validatedStats.totalGames &&
    validatedStats.totalGames > 0
  ) {
    validatedStats.winRate =
      (validatedStats.wins / validatedStats.totalGames) * 100;
  }
  return validatedStats;
};

const getStats = async (): Promise<Stats> => {
  try {
    const response = await api.get('/stats');
    return validateStats(response.data);
  } catch (error: any) {
    return {} as Stats;
  }
};

const getLeaderboard = async () => {
  try {
    const response = await api.get('/stats/leaderboard');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('Authentication required to view leaderboard');
      } else if (error.response.status === 404) {
        throw new Error('Leaderboard endpoint not found');
      } else {
        throw new Error(`Server error: ${error.response.status}`);
      }
    } else if (error.request) {
      throw new Error('No response from server. Please try again later.');
    } else {
      throw error;
    }
  }
};

const StatsService = {
  getStats,
  getLeaderboard,
};

export default StatsService;
