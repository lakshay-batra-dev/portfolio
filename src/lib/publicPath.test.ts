import assert from "node:assert/strict";
import { test } from "node:test";
import { withBase } from "./publicPath";

test("public paths keep the GitHub Pages base path", () => {
  const previous = process.env.NEXT_PUBLIC_BASE_PATH;
  process.env.NEXT_PUBLIC_BASE_PATH = "/portfolio";
  assert.equal(withBase("/Lakshay_Batra_CV%20(fixed).pdf"), "/portfolio/Lakshay_Batra_CV%20(fixed).pdf");
  assert.equal(withBase("https://github.com/DROP5136"), "https://github.com/DROP5136");
  process.env.NEXT_PUBLIC_BASE_PATH = "";
  assert.equal(withBase("/Lakshay_Batra_CV%20(fixed).pdf"), "/Lakshay_Batra_CV%20(fixed).pdf");
  if (previous === undefined) {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
  } else {
    process.env.NEXT_PUBLIC_BASE_PATH = previous;
  }
});
