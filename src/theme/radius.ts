const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
} as const;

export type RadiusKey = keyof typeof radius;
export default radius;
