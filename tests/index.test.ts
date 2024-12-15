import fs from "node:fs";
import { join } from "node:path";
import parser from "@babel/parser";
import type { Statement } from "@babel/types";
import { expect, it } from "vitest";
import { traverse } from "../src/babel/traverse.js";
import { generate } from "../src/index.js";

it("should contain global assignment and declarations.", () => {
  const globalName = "_";
  const path = join(import.meta.dirname, "src/index.js");
  const text = fs.readFileSync(path, "utf-8");
  const assignmentDeclarations = generate(text);
  checkAll(assignmentDeclarations);

  function checkAll(text: string) {
    const ast = parser.parse(text);
    traverse(ast, {
      Program(path) {
        const [assignment, ...declarations] = path.node.body;
        checkAssignment(assignment);
        checkDeclarations(declarations);
      },
    });
  }

  function checkAssignment(assignment: Statement) {
    const expectation = {
      a1: `${globalName}.a1`,
      a2: `${globalName}.a2`,
      a3: `${globalName}.a3`,
      a4: `${globalName}.a4`,
      a5: `${globalName}.a5`,
    };
    if (assignment.type === "ExpressionStatement") {
      if (assignment.expression.type === "CallExpression") {
        const callee = assignment.expression.callee;
        if (callee.type === "MemberExpression") {
          expect(callee.object.loc?.identifierName).toBe("Object");
          expect(callee.property.loc?.identifierName).toBe("assign");
        }
        expect(assignment.expression.arguments.length).toBe(2);
        const [globalThis_, object] = assignment.expression.arguments;
        expect(globalThis_.loc?.identifierName).toBe("globalThis");
        const args: { [key: string]: string | null | undefined } = {};
        if (object.type === "ObjectExpression") {
          for (const prop of object.properties) {
            if (prop.type === "ObjectProperty") {
              if (prop.value.type === "MemberExpression") {
                args[prop.key.loc?.identifierName ?? ""] =
                  `${prop.value.object.loc?.identifierName}.${prop.value.property.loc?.identifierName}`;
              }
            }
          }
        }
        expect(args).toEqual(expectation);
      }
    }
  }

  function checkDeclarations(declarations: Statement[]) {
    const expectation = {
      a1: "var",
      a2: "var",
      a3: "var",
      a4: "function",
      a5: "var",
    };
    const decls: { [key: string]: string | null | undefined } = {};
    for (const decl of declarations) {
      if (decl.type === "VariableDeclaration") {
        if (decl.declarations.length === 1) {
          decls[decl.declarations[0].id.loc?.identifierName ?? ""] = decl.kind;
        }
      }
      if (decl.type === "FunctionDeclaration") {
        if (decl.body.body.length === 0) {
          decls[decl.id?.loc?.identifierName ?? ""] = "function";
        }
      }
    }
    expect(decls).toEqual(expectation);
  }
});
