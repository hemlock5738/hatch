import t from "@babel/types";
import { generator } from "../babel/generator.js";

export function getAssignmentDeclarations(body: t.Statement[], minified?: boolean) {
  const ast = t.program(body);
  const generatorResult = generator(ast, { minified });
  return generatorResult.code;
}
