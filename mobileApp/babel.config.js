module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@api': './src/api',
          '@redux': './src/redux',
          '@navigation': './src/navigation',
          '@theme': './src/theme',
        },
      },
    ],
  ],

  // For development, we want to generate more readable code
  env: {
    development: {
      compact: false,
    },
  },
};
