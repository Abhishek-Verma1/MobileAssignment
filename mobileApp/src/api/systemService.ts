import api from './apiConfig';

const computerMove = async (board: number[][], sessionId: string) => {
  try {
    const response = await api.post('/game/pc_move', {board, sessionId});
    return {
      board: response.data.board
        ? typeof response.data.board === 'string'
          ? JSON.parse(response.data.board.replace(/'/g, '"'))
          : response.data.board
        : board,
      status: response.data.status || response.data.gameStatus,
      sessionId: response.data.id || sessionId,
      currentPlayer: response.data.currentPlayer === 'x' ? -1 : 1,
      winner: response.data.winner,
    };
  } catch (error) {
    console.log(error)
  }
};

const SystemService = {
  computerMove
};

export default SystemService;
