# DEBUG//LAKSHAY

An interactive software-engineering portfolio designed to feel like a real piece of software rather than a traditional resume website.

## 1. Project Vision

Most developer portfolios follow the same structure:

```text
Name → "I am a Software Engineer" → Skills → Projects → Experience → Contact
```

DEBUG//LAKSHAY takes a different approach.

The website should **demonstrate technical personality through the interface itself**.

The visitor initially encounters a computer-style boot sequence. The system initializes, runs diagnostics, discovers an error, and asks the visitor to solve a small DSA/code debugging problem.

Once the problem is solved — or skipped — the experience transitions into the actual portfolio.

The debugging concept is intentionally limited to the opening experience. After that, the portfolio becomes a normal, easy-to-navigate website with a strong technical visual identity.

## 2. Core User Journey

```text
VISITOR OPENS SITE
        ↓
BOOT SYSTEM
        ↓
SYSTEM INITIALIZATION
        ↓
SYSTEM DIAGNOSTICS
        ↓
⚠ ERROR FOUND
        ↓
DSA DEBUGGING CHALLENGE
        ↓
   ┌────┴────┐
   ↓         ↓
 SOLVE      SKIP
   └────┬────┘
        ↓
SYSTEM RESTORED
        ↓
MAIN PORTFOLIO
        ↓
Projects · Experience · Skills · GitHub · Resume · Contact
```

The opening should create curiosity. The main portfolio should create confidence.

## 3. Opening Experience

### Boot System

The website initially appears as an old-school computer/terminal environment.

The boot should contain:

- system initialization
- project registry initialization
- profile initialization
- diagnostic engine initialization
- application preparation
- subtle developer-oriented easter eggs
- final system diagnostics

Example:

```text
DEBUG//LAKSHAY

> Initializing portfolio kernel...
✓ Portfolio kernel initialized

> Loading project registry...
✓ Project registry loaded

> Loading engineering profile...
✓ Profile loaded

> Initializing diagnostic engine...
✓ Diagnostic engine ready

> Running system diagnostics...
⚠ 3 anomalies detected
```

The boot should take approximately 4–6 seconds and should not become frustrating.

There is no skip button for the boot.

## 4. Debugging Challenge

After the boot sequence, the system reports an error.

The visitor is shown a small DSA/code problem containing an intentional bug.

The idea is deliberately simple:

> Find the small thing that is wrong.

For example:

```cpp
for (int i = 0; i <= nums.size(); i++)
```

The visitor needs to recognize that:

```cpp
i <= nums.size()
```

should be:

```cpp
i < nums.size()
```

The exact challenge will be decided during implementation.

The challenge should feel like a real code-debugging environment rather than a conventional quiz.

Possible interaction:

- click the problematic line
- edit a small part of the code
- submit the fix
- receive immediate validation

The preferred eventual implementation is an actual editable code environment using Monaco Editor.

## 5. Skip Option

The debugging challenge is intentionally playful.

Visitors who don't want to solve it should not be blocked from seeing the portfolio.

There should be a humorous skip option such as:

```text
[ DEBUG ]

[ I'm dumb, let me in → ]
```

or a similarly understated variation.

Clicking it immediately transitions to the main portfolio.

The challenge is an invitation to interact, not a gatekeeper.

## 6. Main Portfolio

Once the visitor solves or skips the debugging challenge, the debugging experience ends.

The main portfolio should NOT continue requiring the visitor to solve puzzles.

It becomes a clean, professional portfolio.

Planned sections:

```text
HOME
PROJECTS
EXPERIENCE
SKILLS
GITHUB / ENGINEERING ACTIVITY
RESUME
CONTACT
```

The exact navigation structure can evolve during implementation.

## 7. Main Portfolio Design Philosophy

The main website should still feel distinctly technical.

However, it should not look like:

- a generic terminal website
- a fake hacker interface
- a retro computer everywhere
- a template with green text
- a collection of programming logos

Instead, the design should communicate engineering through actual interface elements.

Examples:

- interactive architecture diagrams
- system visualizations
- technical project breakdowns
- code snippets
- API structures
- GitHub activity
- project metrics
- dependency relationships
- interactive components
- thoughtful micro-interactions

