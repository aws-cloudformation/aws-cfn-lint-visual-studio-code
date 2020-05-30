/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';
import * as path from 'path';

export let doc: vscode.TextDocument;
export let editor: vscode.TextEditor;
export let documentEol: string;
export let platformEol: string;

/**
 * Activates the vscode.lsp-sample extension
 */
export async function activate(docUri: vscode.Uri) {
	// The extensionId is `publisher.name` from package.json
	const ext = vscode.extensions.getExtension('kddejong.vscode-cfn-lint')!;
	await ext.activate();
	try {
		doc = await vscode.workspace.openTextDocument(docUri);
		editor = await vscode.window.showTextDocument(doc);
		vscode.workspace.getConfiguration().update('yaml.validate', false, vscode.ConfigurationTarget.Global);
		await sleep(4000); // Wait for server activation
	} catch (e) {
		console.error(e);
	}
}

export async function activateAndPreview(docUri: vscode.Uri) {
	await activate(docUri);

	await vscode.commands.executeCommand('extension.sidePreview');

	await sleep(8000); // Wait for preview to become available
}

async function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export const getDocPath = (p: string) => {
	return path.resolve(__dirname, '../../../src/test/suite/fixtures', p);
};
export const getDocUri = (p: string) => {
	return vscode.Uri.file(getDocPath(p));
};

export async function setTestContent(content: string): Promise<boolean> {
	const all = new vscode.Range(
		doc.positionAt(0),
		doc.positionAt(doc.getText().length)
	);
	return editor.edit(eb => eb.replace(all, content));
}