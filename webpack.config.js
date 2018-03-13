const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const BUILD_DIR = path.resolve(__dirname, 'build');
const APP_DIR = path.resolve(__dirname);

const parts = require('./webpack.parts');

/** 
  * Common Config
  *
  * Description: 
  * - Output
  * - JavaScript loader
  */
const commonConfig = merge([
  {
    output: {
      path: BUILD_DIR,
      publicPath: '/'
    }
  },
  parts.loadJavaScript({ include: APP_DIR })
]);

/** 
  * Production Config
  *
  * Description: 
  * - Performance
  * - Build records
  * - Clean build folder before re-build
  * - StyleSheet loader
  * - File loader
  * - Minify JavaScripts and StyleSheets
  * - Generation source map
  * - Optimization chunks
  */
const productionConfig = merge([
  // Performance
  {
    performance: {
      hints: 'warning', // 'error' or false are valid too
      maxEntrypointSize: 150000, // in bytes, default 250k
      maxAssetSize: 450000 // in bytes
    }
  },

  // Build records
  {
    recordsPath: path.join(__dirname, "records.json"),
    output: {
      chunkFilename: "[name].[chunkhash:8].js",
      filename: "[name].[chunkhash:8].js"
    },
    plugins: [new webpack.NamedModulesPlugin()]
  },

  // Clean build folder before re-build
  parts.clean(BUILD_DIR),

  // Loading and Extract StyleSheets
  parts.extractCSS({
    use: [{
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        sourceMap: true
      }
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true
      }
    }]
  }),

  // Loading Files
  parts.loadImages({
    options: {
      limit: 15000,
      name: '[name].[hash:8].[ext]'
    }
  }),

  // Minify JavaScripts and StyleSheets
  parts.minifyJavaScript(),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true
      },
      // Run cssnano in safe mode to avoid
      // potentially unsafe transformations.
      safe: true
    }
  }),

  // Generation source map
  parts.generateSourceMaps({ type: 'source-map' }),

  // Optimization Chunks
  {
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all'
          }
        }
      },
      runtimeChunk: {
        name: 'manifest'
      }
    }
  }
]);

/** 
  * Devalopment Config
  *
  * Description: 
  * - Create development server
  * - StyleSheet loader
  * - File loader
  */
const developmentConfig = merge([
  // Development server
  parts.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT
  }),

  // Loading StyleSheets
  parts.loadCSS(),

  // Loading Files
  parts.loadImages(),
]);

/** 
  * Exports Config Function
  *
  * @param: env  (environment of config)
  * @param: argv (array option on CLI)
  *
  * Description: 
  * - Determine pages
  * - Determine config mode
  * - Return config to exports
  */
module.exports = (env, argv) => {
  const pages = [
    parts.page({
      title: 'Webpack demo',
      entry: {
        app: path.join(APP_DIR, "index.js")
      },
      chunks: ['app', 'manifest', 'vendor']
    })
  ];
  const config = argv.mode === 'production' ? productionConfig : developmentConfig;

  return merge([commonConfig, config, { mode: argv.mode }].concat(pages));
};
