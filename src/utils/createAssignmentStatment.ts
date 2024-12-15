import t from "@babel/types";
import type { Exports } from "../types/Exports.js";

export function createAssignmentStatement(exports: Exports, globalName: string) {
  const assignment = t.expressionStatement(
    t.callExpression(t.memberExpression(t.identifier("Object"), t.identifier("assign")), [
      t.identifier("globalThis"),
      t.objectExpression(
        Object.values(exports).map(({ name }) =>
          t.objectProperty(t.identifier(name), t.memberExpression(t.identifier(globalName), t.identifier(name))),
        ),
      ),
    ]),
  );
  return assignment;
}
