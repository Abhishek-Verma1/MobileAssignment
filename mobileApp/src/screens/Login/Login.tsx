import NetworkMessage from '@components/NetworkMessage';
import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {useForm} from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as yup from 'yup';
import Button from '../../components/Button';
import Input from '../../components/Input';
import useAuth from '../../hooks/useAuth';
import loginStyles from './Login.styles';

//TODO validation will move to a common file
let Schema = yup.object({
  password: yup.string().required().min(6).label('Password'),
  email: yup.string().required().email().label('Email'),
});

const Login = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {login, loading} = useAuth();

  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(Schema),
  });

  const handleLogin = async (data: {email: any; password: any}) => {
    await login(data?.email, data?.password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to continue</Text>

            <View style={styles.form}>
              <Input
                label="Email"
                name="email"
                placeholder="Enter your email"
                autoCapitalize="none"
                errors={errors}
                control={control}
              />

              <Input
                label="Password"
                name="password"
                placeholder="Enter your password"
                secureTextEntry
                errors={errors}
                control={control}
              />

              <Button
                title="Login"
                onPress={handleSubmit(handleLogin)}
                loading={loading}
                style={styles.button}
              />
            </View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>New user? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(loginStyles as any);

export default Login;
