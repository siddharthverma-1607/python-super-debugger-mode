import * as vscode from 'vscode';


// function to see if a line has indentation
export function isLineIndented(line: string): boolean {
    const indentationRegex = /^\s+/;
    return indentationRegex.test(line);
}
    
    
// function to check when the line gets comepleted based on brackets and returns updated value of i to skip next lines
export function checkCompleteStatement(i: number, cur_line: vscode.TextLine, document:vscode.TextDocument): [number, vscode.TextLine]{
    let openBrackets = (cur_line.text.match(/[\{\[\(]/g) || []).length;
    let closeBrackets = (cur_line.text.match(/[\}\]\)]/g) || []).length;
    let brackets = openBrackets - closeBrackets;
    console.log("bracket count = " + brackets + " for line: "+ cur_line.text);
    if (brackets !== 0){
        console.log("Entered if block");
        while(brackets!==0){
            i++;
            cur_line = document.lineAt(i);
            brackets = brackets + (cur_line.text.match(/[\{\[\(]/g) || []).length - (cur_line.text.match(/[\}\]\)]/g) || []).length;
            console.log("Bracket value inside if block " + brackets);
        }
    }
  return [i, cur_line];
}