import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import GameService from '../api/gameService';
import PlayerService from '../api/playerService';
import SystemService from '../api/systemService';
import {
  clearError as clearGameError,
  gameFailure,
  gameRequest,
  resetGame as resetGameAction,
  setGameData,
  setPlayerMove,
  updateBoard,
} from '../redux/slices/gameSlice';
import {RootState} from '../redux/store';
import useNetwork from './useNetwork';

//TODO: Code cleaning and optimization required
//TODO: Lots of extra and duplciate code

const useGame = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: RootState) => state.game);
  const response =  useNetwork();
  
  const createNewGameSession = useCallback(
    async (startWithPlayer: boolean) => {
      try {
        dispatch(gameRequest());
        const data = await GameService.createGameSessionRobust(startWithPlayer);

        dispatch(
          setGameData({
            board: data.board || [
              [0, 0, 0],
              [0, 0, 0],
              [0, 0, 0],
            ],
            status: data.status || 'ongoing',
            sessionId: data.sessionId || '',
            playerTurn: data.currentPlayer === -1,
            startWithPlayer,
          }),
        );
        return data;
      } catch (error: any) {
        dispatch(gameFailure(error.message || 'Failed to create game session'));
        throw error;
      }
    },
    [dispatch],
  );

  const getExistingGameSession = useCallback(
    async (sessionId: string) => {
      try {
        dispatch(gameRequest());
        const data = await GameService.getGameSession(sessionId);

        dispatch(
          setGameData({
            board: data.board || [
              [0, 0, 0],
              [0, 0, 0],
              [0, 0, 0],
            ],
            status: data.status || 'ongoing',
            sessionId: data.sessionId || sessionId,
            playerTurn: data.currentPlayer === -1,
            startWithPlayer: true,
          }),
        );
        return data;
      } catch (error: any) {
        dispatch(gameFailure(error.message || 'Failed to get game session'));
        throw error;
      }
    },
    [dispatch],
  );

  const makePlayerMove = useCallback(
    async (row: number, col: number) => {
      try {
        const {board, sessionId} = gameState;
        if (!board || !sessionId) {
          throw new Error('No active game session');
        }
        dispatch(gameRequest());
        const newBoard = board?.map?.(rowArray => [...rowArray]);
        newBoard[row][col] = -1;
        const data = await PlayerService.playerMove(newBoard, sessionId);

        dispatch(
          setPlayerMove({
            board: data.board,
            gameStatus: data.status,
            row,
            col,
          }),
        );
        return data;
      } catch (error: any) {
        dispatch(gameFailure(error.message || 'Failed to make player move'));
        throw error;
      }
    },
    [dispatch, gameState],
  );

  const makeComputerMove = useCallback(
    async (board: number[][], sessionId: string) => {
      try {
        dispatch(gameRequest());
        const boardCopy = board.map(row => [...row]);
        const data = await SystemService.computerMove(boardCopy, sessionId);

        dispatch(
          updateBoard({
            board: data.board,
            status: data.status,
            isPlayerTurn: true,
          }),
        );
        return data;
      } catch (error: any) {
        dispatch(gameFailure(error.message || 'Failed to make Computer move:'));
        throw error;
      }
    },
    [dispatch],
  );

  const checkBoardStatus = useCallback(
    async (board: number[][]) => {
      try {
        dispatch(gameRequest());
        const data = await GameService.checkBoard(board);

        dispatch(
          updateBoard({
            status: data.gameStatus || data.status,
            isPlayerTurn: true,
          }),
        );
        return data;
      } catch (error: any) {
        dispatch(gameFailure(error.message || 'Failed to check board status'));
        throw error;
      }
    },
    [dispatch],
  );

  const resetGame = useCallback(() => {
    dispatch(resetGameAction());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearGameError());
  }, [dispatch]);

  return {
    ...gameState,
    createNewGameSession,
    getExistingGameSession,
    makePlayerMove,
    makeComputerMove,
    checkBoardStatus,
    resetGame,
    clearError,
  };
};

export default useGame;
