const path = require("path");
const nodeExternals = require("webpack-node-externals");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");
const dotenv = require("dotenv");
dotenv.config();

/*********************************************
 * EXPORT WEBPACK OPTIONS
 *********************************************/
//EXPORTING OPTIONS AS A FUNCTION https://webpack.js.org/api/cli/#environment-options
module.exports = getWebpackOptions;

function getWebpackOptions(env, args) {
  // console.log("ARGV: ", _args);
  return {
    entry: getEntryOptions(env, args),
    externals: getExternals(env),
    devServer: getDevServerOptions(env),
    devtool: getDevtoolOptions(),
    mode: getModeOptions(env, args),
    module: getModuleOptions(),
    output: getOutputOptions(env, args),
    plugins: getPluginsOptions(env),
    resolve: getResolveOptions(),
    target: getTargetOptions(env),
  };
}

function getEntryOptions(env, args) {
  //INFO - https://webpack.js.org/configuration/entry-context/#entry
  const entryOptions = {
    index: "./build/src/index.js",
  };

  // if (process.env.webpack === "backend" || env.entry === "build")
  //   entryOptions.index = "./build/src/index.js";
  // if (args.mode) entryOptions.index = "./src/index.js";
  if (env.WEBPACK_SERVE) entryOptions.index = "./src/index.js";

  return entryOptions;
}
function getExternals(env) {
  const externals = [];
  // if (process.env.webpack === "backend") externals.push(nodeExternals());
  if (env.nodeExternals) externals.push(nodeExternals());
  return externals;
}
function getDevServerOptions(env) {
  //INFO - https://www.robinwieruch.de/webpack-react-router/
  //INFO - https://webpack.js.org/configuration/dev-server/#devserverhistoryapifallback

  const devServerOptions = {
    static: {
      directory: path.join(__dirname, "./public"),
    },
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
      reconnect: 5,
    },
    historyApiFallback:
      //true,
      //SERVER LOADS index.js FROM "/" INSTEAD OF CURRENT LOCATION
      //INFO - https://ui.dev/react-router-cannot-get-url-refresh
      {
        rewrites: [
          { from: /index.js/, to: "/index.js" },
          { from: /index.css/, to: "/index.css" },
          { from: /\.ico$/, to: "/" },
          //{ from: /\.css$/, to: "/css/" },
        ],
      },
    compress: true,
    port: 8080,
  };
  if (process.env.webpack === "backend") devServerOptions.port = 8000;
  return devServerOptions;
}
function getDevtoolOptions() {
  //ORIGINAL LINES - https://webpack.js.org/configuration/devtool/#devtool

  // const devtoolOptions = "eval-source-map";
  // const devtoolOptions = "eval-cheap-module-source-map";
  // const devtoolOptions = "eval-nosources-source-map";
  const devtoolOptions = "inline-source-map";
  // const devtoolOptions = "source-map";
  // const devtoolOptions = "hidden-source-map";
  return devtoolOptions;
}
function getModeOptions(env, args) {
  //BUILT IN ENVIRONMENT VARIABLES https://webpack.js.org/api/cli/#env
  let modeOptions = "production";
  if (env.WEBPACK_SERVE) modeOptions = "development";
  if (process.env.NODE_ENV) modeOptions = process.env.NODE_ENV;
  if (args.mode) modeOptions = args.mode;
  return modeOptions;
}
function getModuleOptions() {
  //RULES ARE OPTIONS OF MODULES
  const rulesOptions = [];

  //GATHER ASSETS (PICTURES) IN HTML FILE
  //INFO - https://webpack.js.org/loaders/html-loader
  const htmlRegex = /\.html$/; //MATCH DIFFERENT PICTURE FORMATS WITH OR |
  const htmlLoaders = ["html-loader"];
  rulesOptions.push({
    test: htmlRegex,
    use: htmlLoaders,
  });

  //BUNDLE MEDIA AND RESOURCE FILES
  //INFO - https://webpack.js.org/guides/asset-modules
  const picturesRegex = /\.(jpg|svg|png|gif|ico|txt|mp4|ttf)$/; //MATCH DIFFERENT PICTURE FORMATS WITH OR |
  const typeOptions = "asset/resource";
  rulesOptions.push({
    test: picturesRegex,
    type: typeOptions,
  });

  //TRANSLATE JAVASCRIPT AND TYPESCRIPT WITH BABEL
  //INFO - https://webpack.js.org/loaders/babel-loader/
  //RETAIN LINE NUMBERS - https://babeljs.io/docs/en/options#retainlines
  let babelLoaderPresets = {
    loader: "babel-loader",
    // options: {
    //   presets: [
    //     "@babel/preset-react",
    //     "@babel/preset-env",
    //     "@babel/preset-typescript",
    //   ],
    //   retainLines: true,
    // },
  };
  let babelLoaderRules = {
    test: /\.(tsx|ts|jsx|js)?$/, //MATCH JAVASCRIPT OR TYPESCRIPT FILES
    // test: /\.js$/, //MATCH JAVASCRIPT OR TYPESCRIPT FILES
    exclude: /node-modules/, //MATCH NODE_MODULES
    use: babelLoaderPresets,
  };
  rulesOptions.push(babelLoaderRules);

  //DYNAMICALLY INJECT CSS FILE INTO HTML DOM HEAD
  const miniCssExtractPluginRules = {
    test: /\.(scss|css)?$/,
    use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
  };
  rulesOptions.push(miniCssExtractPluginRules);

  //MODULE OPTIONS
  const moduleOptions = { rules: rulesOptions };
  return moduleOptions;
}
function getPluginsOptions(env) {
  const pluginsOptions = [];

  if (process.env.webpack === "frontend") {
    //ONLY FOR FRONTEND
    //DYNAMICALLY INJECT JAVASCRIPT INTO HTML DOM HEAD
    //INFO - https://webpack.js.org/plugins/html-webpack-plugin
    const htmlWebpackPluginOptions = {
      template: "./src/index.html", //USE THIS FILE INSTEAD OF AN EMPTY HTML
      //filename: "index.html", //OVERRIDE DEFAULT FILENAME INDEX.HTML
    };
    pluginsOptions.push(new HtmlWebpackPlugin(htmlWebpackPluginOptions));
  }

  //DYNAMICALLY INJECT CSS FILE INTO HTML DOM HEAD
  //INFO - https://webpack.js.org/plugins/mini-css-extract-plugin
  const miniCssExtractPluginOptions = {
    //filename: "[name].css", //DEFAULT
    //filename: "[contenthash].css",
  };
  pluginsOptions.push(new MiniCssExtractPlugin(miniCssExtractPluginOptions));

  //DOTENV FOR WEBPACK
  const isDevelopmentMode =
    env.WEBPACK_SERVE || process.env.NODE_ENV === "development" ? true : false;
  const dotenvOptions = isDevelopmentMode
    ? { path: "./.env" }
    : { path: ".env - BUNDLING FOR PRODUCTION" };
  const dotenv = new Dotenv(dotenvOptions);
  pluginsOptions.push(dotenv);

  return pluginsOptions;
}
function getOutputOptions(env, _args) {
  //INFO - https://webpack.js.org/concepts/output
  //INFO - https://webpack.js.org/configuration/output/#outputfilename
  const outputOptions = {
    // filename: "[name]-[hash].js", //USE CACHE-BUSTER FILENAMES
    filename: "[name].js", //USE DEFAULT FILENAMES
    path: path.resolve(__dirname, "./public"), //PLACE WEBPACK FILES IN DIST DIRECTORY
    clean: true, //DELETE THE OLD BUILD FILES
  };

  if (env.cacheBuster) outputOptions.filename = "[name]-[hash].js"; //USE CACHE-BUSTER FILENAMES
  //OVERWRITE OUTPUT OPTIONS FOR BACKEND
  // if (process.env.webpack === "backend")
  //   outputOptions.path = path.resolve(__dirname, "./dist");

  return outputOptions;
}
function getResolveOptions() {
  //DUPLICATE REACT - https://blog.maximeheckel.com/posts/duplicate-dependencies-npm-link/
  //NPM LINK - https://reactjs.org/warnings/invalid-hook-call-warning.html#duplicate-react
  //WEBPACK RESOLVE - https://webpack.js.org/configuration/resolve/
  const resolveOptions = {
    //EXTENSIONS - https://webpack.js.org/configuration/resolve/#resolveextensions
    //PRIORITIZES IMPORT EXTENSIONS, STARTING WITH INDEX 0
    //EXAMPLE import Title from "components/Title" WILL CHECK FOR Title.tsx FIRST
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],

    //ALIAS - https://webpack.js.org/configuration/resolve/#resolvealias
    //ALLOWS IMPORT FROM THE ALIAS INSTEAD OF RELATIVE PATH
    //EXAMPLE import Title from "components/Title" instead of "../../components/Title"
    alias: {
      assets: path.resolve("./src/assets/"),
      bootstrap: path.resolve("./node_modules/bootstrap/"),
      components: path.resolve("./src/components/"),
      controllers: path.resolve("./src/controllers/"),
      customer: path.resolve("./src/microservices/customer/"),
      microservices: path.resolve("./src/microservices/"),
      modules: path.resolve("./src/modules/"),
      // data: path.resolve("./src/data/"),
      models: path.resolve("./src/models/"),
      modules: path.resolve("./src/modules/"),
      product: path.resolve("./src/microservices/product/"),
      project: path.resolve("./src/project/"),
      public: path.resolve("./public/"),
      views: path.resolve("./src/views/"),
      routes: path.resolve("./src/routes/"),
      root: path.resolve("./"),
      utils: path.resolve("./src/utils/"),
      scss: path.resolve("./src/scss/"),
      skills: path.resolve("./src/skills/"),
      src: path.resolve("./src/"),
    },
  };
  return resolveOptions;
}
function getTargetOptions(env) {
  let target = "web";
  // if (process.env.webpack === "backend") target = "node";
  if (env.nodeExternals) target = "node";
  return target;
}
