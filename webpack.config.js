/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const dotenvFlow = require('dotenv-flow');
dotenvFlow.config({
  silent: true,
});

module.exports = () => {
  return new Promise((resolve, reject) => {
    resolve();
  }).then(() => {
    return {
      stats: 'minimal',
      target: 'node',
      externals: [nodeExternals()],
      mode: process.env.NODE_ENV,
      entry: ['./src/main.ts'],
      devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
      output: {
        hashFunction: 'xxhash64',
        hashDigest: 'base64url',
        path:
          process.env.NODE_ENV === 'production'
            ? path.resolve(__dirname, 'build')
            : path.resolve(__dirname, 'dist'),
        filename: 'main.js',
        chunkFilename:
          process.env.NODE_ENV === 'production'
            ? '[contenthash].js'
            : 'js/[name][id].js',
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
          '&': path.resolve(__dirname, 'resources'),
        },
        extensions: [
          '.tsx',
          '.ts',
          '.mjs',
          '.js',
          '.jsx',
          '.json',
          '.wasm',
          '.node',
        ],
      },

      module: {
        rules: [
          {
            test: /.node$/,
            loader: 'node-loader',
            options: {
              name: '[name].[ext]',
            },
          },
          {
            test: /sqlite3-binding\.js$/,
            loader: 'sqlite3-embedded-loader',
          },
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: process.env.NODE_ENV !== 'production',
                  cacheCompression: process.env.NODE_ENV === 'production',
                  compact: process.env.NODE_ENV === 'production',
                },
              },
            ],
          },
        ],
      },
      plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({}),
        new webpack.ProvidePlugin({}),
        process.env.UseNodemon && new NodemonPlugin(),
        new webpack.IgnorePlugin({
          //!be aware after upgrade node_dependencies
          checkResource(resource, context) {
            let fooArr = [
              (resource) => {
                let ignoreIncludes = [];
                return ignoreIncludes.some((ignoreItem) => {
                  return ignoreItem.includes(resource);
                });
              },
              (resource) => {
                let ignoreEqual = [];
                return ignoreEqual.some((ignoreItem) => {
                  return ignoreItem == resource;
                });
              },
            ];
            return fooArr.some((fooItem) => {
              return fooItem(resource, context);
            });
          },
        }),
      ].filter(Boolean),
      optimization: {
        chunkIds: 'total-size',
        concatenateModules: process.env.NODE_ENV === 'production',
        emitOnErrors: false,
        flagIncludedChunks: process.env.NODE_ENV === 'production',
        innerGraph: process.env.NODE_ENV === 'production',
        mangleExports: process.env.NODE_ENV === 'production' ? 'size' : false,
        mangleWasmImports: process.env.NODE_ENV === 'production',
        mergeDuplicateChunks: process.env.NODE_ENV === 'production',
        minimize: process.env.NODE_ENV === 'production',

        minimizer: [
          new TerserPlugin({
            test: /\.js(\?.*)?$/i,
            include: undefined,
            exclude: undefined,
            parallel: true,
            minify: TerserPlugin.terserMinify,
            terserOptions: {
              compress: {
                arguments: true,
                arrows: true,
                booleans_as_integers: false, //! unsafe for discord //! unsafe for nest
                booleans: true,
                collapse_vars: true,
                comparisons: true,
                computed_props: true,
                conditionals: true,
                dead_code: true,
                defaults: true,
                directives: true,
                drop_console: false, //?
                drop_debugger: true,
                ecma: 2020,
                evaluate: true,
                expression: true,
                global_defs: {},
                hoist_funs: true,
                hoist_props: true,
                hoist_vars: true,
                ie8: false,
                if_return: true,
                inline: true,
                join_vars: true,
                keep_classnames: false, //! unsafe for discord
                keep_fargs: false,
                keep_fnames: false,
                keep_infinity: false,
                loops: true,
                module: true,
                negate_iife: true,
                passes: 1000,
                properties: true,
                pure_funcs: [],
                pure_getters: 'strict',
                reduce_vars: true,
                reduce_funcs: true,
                sequences: true,
                side_effects: true,
                switches: true,
                toplevel: true,
                top_retain: null,
                typeofs: true,
                unsafe_arrows: false, //!unsafe for nest
                unsafe: true, //! unsafe for discord
                unsafe_comps: true,
                unsafe_Function: true,
                unsafe_math: true,
                unsafe_symbols: true,
                unsafe_methods: true,
                unsafe_proto: true,
                unsafe_regexp: true,
                unsafe_undefined: true,
                unused: true,
              },
              ecma: 2020,
              enclose: false,
              ie8: false,
              keep_classnames: false, //!unsafe for discord
              keep_fnames: false,
              mangle: {
                eval: true,
                keep_classnames: false, //!unsafe for discord
                keep_fnames: false,
                module: true,
                safari10: false,
                toplevel: true,
              },
              module: true,
              nameCache: undefined,
              format: {
                ascii_only: false,
                beautify: false,
                braces: false,
                comments: false,
                ecma: 2020,
                ie8: false,
                keep_numbers: false,
                indent_level: 0,
                indent_start: 0,
                inline_script: true,
                keep_quoted_props: false,
                max_line_len: false,
                preamble: undefined,
                preserve_annotations: false,
                quote_keys: false,
                quote_style: 0,
                safari10: false,
                semicolons: true,
                shebang: true,
                webkit: false,
                wrap_iife: false,
                wrap_func_args: true,
              },
              parse: {
                bare_returns: true,
                html5_comments: false,
                shebang: true,
              },
              safari10: false,
              sourceMap: false,
              toplevel: true,
            },
            extractComments: false,
          }),
        ],
        moduleIds: process.env.NODE_ENV === 'production' ? 'size' : 'named',
        portableRecords: true,
        providedExports: process.env.NODE_ENV === 'production',
        realContentHash: process.env.NODE_ENV === 'production',
        removeAvailableModules: process.env.NODE_ENV === 'production',
        removeEmptyChunks: process.env.NODE_ENV === 'production',
        runtimeChunk: false,
        sideEffects: process.env.NODE_ENV === 'production',
        splitChunks: false,
        usedExports: process.env.NODE_ENV === 'production',
      },
    };
  });
};
