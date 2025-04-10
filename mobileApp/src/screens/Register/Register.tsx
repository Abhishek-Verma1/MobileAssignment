//TODO: Code cleaning and optimization required

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
import registerStyles from './Register.styles';

//TODO validation will move to a common file
let Schema = yup.object({
  password: yup.string().required().min(6).label('Password'),
  email: yup.string().required().email().label('Email'),
  name: yup.string().required().label('Name'),
});

const Register = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {register, loading} = useAuth();

  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(Schema),
  });

  const handleRegister = async (data: {
    name: any;
    email: any;
    password: any;
  }) => {
    await register(data?.name, data?.email, data?.password);
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>

            <View style={styles.form}>
              <Input
                label="Name"
                name="name"
                placeholder="Enter your name"
                dataType="alpha"
                errors={errors}
                control={control}
              />

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
                title="Register"
                onPress={handleSubmit(handleRegister)}
                loading={loading}
                style={styles.button}
              />
            </View>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Existing user? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(registerStyles as any);

export default Register;
