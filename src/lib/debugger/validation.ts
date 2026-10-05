function compact(line: string) {
  return line.trim().replace(/\s+/g, "");
}

export function isCorrectFix(editedLine: string, expectedFix: string) {
  const edited = compact(editedLine);
  const expected = compact(expectedFix);
  const withoutBrace = expected.endsWith("{") ? expected.slice(0, -1) : expected;

  return edited === expected || edited === withoutBrace;
}
