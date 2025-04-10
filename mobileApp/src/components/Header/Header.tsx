import {CommonActions, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAuth from '../../hooks/useAuth';
import {colors} from '../../theme';
import headerStyles from './Header.styles';

interface HeaderProps {
  title?: string;
}

const Header = ({title}: HeaderProps) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {isAuthenticated, logout} = useAuth();

  const handleLogout = () => {
    logout();

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
  };

  const navigateTo = (routeName: string) => {
    navigation.navigate(routeName);
  };

  const handleLogoPress = () => {
    if (isAuthenticated) {
      navigation.navigate('Game');
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={handleLogoPress}>
          <Text style={styles.logo}>{title || 'Tic-Tac-Toe'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navContainer}>
        {isAuthenticated ? (
          <>
            <TouchableOpacity style={styles.userInfo} onPress={handleLogout}>
              <Ionicons
                name="person-circle"
                size={24}
                color={colors.text.inverse}
              />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigateTo('Login')}>
              <Text style={styles.navText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigateTo('Register')}>
              <Text style={styles.navText}>Register</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create(headerStyles);

export default Header;
