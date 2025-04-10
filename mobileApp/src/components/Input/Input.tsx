import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import inputStyles from './Input.styles';
import {Controller} from 'react-hook-form';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  name?: string;
  control?: any;
  errors?: any;
  dataType?: 'alpha' | 'numeric' | 'alpha-numeric';
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  errorStyle?: StyleProp<TextStyle>;
}


//TODO: Lots of code cleaning and optimziation required
const Input = ({
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  control = null,
  errors,
  dataType = 'alpha-numeric',
  name = '',
  ...rest
}: InputProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <Controller
        control={control}
        name={name}
        render={({field: {onChange, value}}) => (
          <TextInput
            style={[styles.input, error && styles.inputError, inputStyle]}
            placeholderTextColor="#999"
            value={value ? value.toString() : value}
            {...rest}
            onChangeText={text => {
              //TODO: later move to regex file
              if (dataType === 'numeric') {
                onChange(text.replace(/[^\d]/g, '')); 
              } else if (dataType === 'alpha') {
                onChange(text.replace(/[^a-zA-Z]/g, ''));
              } else {
                onChange(text);
              }
            }}
          />
        )}
      />
      {errors[name] && (
        <Text style={[styles.error, errorStyle]}>{errors[name].message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create(inputStyles);

export default Input;