The boot establishes the personality.

The portfolio demonstrates the engineering.

## 8. Visual Language

The overall visual language should evolve from the boot experience into a modern engineering interface.

### Boot

Strongly terminal-inspired:

- black/dark background
- monospace typography
- CRT influence
- system logs
- diagnostic states
- subtle scanlines
- restrained green/amber/red accents

### Main portfolio

Modern interpretation of that language:

- dark or neutral technical UI
- precise typography
- structured layouts
- thin borders
- restrained colors
- system-like information hierarchy
- subtle animations
- interactive technical visualizations

The website should feel like:

> A modern software engineer's workstation.

Not:

> A 1980s hacker movie.

## 9. Project Showcase

Projects are one of the most important parts of the portfolio.

Projects should not simply be displayed as cards containing:

```text
Project Name
Description
React / Node / Python
```

Instead, each important project should have a technical case study.

A project can contain:

```text
PROJECT
├── Overview
├── Problem
├── Architecture
├── Implementation
├── Technologies
├── Engineering Decisions
├── Challenges
├── Results
├── GitHub
└── Live Demo
```

For example, IntelliFlow could show an interactive architecture:

```text
User
 │
 ▼
React / TypeScript
 │
 ▼
Express API
 │
 ├──────────────┐
 ▼              ▼
Authentication  Workflow Engine
 │              │
 ▼              ▼
MongoDB       LangGraph
```

Individual components can eventually be interactive.

## 10. Interactive Architecture

For selected projects, architecture should be more than a static image.

Visitors could click components.

For example, clicking `LangGraph` could reveal:

```text
Workflow orchestration

Responsible for:
- workflow state
- transitions
- dependencies
- execution logic
```

This allows the portfolio to demonstrate understanding rather than merely list technologies.

React Flow is a possible implementation for this component.

## 11. Engineering Activity

The portfolio can eventually integrate real public GitHub data.

Potential information:

- repositories
- recent commits
- contribution activity
- project links
- repository statistics

The goal is to make the portfolio feel alive rather than completely static.

This should only be added after the core portfolio works.

## 12. Skills

Skills should not simply be presented as a giant list.

Where appropriate, connect technologies to actual work.

Example:

```text
                  SOFTWARE ENGINEERING
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
       FRONTEND          BACKEND            AI
          │                │                │
     React / TS        Node / APIs       PyTorch
          │                │                │
          └────────┬───────┘                │
                   ▼                        ▼
               IntelliFlow          Keystroke Auth
```

The principle is:

> A technology should ideally be associated with something actually built or used.

## 13. Experience

Experience should focus on what was built, solved, researched, or learned rather than simply reproducing a resume timeline.

The detailed content will be populated from verified personal information rather than invented content.

## 14. Resume

The resume must remain easily accessible.

There should always be a straightforward path to:

```text
RESUME
↓
View / Download
```

The interactive nature of the portfolio must never make basic recruiter actions difficult.

## 15. Contact

The final portfolio should make contacting Lakshay simple.

Possible actions:

```text
GitHub
LinkedIn
Email
Resume
```

Avoid unnecessarily complicated contact interactions.

## 16. Easter Eggs

The website can contain subtle developer-oriented easter eggs.

Examples:

```text
$ help

commands:
  about
  projects
  skills
  resume
  debug
```

Or:

```text
> Checking caffeine levels...
✓ System operational
```

Easter eggs should reward curiosity without becoming the primary interface.

## 17. Technology Stack

The project should be completely free to build and deploy.

Recommended stack:

```text
Frontend
────────
Next.js
React
TypeScript
Tailwind CSS

Interaction
───────────
Motion / Framer Motion
Monaco Editor
React Flow
Lucide React

Data
────
TypeScript / JSON
GitHub API when needed

Version Control
───────────────
Git
GitHub

Deployment
──────────
Vercel Hobby
```

No paid services are required for the core project.

A database is not required initially.

A separate backend is not required initially.

## 18. Architecture Principles

The application should be modular.

Expected high-level structure:

