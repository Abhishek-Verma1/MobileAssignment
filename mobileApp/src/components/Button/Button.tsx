//TODO: Lots of optimization required

import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle
} from 'react-native';
import buttonStyles from './Button.styles';

interface ButtonProps {
  onPress: () => void;
  title: string;
  secondary?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Button = ({
  onPress,
  title,
  secondary = false,
  loading = false,
  disabled = false,
  style,
  textStyle
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        secondary ? styles.secondaryButton : styles.primaryButton,
        disabled && styles.disabledButton,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? '#3498db' : 'white'} />
      ) : (
        <Text
          style={[
            styles.text,
            secondary ? styles.secondaryText : styles.primaryText,
            disabled && styles.disabledText,
            textStyle
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create(buttonStyles);

export default Button; 