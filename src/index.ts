import { createAssignmentStatement } from "./utils/createAssignmentStatment.js";
import { createDeclarationStatements } from "./utils/createDeclarationStatements.js";
import { extractExports } from "./utils/extractExports.js";
import { getAssignmentDeclarations } from "./utils/getAssignmentDeclarations.js";

export function generate(text: string, minified?: boolean) {
  const exports = extractExports(text);
  const assignmentStatement = createAssignmentStatement(exports, "_");
  const declarationStatements = createDeclarationStatements(exports);
  const assignmentDeclarations = getAssignmentDeclarations([assignmentStatement, ...declarationStatements], minified);
  return assignmentDeclarations;
}
