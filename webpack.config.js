const { join } = require('path');
const { DefinePlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const constants = require('./constants');

module.exports = (env) => {
  const isProd = !env.development;

  return {
    mode: isProd ? 'production' : 'development',

    devtool: isProd ? undefined : 'inline-source-map',

    entry: {
      background: ['src/background.ts'],
      rhsplus: ['src/index.ts'],
      options: ['src/options.ts'],
    },

    output: {
      path: join(__dirname, 'app'),
    },

    watch: !isProd,

    module: {
      rules: [
        {
          test: /\.(png|jpg|gif|jpeg|svg|woff|woff2|ttf|eot|ico)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name]-[hash].[ext]',
              outputPath: 'assets',
              publicPath: './assets',
            },
          },
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json',
            },
          },
        },
      ],
    },

    plugins: [
      new DefinePlugin({
        ...(() => {
          const c = { ...constants };
          Object.keys(c).forEach((k) => {
            c[k] = JSON.stringify(c[k]);
          });
          return c;
        })(),
        NODE_ENV: JSON.stringify(isProd ? 'production' : 'development'),
      }),
      new CopyPlugin({
        patterns: [
          { from: 'icons/*', to: '' },
          { from: 'manifest.json', to: '' },
          { from: 'src/options.html', to: '' },
          {
            from: 'src/assets/**/*',
            to: 'assets/[name][ext]',
            globOptions: {
              ignore: ['**/*.md'],
            },
          },
        ],
      }),
    ].concat(isProd ? [new CleanWebpackPlugin()] : []),

    target: 'node',
    node: {
      __dirname: false,
      __filename: false,
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
      plugins: [new TsconfigPathsPlugin({ configFile: 'tsconfig.json' })],
    },

    optimization: {
      minimize: isProd,
      moduleIds: isProd ? 'named' : undefined,
    },

    stats: {
      children: false,
    },
  };
};
