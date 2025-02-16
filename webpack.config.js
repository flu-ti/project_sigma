const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isGitHubPages = process.env.DEPLOY_TARGET === "gh-pages";
const isProduction = process.env.NODE_ENV === "production";
const publicPath = isGitHubPages ? "/project_sigma/" : "/";

console.log("Active publicPath:", publicPath);

module.exports = {
  mode: isProduction ? "production" : "development", // Explicitly set mode
  devtool: 'source-map',
  entry: {
    sigmaCSV: './src/js/sigmaCSV.js', // Your main JS file
    sigmaTest: './src/js/sigmaTest.js',
    home: './src/js/home.js',
    themenbloecke: './src/js/themenbloecke.js',
    lecture: './src/js/lecture.js',
    clinical_reasoning: './src/js/clinical_reasoning.js'
  },
  
  output: {
    filename: 'js/[name].js', // The output bundled file
    path: path.resolve(__dirname, 'dist'), // Output folder (dist)
    publicPath: isGitHubPages ? "/project_sigma/" : "/",
  },

  devServer: {
    static: path.resolve(__dirname, 'dist'), // Folder where the HTML file is served from
    compress: true,
    port: 9000, // Port for the dev server
    open: true, // Open the browser automatically
    client: {
      overlay: {
        warnings: false, // This hides warnings from the overlay
        errors: true,    // This still shows critical errors
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/, // For JavaScript files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Transpile JS files using Babel
        },
      },

      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
    ],
  },
  plugins: [

    new MiniCssExtractPlugin({
      filename: 'css/[name].css', // Output the CSS file
    }),

    new HtmlWebpackPlugin({
      template: './src/pages/sigmaCSV.html', // Use the HTML template from src
      filename: 'pages/sigmaCSV.html', // Output the final HTML to the dist folder
      chunks: ['sigmaCSV']
    }),

    new HtmlWebpackPlugin({
      template: './src/pages/sigmaTest.html', // Use the HTML template from src
      filename: 'pages/sigmaTest.html', // Output the final HTML to the dist folder
      chunks: ['sigmaTest']
    }),

    new HtmlWebpackPlugin({
      template: './src/index.html', // Use the HTML template from src
      filename: 'index.html', // Output the final HTML to the dist folder
      chunks: ['home']
    }),

    new HtmlWebpackPlugin({
      template: './src/pages/Themenbloecke/index.html', // Use the HTML template from src
      filename: 'pages/Themenbloecke/index.html', // Output the final HTML to the dist folder
      chunks: ['themenbloecke']
    }),

    new HtmlWebpackPlugin({
      template: './src/pages/Themenbloecke/lecture.html', // Use the HTML template from src
      filename: 'pages/Themenbloecke/lecture.html', // Output the final HTML to the dist folder
      chunks: ['lecture']
    }),

    new HtmlWebpackPlugin({
      template: './src/pages/clinical_reasoning/index.html', // Use the HTML template from src
      filename: 'pages/clinical_reasoning/index.html', // Output the final HTML to the dist folder
      chunks: ['clinical_reasoning']
    }),

    new CopyWebpackPlugin({
        patterns: [
          { from: "src/assets", to: "assets" }, // Copy all files in src/assets to dist/assets
        ],
      }),

    new CopyWebpackPlugin({
          patterns: [
            {
              from: path.resolve(__dirname, 'src/media'),
              to: path.resolve(__dirname, 'dist/media')
            }
          ]
        })

  ],
};