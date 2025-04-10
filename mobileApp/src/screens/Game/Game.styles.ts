import {colors} from '../../theme';

export default {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    alignItems: 'center' as const,
  },
  scrollContent: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginVertical: 10,
    textAlign: 'center',
  },
  startContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center' as const,
  },
  startTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginVertical: 10,
    textAlign: 'center',
  },
  startDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  radioContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  playerSelection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 25,
  },
  playerButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  selectedPlayerButton: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  selectedPlayerText: {
    color: colors.text.inverse,
  },
  actionButton: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    width: '100%',
    maxWidth: 300,
  },
  resetButton: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 10,
  },
  debugButton: {
    marginTop: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  controls: {
    width: '100%',
    alignItems: 'center' as const,
    marginVertical: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center' as const,
    zIndex: 100,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.text.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.backdrop,
    justifyContent: 'center',
    alignItems: 'center' as const,
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center' as const,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  winText: {
    color: colors.success,
  },
  lossText: {
    color: colors.error,
  },
  drawText: {
    color: colors.warning,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: colors.text.primary,
  },
  modalButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalButton: {
    minWidth: 120,
    margin: 5,
  },
};
