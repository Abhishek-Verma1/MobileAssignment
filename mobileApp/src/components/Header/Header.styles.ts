import {Platform} from 'react-native';
import {colors} from '../../theme';

export default {
  header: {
    backgroundColor: colors.primary,
    padding: Platform.OS === 'ios' ? 16 : 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
    width: '100%',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.4,
  },
  backButton: {
    marginRight: 8,
  },
  backText: {
    color: colors.text.inverse,
    fontSize: 14,
  },
  logo: {
    color: colors.text.inverse,
    fontSize: 18,
    fontWeight: 'bold',
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.6,
    justifyContent: 'flex-end',
  },
  navItem: {
    marginHorizontal: 6,
    paddingHorizontal: 5,
  },
  navText: {
    color: colors.text.inverse,
    fontWeight: '500',
    fontSize: 13,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
  userName: {
    color: colors.text.inverse,
    marginRight: 6,
    fontSize: 13,
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.text.inverse,
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  logoutText: {
    color: colors.text.inverse,
    fontSize: 11,
  },
};
