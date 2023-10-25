import { before, after, del, set, add, print } from './edit';
import * as core from '@actions/core';
import * as hjson from 'hjson';

const packageJson = require('./package.json');

let compose: any;
let inputFile = '';
let options;
let outputFile = '';
let verbose = false;
let writeToFile = false;

/**
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
	try {
		const command: string = core.getInput('command', { required: true });
		const inputFile: string = core.getInput('inputFile', { required: true });
		const outputFile: string = core.getInput('outputFile');
		const verbose: string = core.getInput('verbose');

		const service: string = core.getInput('service', { required: true });
		const attribute: string = core.getInput('attribute');
		const value: string = core.getInput('value');

		const writeToFile: boolean = !!outputFile;
		
		let options = {
			verbose: verbose,
			inputFile: inputFile,
			outputFile: outputFile,
			writeToFile: writeToFile,
		}

		// Set outputs for other workflow steps to use
		core.setOutput('time', new Date().toTimeString())

		core.info(`${packageJson.name} ${packageJson.version} by ${packageJson.author}`)

		if (verbose) {
			core.info(`Verbose output is enabled`);
			core.info(`Input file is '${inputFile}'`);
			core.info(`Output to file is '${writeToFile}'`);
			if (writeToFile) {
				core.info(`Writing output to file '${outputFile}'...`);
			} else {
				core.info(`Writing to stdout...`);
			}
		}

		switch(command){
			case 'print':
				await before(options);
				print(service, attribute);
				break;

			case 'add':
				await before(options);
				if (verbose) core.info(`ADD '${service}.${attribute}' = '${value}'`);

				try {
					add(service, attribute, hjson.parse(value));
				} catch (error) {
					throw new Error(error);
				}
				await after();
				break;

			case 'set':
				await before(options);
				if (verbose) core.info(`SET '${service}.${attribute}' to '${value}'`);

				try {
					set(service, attribute, hjson.parse(value));
				} catch (error) {
					throw new Error(error);
				}
				await after();
				break;

			case 'delete':
				await before(options);
				if (verbose) core.info(`DELETE '${service}.${attribute}'`);
				del(service, attribute);
				await after();
				break;
			default:
				throw new Error(`Invalid command '${command}'`);
		}
		
	} catch (error) {
		if (error instanceof Error) core.setFailed(error.message)
	}
}
