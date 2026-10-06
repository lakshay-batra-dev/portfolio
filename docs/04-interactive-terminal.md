# Component 4 — Interactive terminal

A client-side virtual terminal inside the portfolio workspace. It parses a fixed set of commands against an in-memory filesystem built from the portfolio data. It does not run a shell, read the visitor's disk, or evaluate input as code.

## Purpose

The main portfolio stays the primary interface. The terminal is an optional workstation control for visitors who want to inspect the same profile, projects, experience, skills, education, and contact details from a prompt.

## UX

The panel is closed until the visitor opens it.

- Ctrl + ` toggles it.
- The status bar control labeled TERMINAL toggles it. Its accessible name is "Open terminal" or "Close terminal".
- The first open in a page session prints a two-line introduction. Later opens in that session do not repeat it.
- Desktop: a bottom panel inside the main workspace column, beside the sidebar and above the status bar. It uses the column width. Drag the top edge, or focus "Resize terminal" and use the arrow and page keys, to change its height for the rest of the page session. Output scrolls inside the panel.
- Narrow screens: the terminal covers the viewport, with the prompt kept at the bottom and a close control in the header.
- Reduced motion opens it without the short entrance animation.
- A reload clears the working directory, history, output, and open state. None of that is written to localStorage.

Prompt: `lakshay@dev:~$`, updating to the current virtual path, for example `lakshay@dev:~/projects/intelliflow$`.

## Commands

Public commands, also listed by `help`:

| Command | Behavior |
| --- | --- |
| `ls` | List the current directory, or `ls <path>` |
| `cd` | `cd`, `cd <dir>`, `cd ..`, `cd /`, `cd /projects`, `cd ~/projects/intelliflow` |
| `pwd` | Print the absolute virtual path, such as `/home/lakshay/projects/intelliflow` |
| `cat` | Print a virtual file |
| `open` | Move the portfolio to a section or project case study |
| `whoami` | Name and role |
| `neofetch` | Compact summary taken from real portfolio counts and languages |
| `clear` | Clear output. The working directory stays. |
| `help` | The table above |

`open home`, `open projects`, `open experience`, `open education`, `open skills`, and `open contact` use the workspace's existing section state. `open /education`, `open education/education.txt`, and `open /education/education.txt` open the same Education section. `open projects/intelliflow` and `open projects/keystroke-auth` open those case studies. The page does not reload.

Arrow Up and Arrow Down recall commands from the current page session. Tab completes the public commands and virtual paths. Several matches are printed and the shared prefix is kept.

Unknown input returns `Unknown command. Try help.`

## Virtual filesystem

The tree lives under `/home/lakshay` (`~`):

```text
about.txt
projects/intelliflow/readme.md
projects/keystroke-auth/readme.md
skills/stack.txt
experience/research-intern.txt
education/education.txt
contact/contact.txt
resume.pdf
```

`education/education.txt` is the only education file. `cd education` and `cd /education` both land there. `cat education.txt` prints the same record as the Education section.

`/` contains `home/`. Paths such as `/projects` and `/education` are accepted as aliases of the home directory when that folder exists there. File text is rendered from `profile`, `projects`, `experience`, `education`, and `skills`. `resume.pdf` is not a copy of the PDF; `cat` says to use the RESUME control.

## Navigation integration

`open` returns a section id and, for a case study, a project id. `Workspace` applies that to the same state the sidebar uses. The terminal stays open.

## Security

Input is split into tokens and matched against an allowlist, plus a few exact playful phrases. There is no `eval`, `Function`, subprocess, environment access, or real filesystem access. `rm` does not delete anything. `rm -rf /portfolio` only prints a refusal.

## Easter eggs

These are not listed in `help`:

- `sudo hire lakshay`
- `rm -rf /portfolio`
- `vim resume.txt`
- `npm install motivation`
- `make coffee`
- `git status` (a fixed virtual reply, not a reading of a real repository)

## Accessibility

The toggle and close controls have accessible names. The command field has a label. Output is a log. Opening moves focus to the command field. Closing from the keyboard returns focus to the status-bar control.
