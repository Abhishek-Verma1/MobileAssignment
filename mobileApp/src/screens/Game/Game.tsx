/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable */

//TODO: Code cleaning and optimization required

import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {createGameSessionRobust} from '../../api/gameService';
import Button from '../../components/Button';
import GameBoard from '../../components/GameBoard';
import Header from '../../components/Header';
import useGame from '../../hooks/useGame';
import {authSuccess} from '../../redux/slices/authSlice';
import {setGameData} from '../../redux/slices/gameSlice';
import {RootState, store} from '../../redux/store';
import gameStyles from './Game.styles';

type RootStackParamList = {
  Login: undefined;
  Game: undefined;
  Home: undefined;
  NetworkDiagnostic: undefined;
};

type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Game'>;

interface PlayerMoveResponse {
  [key: string]: any;
}

const styles = gameStyles as Record<string, any>;

const Game = () => {
  const navigation = useNavigation<GameScreenNavigationProp>();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const authToken = useSelector((state: RootState) => state.auth.token);

  const {
    sessionId,
    board,
    gameStatus,
    playerTurn,
    loading,
    error,
    resetGame,
    createNewGameSession,
    getExistingGameSession,
    makeComputerMove,
    makePlayerMove,
  } = useGame();

  const [startWithPlayer, setStartWithPlayer] = useState(true);
  const [gameResult, setGameResult] = useState<'win' | 'loss' | 'draw' | null>(
    null,
  );
  const [showResultModal, setShowResultModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingCell, setLoadingCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  useEffect(() => {
    if (!sessionId && gameStatus === 'idle') {
      resetGame();
    }
  }, [resetGame, sessionId, gameStatus]);

  useEffect(() => {
    if (
      gameStatus === 'won' ||
      gameStatus === 'x wins' ||
      gameStatus === 'o wins' ||
      gameStatus === 'draw'
    ) {
      let result: 'win' | 'loss' | 'draw';

      if (gameStatus === 'draw') {
        result = 'draw';
      } else if (
        gameStatus === 'x wins' ||
        (gameStatus === 'won' && !playerTurn)
      ) {
        result = 'win';
      } else {
        result = 'loss';
      }

      setGameResult(result);
      setShowResultModal(true);
    }
  }, [gameStatus, playerTurn]);

  useEffect(() => {
    if (sessionId && !playerTurn && gameStatus === 'ongoing') {
      const timer = setTimeout(() => {
        makeComputerMove(board || [], sessionId);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [sessionId, playerTurn, gameStatus, board, makeComputerMove]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleCellClick = (row: number, col: number) => {
    if (!playerTurn || gameStatus !== 'ongoing' || !board || loadingCell) {
      return;
    }

    setLoadingCell({row, col});

    makePlayerMove(row, col)
      .then((response: PlayerMoveResponse) => {
        console.log('Player move successful:', response);
      })
      .catch((error: any) => {
        Alert.alert(
          'Move Error',
          'Unable to make this move. Please try again.',
        );
      })
      .finally(() => {
        setLoadingCell(null);
      });
  };

  const handleStartGame = async () => {
    console.log('Start game button pressed');
    console.log('Current state - startWithPlayer:', startWithPlayer);
    console.log('Current state - sessionId:', sessionId);
    console.log('Current state - gameStatus:', gameStatus);

    setIsLoading(true);
    setErrorMessage('');

    try {
      const state = store.getState();
      const authToken = state.auth?.token;
      console.log('Redux Auth State:', {
        isAuthenticated: state.auth?.isAuthenticated,
        hasToken: Boolean(authToken),
        tokenLength: authToken ? authToken.length : 0,
      });

      if (!isAuthenticated) {
        console.log('User not authenticated, showing error');
        setErrorMessage('Please log in to start a game');
        setIsLoading(false);

        Alert.alert(
          'Authentication Required',
          'You need to log in to play the game.',
          [{text: 'Cancel', style: 'cancel'}],
        );
        return;
      }

      if (authToken && authToken.startsWith('mockToken')) {
        console.log('Using mock token for game');
        Alert.alert(
          'Debug Mode Active',
          'You are using a mock authentication token. The game will work with simulated data.',
          [{text: 'OK'}],
        );
      }

      console.log('Creating new game session...');

      const gameData = await createGameSessionRobust(startWithPlayer);
      console.log('Game session created successfully:', gameData);

      if (gameData && gameData.sessionId) {
        dispatch(
          setGameData({
            sessionId: gameData.sessionId,
            status: gameData.status,
            board: gameData.board,
            playerTurn: gameData.currentPlayer === -1,
            startWithPlayer: startWithPlayer,
          }),
        );

        console.log('Game started with session ID:', gameData.sessionId);
      } else {
        setErrorMessage('Failed to start game: Invalid session data received');
      }
    } catch (gameError: any) {
      const errorMessage =
        gameError.message || 'Failed to start game. Please try again.';
      setErrorMessage(errorMessage);

      Alert.alert(
        'Game Start Error',
        `Could not start game: ${errorMessage}\n\nPlease check network settings and try again.`,
        [{text: 'OK'}],
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container as ViewStyle}>
      <Header title="Tic-Tac-Toe" />

      {!sessionId || gameStatus === 'idle' ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent as ViewStyle}
          showsVerticalScrollIndicator={false}>
          <View style={styles.startContainer as ViewStyle}>
            <Text style={styles.startTitle as TextStyle}>Select who will start ?</Text>

            <View style={styles.playerSelection as ViewStyle}>
              <Button
                title="User"
                onPress={() => setStartWithPlayer(true)}
                style={[
                  styles.playerButton as ViewStyle,
                  startWithPlayer && (styles.selectedPlayerButton as ViewStyle),
                ]}
                textStyle={
                  startWithPlayer
                    ? (styles.selectedPlayerText as TextStyle)
                    : undefined
                }
                secondary={!startWithPlayer}
              />
              <Button
                title="Computer"
                onPress={() => setStartWithPlayer(false)}
                style={[
                  styles.playerButton as ViewStyle,
                  !startWithPlayer &&
                    (styles.selectedPlayerButton as ViewStyle),
                ]}
                textStyle={
                  !startWithPlayer
                    ? (styles.selectedPlayerText as TextStyle)
                    : undefined
                }
                secondary={startWithPlayer}
              />
            </View>

            {errorMessage ? (
              <Text style={styles.errorText as TextStyle}>{errorMessage}</Text>
            ) : null}

            <Button
              title={isLoading ? 'Starting Game.....' : 'Start Game'}
              onPress={handleStartGame}
              disabled={isLoading}
              style={styles.actionButton as ViewStyle}
            />
          </View>
        </ScrollView>
      ) : (
        <View style={styles.content as ViewStyle}>
          <Text style={styles.instruction as TextStyle}>
            {gameStatus === 'ongoing'
              ? playerTurn
                ? 'User Turn (X)'
                : 'Computer is thinking... (O)'
              : gameStatus === 'won' ||
                gameStatus === 'x wins' ||
                gameStatus === 'o wins'
              ? playerTurn
                ? 'Computer Won'
                : 'User Won'
              : 'Game Draw'}
          </Text>

          <GameBoard
            board={board || []}
            onCellClick={handleCellClick}
            gameStatus={gameStatus || 'idle'}
            playerTurn={playerTurn || false}
            loadingCell={loadingCell}
          />

          <View style={styles.controls as ViewStyle}>
            <Button
              title="Reset Game"
              onPress={resetGame}
              style={styles.resetButton as ViewStyle}
              secondary
            />
          </View>
        </View>
      )}

      <Modal visible={showResultModal} transparent animationType="fade">
        <View style={styles.modalOverlay as ViewStyle}>
          <View style={styles.modalContent as ViewStyle}>
            <Text
              style={[
                styles.modalTitle as TextStyle,
                gameResult === 'win' && (styles.winText as TextStyle),
                gameResult === 'loss' && (styles.lossText as TextStyle),
                gameResult === 'draw' && (styles.drawText as TextStyle),
              ]}>
              {gameResult === 'win'
                ? 'User Won!'
                : gameResult === 'loss'
                ? 'Computer Won!'
                : 'Game Draw!'}
            </Text>
            <Text style={styles.modalMessage as TextStyle}>
              {gameResult === 'win'
                ? 'Congratulations! User beat the Computer'
                : gameResult === 'loss'
                ? 'Congratulations! Computer beat the user'
                : 'Nobody won this round.'}
            </Text>
            <View style={styles.modalButtons as ViewStyle}>
              <Button
                title="New Game"
                onPress={() => {
                  setShowResultModal(false);
                  resetGame();
                }}
                style={styles.modalButton as ViewStyle}
              />
              <Button
                title="View Game Board"
                onPress={() => {
                  setShowResultModal(false);
                }}
                style={styles.modalButton as ViewStyle}
                secondary
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Game;
