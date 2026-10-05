# Component 2 — DSA Debugger

The debugger is the short interaction that follows the boot. It is not the portfolio, and it does not run again as a way to navigate the site.

```text
BOOT
  → SYSTEM DIAGNOSTICS
  → INVESTIGATION REQUIRED
  → DSA DEBUGGER
  → SOLVED / SKIPPED / TIMED OUT
  → PORTFOLIO PLACEHOLDER
```

Component 1 stays as it is. This component starts after `DiagnosticHandoff`.

## Screen

One screen. The visitor sees all of this at once:

- diagnostic context
- Two Sum
- a small pair visualization
- C++ source
- one flagged line
- an edit control for only that line
- Verify
- Skip
- a quiet 30 second timer

Copy must make the task obvious: one line is flagged, fix the smallest thing that is wrong. Do not say that `==` should become `!=`.

## Challenge

One challenge only: Two Sum, C++, unordered_map, O(n) time and O(n) space.

The only bug is on line 7:

```cpp
if (seen.find(complement) == seen.end()) {
```

The correction is:

```cpp
if (seen.find(complement) != seen.end()) {
```

No other mistakes. No second challenge. No random selection. The data shape should allow another challenge later: id, title, language, lines, flagged line, expected fix, visualization.

## Editing and validation

Only line 7 is editable. Every other line is read-only.

Do not execute C++. Do not add a compiler, sandbox, backend, or execution API.

Validation compares the edited line as text. Ignore harmless spacing. A wrong edit stays on the debugger and says the fix is not quite right, without showing the answer.

A correct edit shows a short success: `BUG FIXED`, then `Get a life, nerd.`, then the portfolio placeholder.

## Skip, timeout, mobile, memory

Skip is on the same screen. Default label: `SKIP DEBUGGING →`. On hover: `I'M DUMB →`. The accessible name stays “Skip debugging” without hover. Skipping shows a short joke, then the placeholder.

If the visitor does not solve or skip within 30 seconds, continue automatically after a short joke. The timer is subtle.

Viewports at or below 720px skip the editor. Show a short line about not debugging C++ on a phone, then continue.

Remember solved, skipped, or timed out in `localStorage` with a timestamp. For 3 days, skip the debugger after the boot. After that, it may appear again. No backend, database, or cookies. Mobile bypass is not stored, so a later desktop visit can still see the challenge.

## Visual and technical limits

Same restrained terminal language as the boot. No Matrix rain, neon, fake security warnings, or a generic editor chrome.

No new runtime dependencies. A one-line field is enough; do not add Monaco for this.

Reduced motion still shows the same information. Keyboard users can edit the line, verify, and skip. Focus states are visible.

The portfolio placeholder is only a transition. Do not build the portfolio.
