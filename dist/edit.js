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
exports.add = exports.set = exports.del = exports.print = exports.write = exports.load = exports.after = exports.before = void 0;
const fs_1 = require("fs");
const core = __importStar(require("@actions/core"));
const yaml = __importStar(require("js-yaml"));
let compose;
let inputFile = '';
let outputFile = '';
let verbose = false;
let writeToFile = false;
async function before(options) {
    verbose = options.verbose;
    inputFile = options.file;
    outputFile = options.output;
    writeToFile = !!options.output;
    await load(inputFile);
}
exports.before = before;
async function after() {
    if (writeToFile)
        await write(outputFile);
    else
        core.setOutput('yml', JSON.stringify(compose));
}
exports.after = after;
async function load(inputFile) {
    if (verbose)
        core.info(`Loading file '${inputFile}'...`);
    return fs_1.promises.readFile(inputFile, { encoding: "utf-8" })
        .then((result) => {
        compose = yaml.load(result);
    }).catch((error) => {
        throw new Error(`Error parsing compose file '${inputFile}', ${error}`);
    });
}
exports.load = load;
async function write(outputFile) {
    if (!outputFile) {
        throw new Error(`Undefined output file, can't save`);
    }
    if (verbose)
        core.info(`Saving file to '${outputFile}'`);
    return fs_1.promises.writeFile(outputFile, yaml.dump(compose))
        .then(() => {
        if (writeToFile)
            core.info(`File saved successfully.`);
    }).catch((error) => {
        throw new Error(`Error saving compose file '${outputFile}', ${error}`);
    });
}
exports.write = write;
function print(service = null, attribute = null) {
    if (!service)
        return core.setOutput('print', compose);
    if (attribute && attribute !== undefined && attribute !== null)
        return core.setOutput('print', compose.services[service][attribute]);
    else
        return core.setOutput('print', compose.services[service]);
}
exports.print = print;
function del(service = null, attribute = null) {
    if (attribute)
        return delete compose.services[service][attribute];
    if (service)
        return delete compose.services[service];
}
exports.del = del;
function set(service, attribute, value = null) {
    if (service && attribute)
        if (!value)
            del(service, attribute);
        else
            compose.services[service][attribute] = value;
}
exports.set = set;
function add(service, attribute, value) {
    if (!Object.keys(compose.services).includes(service)) {
        if (verbose)
            core.info(`Creating service '${service}'`);
        compose.services[service] = {};
    }
    if (!Object.keys(compose.services[service]).includes(attribute)) {
        if (verbose)
            core.info(`Creating attribute '${attribute}'`);
        compose.services[service][attribute] = {};
        if (Array.isArray(value)) {
            compose.services[service][attribute] = [];
        }
    }
    if (verbose)
        core.info(`Add ${typeof value} value to attribute '${value}'`);
    if (Array.isArray(compose.services[service][attribute])) {
        if (verbose)
            core.info(`Target attribute is array`);
        if (Array.isArray(value)) {
            if (verbose)
                core.info(`Value is array`);
            compose.services[service][attribute].push(...value);
        }
        else {
            if (verbose)
                core.info(`Value is ${typeof value} type`);
            compose.services[service][attribute].push(value);
        }
    }
    else {
        if (verbose)
            core.info(`Target attribute is ${typeof compose.services[service][attribute]} type`);
        compose.services[service][attribute] += value;
    }
}
exports.add = add;
//# sourceMappingURL=edit.js.map