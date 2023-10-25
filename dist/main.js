"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const edit_1 = require("./edit");
const core = __importStar(require("@actions/core"));
const hjson = __importStar(require("hjson"));
const packageJson = require('./package.json');
let compose;
let inputFile = '';
let options;
let outputFile = '';
let verbose = false;
let writeToFile = false;
/**
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
    try {
        const command = core.getInput('command', { required: true });
        const inputFile = core.getInput('inputFile', { required: true });
        const outputFile = core.getInput('outputFile');
        const verbose = core.getInput('verbose');
        const service = core.getInput('service', { required: true });
        const attribute = core.getInput('attribute');
        const value = core.getInput('value');
        const writeToFile = !!outputFile;
        let options = {
            verbose: verbose,
            inputFile: inputFile,
            outputFile: outputFile,
            writeToFile: writeToFile,
        };
        // Set outputs for other workflow steps to use
        core.setOutput('time', new Date().toTimeString());
        core.info(`${packageJson.name} ${packageJson.version} by ${packageJson.author}`);
        if (verbose) {
            core.info(`Verbose output is enabled`);
            core.info(`Input file is '${inputFile}'`);
            core.info(`Output to file is '${writeToFile}'`);
            if (writeToFile) {
                core.info(`Writing output to file '${outputFile}'...`);
            }
            else {
                core.info(`Writing to stdout...`);
            }
        }
        switch (command) {
            case 'print':
                await (0, edit_1.before)(options);
                (0, edit_1.print)(service, attribute);
                break;
            case 'add':
                await (0, edit_1.before)(options);
                if (verbose)
                    core.info(`ADD '${service}.${attribute}' = '${value}'`);
                try {
                    (0, edit_1.add)(service, attribute, hjson.parse(value));
                }
                catch (error) {
                    throw new Error(error);
                }
                await (0, edit_1.after)();
                break;
            case 'set':
                await (0, edit_1.before)(options);
                if (verbose)
                    core.info(`SET '${service}.${attribute}' to '${value}'`);
                try {
                    (0, edit_1.set)(service, attribute, hjson.parse(value));
                }
                catch (error) {
                    throw new Error(error);
                }
                await (0, edit_1.after)();
                break;
            case 'delete':
                await (0, edit_1.before)(options);
                if (verbose)
                    core.info(`DELETE '${service}.${attribute}'`);
                (0, edit_1.del)(service, attribute);
                await (0, edit_1.after)();
                break;
            default:
                throw new Error(`Invalid command '${command}'`);
        }
    }
    catch (error) {
        if (error instanceof Error)
            core.setFailed(error.message);
    }
}
exports.run = run;
//# sourceMappingURL=main.js.map