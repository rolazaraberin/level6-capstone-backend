const path = require("path");
const nodeExternals = require("webpack-node-externals");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { getPort } = require("./utils/getPort");
const { isExecutable } = require("./utils/isExecutable");
const webpack = require("webpack");
const dotenv = require("dotenv");
dotenv.config();

const OUTPUT_PATH = path.resolve(__dirname, "./public");

/*********************************************
 * EXPORT WEBPACK OPTIONS
 *********************************************/
//EXPORTING OPTIONS AS A FUNCTION https://webpack.js.org/api/cli/#environment-options
module.exports = getWebpackOptions;

const GLOBAL = { entryFile: "./build/src/index.js" };

function getWebpackOptions(env, args) {
  return {
    entry: getEntryOptions(env, args),
    externals: getExternals(env),
    externalsPresets: getExternalsPresets(env),
    devServer: getDevServerOptions(env),
    devtool: getDevtoolOptions(env),
    mode: getModeOptions(env, args),
    module: getModuleOptions(),
    output: getOutputOptions(env, args),
    plugins: getPluginsOptions(env, args),
    resolve: getResolveOptions(),
    target: getTargetOptions(env),
  };
}

function getEntryOptions(env, args) {
  //INFO - https://webpack.js.org/configuration/entry-context/#entry
  const entryOptions = {
    index: GLOBAL.entryFile,
  };

  // if (process.env.webpack === "backend" || env.entry === "build")
  //   entryOptions.index = "./build/src/index.js";
  // if (args.mode) entryOptions.index = "./src/index.js";
  if (args.entry) entryOptions.index = args.entry[0];
  if (env.WEBPACK_SERVE) entryOptions.index = "./src/index.js";
  console.log("ENTRY: ", entryOptions.index);
  GLOBAL.entryFile = entryOptions.index;
  return entryOptions;
}
function getExternals(env) {
  //DO NOT BUNDLE ANY NODE MODULES
  //GOOD FOR BACKEND SERVER
  //INFO - https://www.npmjs.com/package/webpack-node-externals

  const externals = [];
  // if (process.env.webpack === "backend") externals.push(nodeExternals());
  if (env.excludeModules || env.serverless) {
    console.log("BUNDLE MODULES: ", false);
    externals.push(nodeExternals());
  } else console.log("BUNDLE MODULES: ", true);
  // else if (env.excludeNode || env.serverless)
  //   externals.push(
  //     nodeExternals({
  //       allowlist: ["express", "serverless-http"],
  //     })
  //   );
  // else if (env.excludeNode || env.serverless)
  //   externals.push(
  //     nodeExternals({
  //       modulesFromFiles: {
  //         fileName: "package.json",
  //         includeInBundle: ["dependencies"],
  //         excludeFromBundle: ["devDependencies"],
  //       },
  //     })
  //   );
  // console.log("EXCLUDE NODE: ", env.excludeNode || env.serverless);
  return externals;
}
function getExternalsPresets(env) {
  //DO NOT BUNDLE NODE CORE MODULES, BUT BUNDLE OTHER MODULES
  //GOOD FOR LAMBDA FUNCTIONS
  //INFO - https://webpack.js.org/configuration/externals/#externalspresets

  const externalsPresets = {};
  if (env.excludeModules || env.excludeNode || env.serverless) {
    console.log("EXCLUDE NODE: ", true);
    externalsPresets.node = true;
  } else if (env.includeNode) {
    console.log("EXCLUDE NODE: ", false);
    externalsPresets.node = false;
  }
  return externalsPresets;
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
    port: getPort(8000),
    // port: 8080,
  };
  // if (process.env.webpack === "backend") devServerOptions.port = 8000;
  return devServerOptions;
}
function getDevtoolOptions(env) {
  //ORIGINAL LINES - https://webpack.js.org/configuration/devtool/#devtool

  let devtoolOptions = undefined;
  if (env.WEBPACK_SERVE) {
    console.log("SOURCEMAP: ", true);
    devtoolOptions = "source-map";
  }
  // if (env.WEBPACK_SERVE) devtoolOptions = "inline-source-map";
  // const devtoolOptions = "eval-source-map";
  // const devtoolOptions = "eval-cheap-module-source-map";
  // const devtoolOptions = "eval-nosources-source-map";
  // const devtoolOptions = "source-map";
  // const devtoolOptions = "hidden-source-map";
  return devtoolOptions;
}
function getModeOptions(env, args) {
  //BUILT IN ENVIRONMENT VARIABLES https://webpack.js.org/api/cli/#env
  let modeOptions = "production";
  if (env.WEBPACK_SERVE) modeOptions = "development";
  // if (process.env.NODE_ENV) modeOptions = process.env.NODE_ENV;
  if (args.mode) modeOptions = args.mode;
  console.log("MODE: ", modeOptions);
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

  //DYNAMICALLY INJECT STYLES INTO THE HTML DOM HEAD
  //INFO - https://webpack.js.org/plugins/mini-css-extract-plugin/
  //EXAMPLE: import "./MyComponent.scss"
  //EXAMPLE: import "./index.css"
  const injectStyles = {
    test: /\.(scss|css)?$/, //MATCH THESE EXTENSIONS
    exclude: /(\\styles\\|\\static\\|\\assets\\)/, //EXCLUDE THESE FOLDERS
    use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
  };
  rulesOptions.push(injectStyles);

  //SASS FILES IN SPECIFIC FOLDERS WILL BE CONVERTED TO CSS STRINGS
  //THEY WILL NOT BE INJECTED INTO THE HTML DOM HEAD
  //EXAMPLE: import style1 from "styles/darkMode.scss"
  //EXAMPLE: import style2 from "styles/lightMode.scss"
  const sassRules = {
    include: /(\\styles\\|\\static\\|\\assets\\)/, //CHECK THESE FOLDERS
    test: /\.scss$/, //MATCH THIS EXTENSION
    use: ["sass-loader"], //CONVERT TO CSS
    type: "asset/source", //IMPORTS WILL STORE CODE
  };
  rulesOptions.push(sassRules);

  //STATIC PAGES CAN BE REFERENCED AS A SOURCE
  //EXAMPLE: import "static/index.html"
  const staticPages = {
    include: /(\\static\\|\\assets\\)/, //CHECK THESE FOLDERS
    test: /\.html$/, //MATCH THIS EXTENSION
    // type: "asset/source", //IMPORTS WILL STORE CODE
    type: "asset/resource", //IMPORTS WILL STORE CODE
    generator: {
      filename: "[name][ext]", //PRESERVE ORIGINAL FILENAME
      // emit: true,
    },
  };
  rulesOptions.push(staticPages);

  //CSS FILES CAN BE REFERENCED AS HREF
  //EXAMPLE: import styles from "styles/css"
  //EXAMPLE: <Stylesheet href={styles} />
  const cssFiles = {
    include: /(\\styles\\|\\static\\|\\assets\\)/, //CHECK THESE FOLDERS
    test: /\.css$/, //MATCH THIS EXTENSION
    type: "asset/resource", //IMPORTS WILL STORE HREF
  };
  rulesOptions.push(cssFiles);

  //MODULE OPTIONS
  const moduleOptions = { rules: rulesOptions };
  return moduleOptions;
}
function getPluginsOptions(env, args) {
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
  console.log("ARGS: ", args);
  const isDevelopmentMode =
    env.WEBPACK_SERVE ||
    process.env.NODE_ENV ||
    env.development ||
    args.mode === "development"
      ? true
      : false;
  const dotenvOptions = isDevelopmentMode
    ? { path: "./.env" }
    : { path: ".env - BUNDLING FOR PRODUCTION" };
  const dotenv = new Dotenv(dotenvOptions);
  pluginsOptions.push(dotenv);

  //IGNORE MODULES
  //INFO - https://webpack.js.org/plugins/ignore-plugin/
  // const ignoreModules = new IgnorePlugin({
  //   resourceRegExp:
  //     /^(sqlite3|oracledb|mysql2|aws4|snappy|kerberos|tedious|pg-native|pg-query-stream|@mongodb-js\/zstd|@aws-sdk\/credential-providers|mongodb-client-encryption)$/,
  // });
  // pluginsOptions.push(ignoreModules);

  //COPY FILES IN THE STATIC FOLDER
  const copyWebpackPlugin = new CopyPlugin({
    patterns: [{ from: "./src/static", to: OUTPUT_PATH }],
  });
  pluginsOptions.push(copyWebpackPlugin);

  //ONE CHUNK FOR STANDALONE
  if (env.standalone) {
    //INFO - https://medium.com/@glennreyes/how-to-disable-code-splitting-in-webpack-1c0b1754a3c5
    console.log("ONE CHUNK: ", true);
    const oneChunk = new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    });
    pluginsOptions.push(oneChunk);
  }

  return pluginsOptions;
}