```text
src/
├── app/
├── components/
│   ├── boot/
│   ├── debugger/
│   ├── layout/
│   ├── navigation/
│   ├── home/
│   ├── projects/
│   ├── experience/
│   ├── skills/
│   └── contact/
├── data/
│   ├── projects.ts
│   ├── challenges.ts
│   ├── experience.ts
│   └── skills.ts
└── lib/
```

The exact structure can be adjusted based on implementation requirements.

The important principle is separation of:

- content
- UI
- application state
- external integrations
- reusable components

## 19. Component Development Order

### Component 1 — Boot System

```text
Website opening
→ terminal boot
→ genuine initialization
→ diagnostics
→ transition
```

### Component 2 — DSA Debugging Challenge

```text
Diagnostic error
→ code problem
→ identify/fix bug
→ validation
→ skip option
→ system restored
```

### Component 3 — Portfolio Shell

```text
Navigation
Home
Layout
Responsive structure
```

### Component 4 — Projects

```text
Project listing
Project details
Architecture
Technical decisions
Results
```

### Component 5 — Experience / Skills

```text
Engineering history
Technology relationships
```

### Component 6 — GitHub Integration

```text
Repositories
Activity
Project links
```

### Component 7 — Resume / Contact

```text
Resume
GitHub
LinkedIn
Email
```

### Component 8 — Polish

```text
Animations
Micro-interactions
Easter eggs
Accessibility
Mobile
Performance
SEO
```

## 20. Development Philosophy

The website itself should be treated as a software project.

Build it incrementally.

For every major component:

1. Define its purpose.
2. Define its UX.
3. Define its data/state requirements.
4. Implement it.
5. Test it.
6. Refactor it.
7. Commit it.
8. Move to the next component.

Every stage should leave the website in a working state.

## 21. Cursor Development Strategy

Cursor will be used as the primary development assistant.

Cursor should receive focused prompts for individual components.

This README defines the overall product vision.

Individual component specification files will define detailed implementation requirements.

When implementing a component, Cursor should read:

1. `README.md`
2. The relevant component specification
3. Existing source code

It should not unnecessarily modify unrelated components.

## 22. Important Product Constraints

The portfolio must:

- remain free to build and deploy
- be responsive
- be fast
- be accessible
- avoid unnecessary dependencies
- avoid fake technical claims
- use real project information
- avoid excessive gimmicks
- remain easy for recruiters to navigate
- demonstrate engineering through actual functionality
- work without requiring a login
- degrade gracefully if external APIs fail

## 23. What Makes This Portfolio Different

The differentiator is not simply the visual design.

The differentiator is the combination of:

```text
Interactive opening
        +
Actual debugging
        +
Real engineering projects
        +
Interactive architecture
        +
Real development activity
        +
Technical storytelling
```

The opening makes the portfolio memorable.

The projects make it credible.

The engineering details make it impressive.

The normal navigation makes it practical.

## 24. Final Experience

The intended final experience should feel approximately like:

```text
┌──────────────────────────────────────┐
│                                      │
│          DEBUG//LAKSHAY              │
│                                      │
│     INITIALIZING SYSTEM...           │
│                                      │
└──────────────────────────────────────┘
                 │
                 ▼
        ⚠ ANOMALY DETECTED
                 │
                 ▼
       ┌────────────────────┐
       │  FIND THE BUG       │
       │                     │
       │  [ code editor ]    │
       │                     │
       │  [ DEBUG ]          │
       │                     │
       │  I'm dumb → skip    │
       └────────────────────┘
                 │
                 ▼
          SYSTEM RESTORED
                 │
                 ▼
┌──────────────────────────────────────┐
│ LAKSHAY BATRA                        │
│ Software Engineer                    │
│                                      │
│ Projects   Experience   GitHub       │
│                                      │
│ ┌──────────┐ ┌──────────┐            │
│ │IntelliFlow│ │ ML/Auth │            │
│ └──────────┘ └──────────┘            │
│                                      │
└──────────────────────────────────────┘
```

The visitor should leave with the impression:

> "This person doesn't just know how to make a portfolio. They like building software."

## 25. Current Implementation Target

The first implementation milestone is intentionally narrow:

**Build the Boot System.**

Nothing beyond the boot system should be implemented until it is working correctly.

The boot should establish the visual language and technical foundation for everything that follows.

The next component will be the DSA debugging challenge.
