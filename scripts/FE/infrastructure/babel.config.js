module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['src'],
        alias: {
          entities: './dist_client/entities',
          app: './dist_client/app',
          common: './dist_client/common'
        }
      }
    ],
    '@babel/plugin-proposal-class-properties',
    'react-loadable/babel',
    'dynamic-import-node'
  ]
};
