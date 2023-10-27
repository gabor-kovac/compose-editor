/**
 * Unit tests for src/edit.ts
 */

import { load } from '../src/edit';
import { expect } from '@jest/globals';

describe('edit.ts', () => {
	it('throws an invalid file', async () => {
		const input = 'idontexist.yml';

		await expect(load(input)).rejects.toThrow('Error parsing compose file');
	});
});
