import assert from "node:assert/strict";
import { test } from "node:test";
import { isTypewriterDone, revealedText, stepTypewriter, type TypewriterState } from "./typewriter";

const lines = [
  { kind: "command", text: "Hi" },
  { kind: "command", text: "Yo" },
];

function reveal(state: TypewriterState) {
  return lines.map((line, index) => revealedText(line, index, state, false));
}

test("typewriter reveals one character at a time and waits to start the next line", () => {
  let state = stepTypewriter({ index: 0, chars: 0 }, lines);
  assert.deepEqual(reveal(state), ["H", null]);

  state = stepTypewriter(state, lines);
  assert.deepEqual(reveal(state), ["Hi", null]);
  assert.equal(isTypewriterDone(state, lines), false);

  state = stepTypewriter(state, lines);
  assert.deepEqual(reveal(state), ["Hi", ""]);

  state = stepTypewriter(state, lines);
  assert.deepEqual(reveal(state), ["Hi", "Y"]);

  state = stepTypewriter(state, lines);
  assert.deepEqual(reveal(state), ["Hi", "Yo"]);
  assert.equal(isTypewriterDone(state, lines), true);
  assert.equal(stepTypewriter(state, lines), state);
});
