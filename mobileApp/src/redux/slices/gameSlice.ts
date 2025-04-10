import {createSlice, PayloadAction} from '@reduxjs/toolkit';

//TODO: Need to manage in a better way, lots of extra code.
interface GameState {
  board: number[][] | null;
  gameStatus: 'idle' | 'ongoing' | 'won' | 'draw' | 'x wins' | 'o wins';
  playerTurn: boolean;
  sessionId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: GameState = {
  board: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  gameStatus: 'idle',
  playerTurn: true,
  sessionId: null,
  loading: false,
  error: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    gameRequest: state => {
      state.loading = true;
      state.error = null;
    },
    setGameData: (
      state,
      action: PayloadAction<{
        board: number[][];
        status: string;
        sessionId: string;
        playerTurn: boolean;
        startWithPlayer: boolean;
      }>,
    ) => {
      state.loading = false;
      state.board = action.payload.board;
      state.gameStatus =
        action.payload.status === 'ongoing'
          ? 'ongoing'
          : action.payload.status === 'x wins'
          ? 'x wins'
          : action.payload.status === 'o wins'
          ? 'o wins'
          : action.payload.status === 'draw'
          ? 'draw'
          : 'idle';
      state.sessionId = action.payload.sessionId;
      state.playerTurn = action.payload.playerTurn;
    },
    setPlayerMove: (
      state,
      action: PayloadAction<{
        row: number;
        col: number;
        board?: number[][];
        gameStatus?: string;
      }>,
    ) => {
      if (state.board) {
        const {row, col, board, gameStatus} = action.payload;

        if (board) {
          state.board = board;
        } else {
          const updatedBoard = [...state.board.map(rowArray => [...rowArray])];
          updatedBoard[row][col] = -1;
          state.board = updatedBoard;
        }

        if (gameStatus) {
          state.gameStatus =
            gameStatus === 'ongoing'
              ? 'ongoing'
              : gameStatus === 'x wins'
              ? 'x wins'
              : gameStatus === 'o wins'
              ? 'o wins'
              : gameStatus === 'draw'
              ? 'draw'
              : gameStatus === 'won'
              ? 'won'
              : 'idle';
        }

        state.playerTurn = false;
      }
    },
    updateBoard: (
      state,
      action: PayloadAction<{
        board?: number[][];
        status: string;
        isPlayerTurn: boolean;
      }>,
    ) => {
      state.loading = false;
      if (action.payload.board) {
        state.board = action.payload.board;
      }
      state.gameStatus =
        action.payload.status === 'ongoing'
          ? 'ongoing'
          : action.payload.status === 'x wins'
          ? 'x wins'
          : action.payload.status === 'o wins'
          ? 'o wins'
          : action.payload.status === 'draw'
          ? 'draw'
          : action.payload.status === 'won'
          ? 'won'
          : 'idle';
      state.playerTurn = action.payload.isPlayerTurn;
    },
    gameFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetGame: () => {
      return initialState;
    },
    clearError: state => {
      state.error = null;
    },
  },
});

export const {
  gameRequest,
  setGameData,
  setPlayerMove,
  updateBoard,
  gameFailure,
  resetGame,
  clearError,
} = gameSlice.actions;

export default gameSlice.reducer;
