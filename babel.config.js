const path = require("path");

function babelConfig() {
  return {
    // ignore: [shouldIgnore],
    // ignore: [...ignoreFolders, ...backupFiles],
    // test: shouldProcess,
    // presets: [],
    // plugins: ["./babelPlugin"],
    exclude: ignoreFolders,
    presets: typescriptPresets,
    plugins: decoratorPlugins,
    minified: true,
    // overrides: [{ exclude: shouldExclude, presets: [], plugins: [] }],
  };
}

const backupFiles = [
  "bak",
  "bak.*",
  "bak.*/",
  "**/bak.*.*",
  "**/*.bak",
  "**/*.bak.*",
];
const sourceFiles = ["*.js", "*.jsx", "*.ts", "*.tsx"];
const ignoreFolders = ["node_modules", "dist", "public", "build", "bak"];
const typescriptPresets = ["@babel/preset-env", "@babel/preset-typescript"];
const reactPresets = ["@babel/preset-env", "@babel/preset-react"];
const reactTypescriptPresets = [
  "@babel/preset-env",
  "@babel/preset-react",
  "@babel/preset-typescript",
];
const decoratorPlugins = [
  ["@babel/plugin-proposal-decorators", { decoratorsBeforeExport: false }],
];

function shouldProcess(filename, _context, _envName) {
  debugger;
  const file = path.parse(filename);
  const folder = file.dir.split("\\").pop();
  if (ignoreFolders.includes(folder)) return false;
  return true;
}
function shouldIgnore(filepath, _context, _envName) {
  debugger;
  const ignoreFolders =
    /\\node_modules\\|\\dist\\|\\public\\|\\build\\|\\bak\\|\\bak\.|\.bak\\/i;
  const ignoreExtensions = /\.bak$/i;
  const ignoreFilenames = /^bak\.|\.bak$/i;
  const file = path.parse(filepath);
  // const folder = file.dir.split("\\").pop();
  if (ignoreFolders.test(filepath)) return true;
  if (ignoreExtensions.test(filepath)) return true;
  if (ignoreFilenames.test(file.name)) return true;
  return false;
}
function shouldExclude(filepath) {
  debugger;
  const sourceFiles = /\.(js|jsx|ts|tsx)$/i;
  const file = path.parse(filepath);
  if (filepath.includes(".env")) debugger;
  if (filepath.match(sourceFiles)) return true;
  return false;
}
module.exports = babelConfig();
