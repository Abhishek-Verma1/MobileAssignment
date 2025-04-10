import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import homeStyles from './Home.styles';

const Home = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Tic-Tac-Toe Game</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Login"
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
          />
          <Button
            title="Register"
            onPress={() => navigation.navigate('Register')}
            secondary
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ...homeStyles
});

export default Home; 