module.exports = {
  presets: ['@babel/preset-typescript'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
  ],
};