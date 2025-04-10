import {Dimensions} from 'react-native';
import {colors} from '../../theme';

const screenWidth = Dimensions.get('window').width;
const boardSize = Math.min(screenWidth - 40, 400);
const cellMargin = 10;
const cellSize = (boardSize - 4 * cellMargin) / 3;

export default {
  boardContainer: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  board: {
    flexDirection: 'column',
    backgroundColor: colors.board.background,
    padding: cellMargin,
    borderRadius: 12,
    width: boardSize,
    height: boardSize,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  cell: {
    backgroundColor: colors.board.cell,
    width: cellSize,
    height: cellSize,
    borderRadius: 10,
    marginRight: 0,
    marginBottom: cellMargin,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  cellContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  cellText: {
    fontSize: Math.min(boardSize * 0.12, 52),
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  status: {
    marginTop: 20,
    padding: 10,
    minHeight: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  wonStatus: {
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(39, 174, 96, 0.2)',
  },
  lostStatus: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.2)',
  },
  drawStatus: {
    backgroundColor: 'rgba(243, 156, 18, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(243, 156, 18, 0.2)',
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  wonStatusText: {
    color: colors.success,
    fontSize: 24,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 1,
  },
  lostStatusText: {
    color: colors.error,
    fontSize: 24,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 1,
  },
  drawStatusText: {
    color: colors.warning,
    fontSize: 24,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 1,
  },
  normalStatusText: {
    color: colors.text.primary,
  },
};
