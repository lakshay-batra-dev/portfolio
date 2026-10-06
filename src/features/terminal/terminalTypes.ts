export type LineTone = "text" | "dim" | "warn" | "err" | "ok";

export type OutputLine = {
  text: string;
  tone: LineTone;
};

export type PortfolioSection = "home" | "projects" | "experience" | "education" | "skills" | "contact";

export type NavigateRequest = {
  section: PortfolioSection;
  projectId: string | null;
};

export type CommandResult = {
  lines: OutputLine[];
  cwd: string;
  clear?: boolean;
  navigate?: NavigateRequest;
};

export type HistoryState = {
  entries: string[];
  cursor: number;
  draft: string;
};
