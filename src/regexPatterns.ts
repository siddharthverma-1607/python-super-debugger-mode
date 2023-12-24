export const functionRegex = /def\s+(\w+)\s*\(/;
// const variableAssignmentRegex = /(\w+)\s*=\s*(?!(?:\d+|None|True|False|["']).*)\S.*/;
// const variableAssignmentRegex = /(\w+(\.\w+)*)\s*=\s*(?!(?:\d+|None|True|False|["']).*)\S.*/;
export const variableAssignmentRegex = /([\w\[\]\'\"\.]+)\s*=\s*(?!(?:\d+|None|True|False|["']).*)\S.*/;
export const printStatementRegex = /^\s*print\("<SDM>/;
