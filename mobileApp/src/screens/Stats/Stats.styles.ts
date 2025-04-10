import {colors} from '../../theme';

export default {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginVertical: 15,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.text.secondary,
  },
  noStatsContainer: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  noStatsText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  statsContainer: {
    marginVertical: 20,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  winCard: {
    flex: 1,
    marginRight: 5,
    borderTopWidth: 3,
    borderTopColor: colors.success,
  },
  lossCard: {
    flex: 1,
    marginHorizontal: 5,
    borderTopWidth: 3,
    borderTopColor: colors.error,
  },
  drawCard: {
    flex: 1,
    marginLeft: 5,
    borderTopWidth: 3,
    borderTopColor: colors.warning,
  },
  winRateCard: {
    borderTopWidth: 3,
    borderTopColor: colors.primary,
  },
};
