import { Platform } from 'react-native';

const shadowBase = (elevation: number) =>
  Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: elevation },
      shadowOpacity: 0.1,
      shadowRadius: elevation * 1.5,
    },
    android: { elevation },
    default: {},
  });

const shadows = {
  sm: shadowBase(2),
  md: shadowBase(4),
  lg: shadowBase(8),
} as const;

export default shadows;
