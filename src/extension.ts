// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { isLineIndented, checkCompleteStatement } from './utils';
import { functionRegex, variableAssignmentRegex, printStatementRegex } from './regexPatterns';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "python-super-debugger-mode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

    let disposableAddPrintStatement = vscode.commands.registerCommand('extension.addPrintStatements', () => {
        let editor = vscode.window.activeTextEditor; 
        if (!editor) {
            vscode.window.showInformationMessage('No active editor.');
            return; // No open text editor
        }
        
        let currentFunction: string | null = null; // Track the current function scope

        editor.edit(editBuilder => {
            // @ts-ignore - editor is guaranteed to be non-null here due to prior checks
            const document = editor.document;
            for (let i = 0; i < document.lineCount; i++) {
                const line = document.lineAt(i);
                const functionMatch = RegExp(functionRegex).exec(line.text);
                if (functionMatch) {
                    currentFunction = functionMatch[1]; // Update current function name
                }
    
                const variableMatch = RegExp(variableAssignmentRegex).exec(line.text);
                if (variableMatch) {
                    const variableName = variableMatch[1];
                    let [final_index, cur_line] = checkCompleteStatement(i, line, document);
                    i = final_index;
                    console.log("Current Line at: "+ i);
                   
                    // @ts-ignore - line.text works
                    const leadingWhitespace = RegExp(/^\s*/).exec(line.text)[0];
                    let printStatement = `${leadingWhitespace}print("<SDM>`;
                    if (currentFunction && isLineIndented(line.text)){
                        printStatement += ` [${currentFunction} scope]`;
                    }
                    else{
                        printStatement += ` [main block scope]`;
                    }
                    printStatement += ` ${variableName}: ", ${variableName})\n`;
                    // console.log("Done");
                    editBuilder.insert(cur_line.range.end,"\n" + printStatement);
                }
            }
        }).then(success => {
            if (!success) {
                vscode.window.showErrorMessage('Failed to add print statements.');
            }
            else{
                vscode.window.showInformationMessage('Print statements added Successfully.');
            }
        });
    });
    context.subscriptions.push(disposableAddPrintStatement);
	
	
    let disposableRemovePrints = vscode.commands.registerCommand('extension.removePrintStatements', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No active editor.');
            return; // No open text editor
        }
    
        editor.edit(editBuilder => {
            // @ts-ignore - editor is guaranteed to be non-null here due to prior checks
            const document = editor.document;
            for (let i = 0; i < document.lineCount; i++) {
                const line = document.lineAt(i);
                if (printStatementRegex.test(line.text)) {
                    // Remove the entire line including the newline character
                    const line_2 = document.lineAt(i+1);
                    const rangeToRemove = line.rangeIncludingLineBreak;
                    const rangeToRemove_2 = line_2.rangeIncludingLineBreak;
                    editBuilder.delete(rangeToRemove);
                    editBuilder.delete(rangeToRemove_2);
                }
            }
        }).then(success => {
            if (success) {
                vscode.window.showInformationMessage('Print statements removed.');
            } else {
                vscode.window.showErrorMessage('Failed to remove print statements.');
            }
        });
    });
    
    context.subscriptions.push(disposableRemovePrints);    

}

// This method is called when your extension is deactivated
export function deactivate() { /* TODO document why this function 'deactivate' is empty */ }
