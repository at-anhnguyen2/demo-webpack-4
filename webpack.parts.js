const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');

/** 
  * Multiple page
  *
  * @param: path    (the path include index.html, defaul = string empty)
  * @param: title   (the title of page, allowed NULL)
  * @param: entry   (the entries of page, not NULL)
  * @param: chunks  (this chunks of page, allowed NULL)
  *
  * Member of Webpack parts
  * - Use: Development and Production
  */
exports.page = ({ path = '', title, entry, chunks,} = {}) => ({
  entry,
  plugins: [
    new HtmlWebpackPlugin({
      chunks,
      filename: `${path && path + '/'}index.html`,
      title
    })
  ]
});

/** 
  * Development Server
  *
  * @param: host  (the host of development server, allowed NULL)
  * @param: port  (the port of development server, allowed NULL)
  *
  * Member of Webpack parts
  * - Use: Development
  */
exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    stats: 'errors-only',
    host, // Default: localhost
    port, // Default: 8080
    open: true,
    progress: true,
    inline: true,
    overlay: {
      errors: true,
      warnings: true
    }
  }
});


/** 
  * Development debug tool
  *
  * @param: type  (the type of development debug tool, allowed NULL)
  *
  * Member of Webpack parts
  * - Use: Development and Production
  */
exports.generateSourceMaps = ({ type }) => ({
  devtool: type // Default: 'eval' for development
});

/** 
  * Loading JavaScripts
  *
  * @param: include (the folders are loaded, allowed NULL)
  * @param: exclude (the folders are not loaded, allowed NULL)
  *
  * Member of Webpack parts
  * - Use: Development and Production
  */
exports.loadJavaScript = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include,
        exclude,
        use: 'babel-loader'
      }
    ]
  }
});

/** 
  * Extract and Loading StyleSheet
  *
  * @param: include (the folders are loaded, allowed NULL)
  * @param: exclude (the folders are not loaded, allowed NULL)
  * @param: use     (the loaders are used, allowed NULL)
  *
  * Member of Webpack parts
  * - Description: Output extracted CSS to a file
  * - Use: Production
  */
exports.extractCSS = ({ include, exclude, use }) => {
  const plugin = new ExtractTextPlugin({
    // allChunks is needed to extract from extracted chunks as well.
    allChunks: true,
    filename: '[name].[contenthash:8].css'
  });

  return {
    module: {
      rules: [
        {
          test: /\.s?css$/,
          include,
          exclude,

          use: plugin.extract({
            use,
            fallback: 'style-loader',
          })
        }
      ]
    },
    plugins: [plugin]
  };
};

/** 
  * Loading StyleSheet
  *
  * @param: include (the folders are loaded, allowed NULL)
  * @param: exclude (the folders are not loaded, allowed NULL)
  *
  * Member of Webpack parts
  * - Use: Development
  */
exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.s?css$/,
        include,
        exclude,
        use: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap']
      }
    ]
  }
});

/** 
  * Loading Another file
  *
  * @param: include (the folders are loaded, allowed NULL)
  * @param: exclude (the folders are not loaded, allowed NULL)
  * @param: options (the options are queried when loading, allowed NULL)
  *
  * Member of Webpack parts
  * - Use: Development and Production
  */
exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg)$/,
        include,
        exclude,
        use: {
          loader: 'url-loader',
          options
        }
      }
    ]
  }
});

/** 
  * Minify JavaScript
  *
  * Member of Webpack parts
  * - Use: Production
  */
exports.minifyJavaScript = () => ({
  optimization: {
    minimizer: [new UglifyWebpackPlugin()]
  }
});

/** 
  * Minify StyleSheet
  *
  * @param: options (the options are queried when minifying, allowed NULL)
  *
  * Member of Webpack parts
  * Use: Production
  */
exports.minifyCSS = ({ options }) => ({
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false
    })
  ]
});

/** 
  * Clean Build Folder
  *
  * @param: path (the path of build folder, not allowed NULL)
  *
  * Member of Webpack parts
  * Use: Production
  */
exports.clean = path => ({
  plugins: [new CleanWebpackPlugin([path])]
});
