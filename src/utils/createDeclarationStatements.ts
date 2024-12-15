import t from "@babel/types";
import type { Exports } from "../types/Exports.js";

export const createDeclarationStatements = (exports: Exports) => {
  const declarations = Object.values(exports).map(({ name, type }) =>
    type === "variable"
      ? t.variableDeclaration("var", [t.variableDeclarator(t.identifier(name))])
      : t.functionDeclaration(t.identifier(name), [], t.blockStatement([])),
  );
  return declarations;
};
