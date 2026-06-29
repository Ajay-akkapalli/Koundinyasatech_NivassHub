module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@features': './src/features',
            '@store': './src/store',
            '@hooks': './src/hooks',
            '@theme': './src/theme',
            '@utils': './src/utils',
            '@constants': './src/constants',
            '@config': './src/config',
            '@services': './src/services',
          },
        },
      ],
      'react-native-reanimated/plugin', // MUST be last
    ],
  };
};
