import { promises as fs } from 'fs';
import * as core from '@actions/core';
import * as yaml from 'js-yaml';

let compose: any;
let inputFile = '';
let outputFile = '';
let verbose = false;
let writeToFile = false;

export async function before(options) {
	verbose = options.verbose;
	inputFile = options.file;
	outputFile = options.output;
	writeToFile = !!options.output;
	await load(inputFile);
}

export async function after() {
	if (writeToFile) await write(outputFile);
	else core.setOutput('yml', JSON.stringify(compose));
}

export async function load(inputFile: string) {
	if (verbose) core.info(`Loading file '${inputFile}'...`);

	try {
		const rawYml = await fs.readFile(inputFile, { encoding: 'utf-8' });
		compose = yaml.load(rawYml);
	} catch (error) {
		throw new Error(`Error parsing compose file '${inputFile}', ${error}`);
	}
}

export async function write(outputFile: string) {
	if (!outputFile) {
		throw new Error(`Undefined output file, can't save`);
	}
	if (verbose) core.info(`Saving file to '${outputFile}'`);

	try {
		await fs.writeFile(outputFile, yaml.dump(compose));
		if (writeToFile) core.info(`File saved successfully.`);
	} catch (error) {
		throw new Error(`Error saving compose file '${outputFile}', ${error}`);
	}
}

export function print(service = null, attribute = null) {
	if (!service) return core.setOutput('print', compose);

	if (attribute && attribute !== undefined && attribute !== null)
		return core.setOutput('print', compose.services[service][attribute]);
	else return core.setOutput('print', compose.services[service]);
}

export function del(service = null, attribute = null) {
	if (attribute) return delete compose.services[service][attribute];

	if (service) return delete compose.services[service];
}

export function set(service, attribute, value = null) {
	if (service && attribute)
		if (!value) del(service, attribute);
		else compose.services[service][attribute] = value;
}

export function add(service, attribute, value) {
	if (!Object.keys(compose.services).includes(service)) {
		if (verbose) core.info(`Creating service '${service}'`);
		compose.services[service] = {};
	}

	if (!Object.keys(compose.services[service]).includes(attribute)) {
		if (verbose) core.info(`Creating attribute '${attribute}'`);
		compose.services[service][attribute] = {};
		if (Array.isArray(value)) {
			compose.services[service][attribute] = [];
		}
	}

	if (verbose) core.info(`Add ${typeof value} value to attribute '${value}'`);

	if (Array.isArray(compose.services[service][attribute])) {
		if (verbose) core.info(`Target attribute is array`);
		if (Array.isArray(value)) {
			if (verbose) core.info(`Value is array`);
			compose.services[service][attribute].push(...value);
		} else {
			if (verbose) core.info(`Value is ${typeof value} type`);
			compose.services[service][attribute].push(value);
		}
	} else {
		if (verbose)
			core.info(
				`Target attribute is ${typeof compose.services[service][
					attribute
				]} type`
			);
		compose.services[service][attribute] += value;
	}
}
