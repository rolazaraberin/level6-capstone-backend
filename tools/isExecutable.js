"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExecutable = void 0;
var typescript_1 = require("typescript");
// const FILENAME = "src/utils/serverUtils/envToAwsLambda.ts";
// isExecutable(FILENAME);
function isExecutable(filename) {
    //INFO - https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API#re-printing-sections-of-a-typescript-file
    var program = (0, typescript_1.createProgram)([filename], { allowJs: true });
    var sourceFile = program.getSourceFile(filename);
    var result = false;
    (0, typescript_1.forEachChild)(sourceFile, function (node) {
        if ((0, typescript_1.isCallExpression)(node))
            debugger;
        if ((0, typescript_1.isExpressionStatement)(node))
            result = true;
    });
    return result;
}
exports.isExecutable = isExecutable;