function getOutputOptions(env, args) {
  //INFO - https://webpack.js.org/concepts/output
  //INFO - https://webpack.js.org/configuration/output/#outputfilename
  const outputOptions = {
    // filename: "[name]-[hash].js", //USE CACHE-BUSTER FILENAMES
    filename: "[name].js", //USE DEFAULT FILENAMES
    path: OUTPUT_PATH, //PLACE WEBPACK FILES IN DIST DIRECTORY
    // path: path.resolve(__dirname, "./public"), //PLACE WEBPACK FILES IN DIST DIRECTORY
    clean: true, //DELETE THE OLD BUILD FILES
  };

  if (env.standalone) {
    const basename = path.basename(args.entry[0]);
    const filename = path.parse(basename).name + ".js";
    outputOptions.filename = filename;
    outputOptions.path = path.resolve(path.dirname(args.entry[0]));
    outputOptions.clean = false;
  }
  if (env.cacheBuster) outputOptions.filename = "[name]-[hash].js"; //USE CACHE-BUSTER FILENAMES

  //INFO - https://thecodebarbarian.com/bundling-a-node-js-function-for-aws-lambda-with-webpack.html
  if (env.serverless || !isExecutable(GLOBAL.entryFile)) {
    console.log("LIBRARY: ", true);
    outputOptions.libraryTarget = "commonjs";
  }

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

    //USE PATHS (ALIASES) IN TSCONFIG
    //INFO - https://www.npmjs.com/package/tsconfig-paths-webpack-plugin
    plugins: [
      new TsconfigPathsPlugin({
        extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".scss"],
      }),
    ],

    //ALIAS - https://webpack.js.org/configuration/resolve/#resolvealias
    //ALLOWS IMPORT FROM THE ALIAS INSTEAD OF RELATIVE PATH
    //EXAMPLE import Title from "components/Title" instead of "../../components/Title"
    // alias: {
    //   assets: path.resolve("./src/assets/"),
    //   bootstrap: path.resolve("./node_modules/bootstrap/"),
    //   components: path.resolve("./src/components/"),
    //   controllers: path.resolve("./src/controllers/"),
    //   customer: path.resolve("./src/microservices/customer/"),
    //   microservices: path.resolve("./src/microservices/"),
    //   modules: path.resolve("./src/modules/"),
    //   // data: path.resolve("./src/data/"),
    //   models: path.resolve("./src/models/"),
    //   modules: path.resolve("./src/modules/"),
    //   product: path.resolve("./src/microservices/product/"),
    //   project: path.resolve("./src/project/"),
    //   public: path.resolve("./public/"),
    //   views: path.resolve("./src/views/"),
    //   routes: path.resolve("./src/routes/"),
    //   root: path.resolve("./"),
    //   utils: path.resolve("./src/utils/"),
    //   scss: path.resolve("./src/scss/"),
    //   skills: path.resolve("./src/skills/"),
    //   src: path.resolve("./src/"),
    // },
  };
  return resolveOptions;
}
function getTargetOptions(env) {
  let target = "web";
  // if (process.env.webpack === "backend") target = "node";
  if (env.excludeNode || env.excludeModules || env.serverless) target = "node";
  console.log("TARGET: ", target);
  return target;
}
