import path from 'path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack, { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import dotenv from 'dotenv-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const isDevelopment = process.env.NODE_ENV !== 'production';

const config: Configuration = {
  name: 'web-server',
  mode: isDevelopment ? 'development' : 'production',
  devtool:isDevelopment ? 'source-map' : 'hidden-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@hooks': path.resolve(__dirname, 'src', 'hooks'),
      '@components': path.resolve(__dirname, 'src', 'components'),
      '@mobileComponents': path.resolve(__dirname, 'src', 'mobileComponents'),
      '@layouts': path.resolve(__dirname, 'src', 'layouts'),
      '@pages': path.resolve(__dirname, 'src', 'pages'),
      '@mobilePages': path.resolve(__dirname, 'src', 'mobilePage'),
      '@utils': path.resolve(__dirname, 'src', 'utils'),
      '@typings': path.resolve(__dirname, 'src', 'typings'),
      '@assets': path.resolve(__dirname, 'src', 'assets'),
      '@store': path.resolve(__dirname, 'src', 'store'),
      '@style': path.resolve(__dirname, 'src', 'style'),
      '@lang': path.resolve(__dirname, 'src', 'lang'),
    },
  },
  entry: {
    app: path.join(__dirname, 'client.tsx'),
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: { browsers: ['IE 10'] },
                debug: isDevelopment,
              },
            ],
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
          plugins: [
            [
              '@babel/plugin-transform-runtime'
            ],
          ],
          env: {
            development: {
              plugins: [require.resolve('react-refresh/babel')],
            },
          },
        },
        exclude: path.join(__dirname, 'node_modules'),
      },
      {
        test: /\.css?$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[contenthash].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      favicon: "./src/assets/favicon.ico",
    }),
    new dotenv(),
    new ForkTsCheckerWebpackPlugin({
      async: false,
      // eslint: {
      //   files: "./src/**/*",
      // },
    }),
    new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? 'development' : 'production' }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    // publicPath: './',
  },
  devServer: {
    historyApiFallback: true, //url처럼 쓸 수 있게 가짜url을 쓸 수 있게함
    port: 4090,
    devMiddleware: { publicPath: '/dist/' },
    static: { directory: path.resolve(__dirname) },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        // target: process.env.target,
        changeOrigin: true,
      },
    },
  },
};

if (isDevelopment && config.plugins) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(
    new ReactRefreshWebpackPlugin({
      overlay: {
        useURLPolyfill: true,
      },
    }),
  );
}
if (!isDevelopment && config.plugins) {
}

export default config;
