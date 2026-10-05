import assert from "node:assert/strict";
import { test } from "node:test";
import { twoSumChallenge } from "../../data/challenges";
import { isCorrectFix } from "./validation";

const expected = twoSumChallenge.expectedFix;
const flagged = twoSumChallenge.lines.find((line) => line.number === twoSumChallenge.flaggedLine);

test("the only bug is == on line 7", () => {
  assert.equal(twoSumChallenge.flaggedLine, 7);
  assert.equal(twoSumChallenge.language, "cpp");
  if (!flagged) {
    throw new Error("Line 7 is missing");
  }
  assert.match(flagged.text, /==/);
  assert.equal(twoSumChallenge.lines.filter((line) => line.text.includes("==")).length, 1);
  assert.equal(twoSumChallenge.lines.filter((line) => line.text.includes("!=")).length, 0);
  assert.match(expected, /!=/);
});

test("spacing differences still count as the fix", () => {
  assert.equal(isCorrectFix("if (seen.find(complement) != seen.end()) {", expected), true);
  assert.equal(isCorrectFix("  if( seen.find( complement ) != seen.end( ) ){  ", expected), true);
  assert.equal(isCorrectFix("if (seen.find(complement) != seen.end())", expected), true);
});

test("the original line and other edits are rejected", () => {
  assert.equal(isCorrectFix(flagged?.text ?? "", expected), false);
  assert.equal(isCorrectFix("if (seen.find(complement) == seen.end()) {", expected), false);
  assert.equal(isCorrectFix("if (seen.find(complement) != seen.begin()) {", expected), false);
  assert.equal(isCorrectFix("return {seen[complement], i};", expected), false);
});
