import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme';
import gameBoardStyles from './GameBoard.styles';

//TODO: Code cleaning and optimization required

interface GameBoardProps {
  board: number[][];
  onCellClick: (row: number, col: number) => void;
  gameStatus: 'idle' | 'ongoing' | 'won' | 'draw' | 'x wins' | 'o wins';
  playerTurn: boolean;
  loadingCell?: { row: number; col: number } | null;
  apiError?: string | null;
}

const GameBoard = ({
  board,
  onCellClick,
  gameStatus,
  playerTurn,
  loadingCell = null,
  apiError,
}: GameBoardProps) => {
  const safeBoard = Array?.isArray?.(board) ? board : [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];

  const renderCell = (value: number, isLoading: boolean) => {
    if (isLoading) {
      return <ActivityIndicator size="small" color="#3498db" />;
    }
    if (value === 1) return 'O';
    if (value === -1) return 'X';
    return '';
  };

  const isCellClickable = (row: number, col: number) => {
    if (!safeBoard || !safeBoard[row] || typeof safeBoard[row][col] === 'undefined') {
      return false;
    }
    if (loadingCell) return false;
    return playerTurn && safeBoard[row][col] === 0 && gameStatus === 'ongoing';
  };

  const renderStatus = () => {
    const message = gameStatus === 'won' || gameStatus === 'x wins' || gameStatus === 'o wins'
      ? (playerTurn ? 'Computer Won' : 'User Won')
      : gameStatus === 'draw'
        ? "It's a Draw"
        : playerTurn
          ? 'User Turn (X)'
          : "Waiting...";

    if (apiError) {
      return <Text style={styles.errorStatus}>API Error: {apiError}</Text>;
    }
    return message;
  };

  return (
    <View style={styles.boardContainer}>
      <View style={styles.board}>
        {safeBoard.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((cell, colIndex) => {
              const isClickable = isCellClickable(rowIndex, colIndex);
              const isCellLoading = loadingCell &&
                loadingCell.row === rowIndex &&
                loadingCell.col === colIndex;

              const isLastColumn = colIndex === row.length - 1;

              return (
                <TouchableOpacity
                  key={`${rowIndex}-${colIndex}`}
                  style={[
                    styles.cell,
                    isCellLoading ? styles.loadingCell : null,
                    !isLastColumn && { marginRight: 10 }
                  ]}
                  onPress={() => {
                    if (isClickable) {
                      onCellClick(rowIndex, colIndex);
                    }
                  }}
                  activeOpacity={isClickable ? 0.7 : 1}
                  disabled={!isClickable || isCellLoading}
                >
                  <View style={styles.cellContent}>
                    {isCellLoading ? (
                      <ActivityIndicator size="small" color={colors.secondary} />
                    ) : (
                      <Text style={styles.cellText}>
                        {renderCell(cell, isCellLoading)}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
      <View
        style={[
          styles.status,
          gameStatus === 'won' || gameStatus === 'x wins' || gameStatus === 'o wins'
            ? (playerTurn ? styles.lostStatus : styles.wonStatus)
            : gameStatus === 'draw'
              ? styles.drawStatus
              : null
        ]}
      >
        <Text
          style={[
            styles.statusText,
            gameStatus === 'won' || gameStatus === 'x wins' || gameStatus === 'o wins'
              ? (playerTurn ? styles.lostStatusText : styles.wonStatusText)
              : gameStatus === 'draw'
                ? styles.drawStatusText
                : styles.normalStatusText
          ]}
        >
          {renderStatus()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ...gameBoardStyles,
  loadingCell: {
    backgroundColor: colors.board.cell,
    borderColor: 'rgba(52, 152, 219, 0.3)',
    borderWidth: 1,
  },
  errorStatus: {
    color: colors.error,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GameBoard; 