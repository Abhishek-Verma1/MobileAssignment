const colors = {
  
  //TODO: Code cleaning and optimization required
  
  primary: '#2c3e50', 
  primaryDark: '#1a252f',
  primaryLight: '#34495e',

  secondary: '#3498db', 
  secondaryDark: '#2980b9',
  secondaryLight: '#5dade2',

  background: '#f5f6fa', 
  surface: '#ffffff',

  text: {
    primary: '#2c3e50',
    secondary: '#7f8c8d', 
    disabled: '#bdc3c7', 
    inverse: '#ffffff', 
  },

  success: '#27ae60', 
  warning: '#f39c12',
  error: '#e74c3c',
  info: '#3498db', 


  border: '#dfe4ea',
  divider: '#ecf0f1',
  backdrop: 'rgba(0, 0, 0, 0.5)',


  player: '#2c3e50', 
  computer: '#e74c3c',
  draw: '#f39c12', 


  board: {
    background: '#2c3e50', 
    cell: '#ffffff', 
  },
};

const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    loose: 1.8,
  },
};

const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 16,
  circle: 9999,
};

const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
};

const transitions = {
  duration: {
    short: 150,
    normal: 250,
    long: 350,
  },
};

const zIndex = {
  background: -1,
  default: 1,
  dropdown: 10,
  modal: 100,
  toast: 1000,
};

const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
};

export type ThemeColors = typeof colors;
export type ThemeTypography = typeof typography;
export type ThemeSpacing = typeof spacing;
export type ThemeBorderRadius = typeof borderRadius;
export type ThemeShadows = typeof shadows;
export type Theme = typeof theme;

export {
  borderRadius,
  colors,
  shadows,
  spacing,
  transitions,
  typography,
  zIndex,
};

export default theme;
