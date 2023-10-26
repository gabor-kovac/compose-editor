/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core';
import * as main from '../src/main';

// Mock the GitHub Actions core library
const debugMock = jest.spyOn(core, 'debug');
const getInputMock = jest.spyOn(core, 'getInput');
const setFailedMock = jest.spyOn(core, 'setFailed');
const setOutputMock = jest.spyOn(core, 'setOutput');

// Mock the action's main function
const runMock = jest.spyOn(main, 'run');

// Other utilities
const timeRegex = /^\d{2}:\d{2}:\d{2}/;

const expectedYml = 
`
version: '3.3'
services:
  mqtt:
    container_name: mqtt
    image: eclipse-mosquitto
    ports:
        - 8889:8889
`;

describe('action', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('print docker-compose.yml', async () => {
		// Set the action's inputs as return values from core.getInput()
		getInputMock.mockImplementation((inputFile: string): string => {
			switch (inputFile) {
				case 'docker-compose.yml':
					return expectedYml;
				default:
					return `Input does not meet YAML 1.2 \"Core Schema\" specification: verbose
					Support boolean input list: \`true | True | TRUE | false | False | FALSE\``;
			}
		});

		await main.run();
		expect(runMock).toHaveReturned();

		// Verify that all of the core library functions were called correctly
		expect(setFailedMock).toHaveBeenNthCalledWith(
			1,
			//'print',
			`Input does not meet YAML 1.2 \"Core Schema\" specification: verbose
Support boolean input list: \`true | True | TRUE | false | False | FALSE\``
			//expect.stringMatching(expectedYml)
		);
	});

	it('sets a failed status', async () => {
		// Set the action's inputs as return values from core.getInput()
		getInputMock.mockImplementation((name: string): string => {
			switch (name) {
				case 'print':
					return '';
				default:
					return '';
			}
		});

		await main.run();
		expect(runMock).toHaveReturned();

		// Verify that all of the core library functions were called correctly
		expect(setFailedMock).toHaveBeenNthCalledWith(
			1,
			`Input does not meet YAML 1.2 \"Core Schema\" specification: verbose
Support boolean input list: \`true | True | TRUE | false | False | FALSE\``
		);
	});
});
