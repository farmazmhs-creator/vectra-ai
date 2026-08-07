import type { Answers, DimensionCode, Route } from "./types";

export interface Option {
  code: string;
  label: string;
  value?: number; // 0-4 for scored questions
}

export type QuestionType = "single" | "multi" | "text";

export interface Question {
  code: string;
  section: string;
  type: QuestionType;
  prompt: string;
  help?: string;
  scored: boolean;
  dimension?: DimensionCode; // for scored single-selects
  options?: Option[];
  maxSelect?: number;
  maxLen?: number;
  optional?: boolean;
  // Whether this question should be shown for the given answers/route
  show?: (a: Answers, route: Route) => boolean;
}

export const DIMENSION_LABELS: Record<DimensionCode, string> = {
  D1: "AI Understanding & Practical Competency",
  D2: "LLM / AI Tool Access & Investment",
  D3: "Adoption & Actual Usage",
  D4: "Workflow & Process Integration",
  D5: "Responsible Use, Data & Governance",
  D6: "Leadership / Direction / Enablement",
  D7: "Workforce Capability & Change Readiness",
  D8: "Measurement, Value & Scale",
};

const scale = (labels: [string, string, string, string, string]): Option[] =>
  labels.map((label, i) => ({ code: String(i), label, value: i }));

export const ROUTE_LABELS: Record<Route, string> = {
  individual: "Individual AI Capability Profile",
  team: "Team AI Capability Assessment",
  organisation: "Organisation AI Readiness Snapshot",
  client: "Client Assessment",
};

// Approx 12-15 core interactions. Structured-first per PRD §10.4A.
export const QUESTIONS: Question[] = [
  {
    code: "Q1",
    section: "Access & Investment",
    type: "single",
    scored: true,
    dimension: "D2",
    prompt: "Which best describes the AI / LLM tools currently available to you or the people being assessed?",
    options: scale([
      "No AI / LLM tools are currently approved or provided",
      "People mainly use free or personally sourced public AI tools",
      "One or more tools are approved, but access is limited or inconsistent",
      "Licensed / enterprise AI tools are available to the relevant users",
      "Enterprise AI tools are broadly available and intentionally embedded into work",
    ]),
  },
  {
    code: "Q1b",
    section: "Access & Investment",
    type: "multi",
    scored: false,
    prompt: "Which tools are currently used or available?",
    help: "Used for tool-specific recommendations — not scored.",
    maxSelect: 9,
    options: [
      { code: "chatgpt", label: "ChatGPT" },
      { code: "copilot", label: "Microsoft Copilot" },
      { code: "gemini", label: "Google Gemini" },
      { code: "claude", label: "Claude" },
      { code: "perplexity", label: "Perplexity" },
      { code: "internal", label: "Internal / custom LLM or AI assistant" },
      { code: "builtin", label: "AI features built into business software" },
      { code: "other", label: "Other" },
      { code: "none", label: "None" },
    ],
  },
  {
    code: "Q2",
    section: "Adoption",
    type: "single",
    scored: true,
    dimension: "D3",
    prompt: "How often is AI used for meaningful work or learning tasks?",
    options: scale([
      "Never",
      "Rarely / experimentation only",
      "A few times per month",
      "Weekly or several times per week",
      "Routinely as part of daily / recurring work",
    ]),
  },
  {
    code: "Q3",
    section: "Adoption",
    type: "single",
    scored: true,
    dimension: "D3",
    prompt: "How broadly is AI being applied?",
    options: scale([
      "No practical use cases",
      "Mainly basic writing / rewriting / simple questions",
      "Several personal productivity tasks",
      "Multiple role-specific tasks (analysis, research, planning, reporting, support)",
      "Multiple repeatable workflows or cross-functional use cases",
    ]),
  },
  {
    code: "Q4",
    section: "Competency",
    type: "single",
    scored: true,
    dimension: "D1",
    prompt: "How confident are users in giving AI clear instructions, refining outputs and obtaining consistent results?",
    options: scale([
      "Do not know how to use AI effectively",
      "Mostly trial and error",
      "Can write basic prompts but results vary",
      "Can structure, refine and iterate prompts effectively",
      "Can create reusable prompting methods, templates or assistants",
    ]),
  },
  {
    code: "Q5",
    section: "Responsible Use",
    type: "single",
    scored: true,
    dimension: "D5",
    prompt: "How consistently are AI outputs checked before being relied on?",
    options: scale([
      "Outputs may be accepted without checking",
      "Checking is inconsistent",
      "Important outputs are usually reviewed",
      "Users routinely verify facts, calculations, sources or assumptions",
      "Verification is built into defined working practices / quality controls",
    ]),
  },
  {
    code: "Q6",
    section: "Responsible Use",
    type: "single",
    scored: true,
    dimension: "D5",
    prompt: "How clear are the rules for what information may or may not be used with AI tools?",
    options: scale([
      "No awareness / no guidance",
      "People decide individually",
      "General guidance exists but is not consistently understood",
      "Approved tools and data-handling expectations are clear",
      "Governance, permissions and safe-use practices are embedded and reinforced",
    ]),
  },
  {
    code: "Q7",
    section: "Workflow",
    type: "single",
    scored: true,
    dimension: "D4",
    prompt: "How integrated is AI into recurring work processes?",
    options: scale([
      "Not used in workflows",
      "Ad-hoc individual use only",
      "Useful tasks are repeated manually with AI",
      "Reusable prompts, templates, agents or defined AI-assisted steps are used",
      "AI-supported workflows are standardised, measured or connected across steps",
    ]),
  },
  {
    code: "Q8",
    section: "Pain / Opportunity",
    type: "multi",
    scored: false,
    prompt: "Where is the biggest opportunity for improvement today?",
    help: "Select up to three.",
    maxSelect: 3,
    options: [
      { code: "repetitive", label: "Repetitive manual work" },
      { code: "drafting", label: "Too much time drafting / rewriting" },
      { code: "research", label: "Research and information gathering" },
      { code: "reporting", label: "Reporting and analysis" },
      { code: "data", label: "Data interpretation" },
      { code: "comms", label: "Customer / stakeholder communication" },
      { code: "turnaround", label: "Slow turnaround / SLA pressure" },
      { code: "quality", label: "Inconsistent quality or rework" },
      { code: "prioritisation", label: "Prioritisation and task management" },
      { code: "knowledge", label: "Knowledge trapped with a few people" },
      { code: "handoffs", label: "Process handoffs / coordination" },
      { code: "confidence", label: "Lack of AI confidence" },
      { code: "adoption", label: "Low AI adoption" },
      { code: "governance", label: "Lack of clear AI governance" },
      { code: "underused", label: "Underused AI licences / tools" },
      { code: "usecases", label: "Difficulty identifying practical use cases" },
    ],
  },
  {
    code: "Q9",
    section: "Leadership",
    type: "single",
    scored: true,
    dimension: "D6",
    prompt: "How actively does leadership (or your own direction/support) enable practical AI adoption?",
    options: scale([
      "AI is not currently discussed or supported",
      "Interest exists but there is no clear direction",
      "Some encouragement / pilots exist",
      "Leaders actively support approved AI use and capability building",
      "AI adoption is connected to priorities, ownership and measurable outcomes",
    ]),
  },
  {
    code: "Q10",
    section: "Capability",
    type: "single",
    scored: true,
    dimension: "D7",
    prompt: "How prepared are the relevant people to use AI effectively in their roles?",
    options: scale([
      "No structured capability exists",
      "A few self-taught users / champions only",
      "Basic awareness exists but practical skill varies significantly",
      "Relevant users have received practical role-based development",
      "Capability is continuously developed, shared and reinforced",
    ]),
  },
  {
    code: "Q11a",
    section: "Investment Value",
    type: "single",
    scored: true,
    dimension: "D8",
    prompt: "How much value is currently being realised from the AI-tool investment?",
    help: "Shown when an approved / licensed AI tool exists.",
    show: (a) => Number(a["Q1"] ?? 0) >= 2,
    options: scale([
      "Tool is available but barely used",
      "Some logins / experimentation but little practical value",
      "Useful individual productivity gains are visible",
      "Multiple teams / roles use it for meaningful recurring work",
      "Usage is connected to standard workflows, capability plans and measured outcomes",
    ]),
  },
  {
    code: "Q11b",
    section: "Investment Value",
    type: "single",
    scored: false,
    prompt: "What best explains why no formal AI / LLM investment has been made yet?",
    help: "Diagnostic only — this does not reduce your score.",
    show: (a) => Number(a["Q1"] ?? 0) < 2,
    options: [
      { code: "exploring", label: "Still exploring options" },
      { code: "case", label: "Unclear business case" },
      { code: "budget", label: "Budget / commercial constraint" },
      { code: "security", label: "Security / privacy concern" },
      { code: "policy", label: "IT / policy restriction" },
      { code: "capability", label: "Lack of internal capability" },
      { code: "priority", label: "Leadership has not prioritised it" },
      { code: "sufficient", label: "Current tools are considered sufficient" },
    ],
  },
  {
    code: "Q12",
    section: "Measurement",
    type: "single",
    scored: true,
    dimension: "D8",
    prompt: "How is the impact of AI use currently measured?",
    options: scale([
      "Not measured",
      "Anecdotal feedback only",
      "Individual examples / time saved are occasionally captured",
      "Selected use cases have defined success measures",
      "Capability, adoption and operational outcomes are reviewed systematically",
    ]),
  },
  {
    code: "Q13",
    section: "Desired Outcomes",
    type: "multi",
    scored: false,
    prompt: "What would make AI training worthwhile for you?",
    help: "Select up to three.",
    maxSelect: 3,
    options: [
      { code: "ind_prod", label: "Improve individual productivity" },
      { code: "team_prod", label: "Improve team productivity" },
      { code: "reduce_manual", label: "Reduce repetitive manual effort" },
      { code: "turnaround", label: "Improve turnaround / SLA performance" },
      { code: "quality", label: "Improve quality / reduce rework" },
      { code: "reporting", label: "Improve reporting and analysis" },
      { code: "decisions", label: "Improve decision support" },
      { code: "cx", label: "Improve customer / stakeholder experience" },
      { code: "confidence", label: "Build practical AI confidence" },
      { code: "adoption", label: "Increase adoption of existing AI tools" },
      { code: "value", label: "Get more value from licensed AI platforms" },
      { code: "responsible", label: "Improve responsible / safe AI use" },
      { code: "automation", label: "Identify workflow automation opportunities" },
      { code: "champions", label: "Build internal AI champions" },
      { code: "leaders", label: "Prepare managers / leaders to guide AI adoption" },
      { code: "future", label: "Develop future-ready workforce capability" },
    ],
  },
  {
    code: "FT1",
    section: "Desired Outcomes",
    type: "text",
    scored: false,
    prompt: "In one sentence, what would make AI training worthwhile for you?",
    help: "Used to personalise your report — not scored. Max 200 characters.",
    maxLen: 200,
  },
  {
    code: "Q14",
    section: "Learner Group",
    type: "multi",
    scored: false,
    prompt: "Who most needs capability development first?",
    help: "Select all that apply.",
    maxSelect: 5,
    options: [
      { code: "myself", label: "Myself" },
      { code: "frontline", label: "Frontline / operational employees" },
      { code: "specialists", label: "Specialists / analysts" },
      { code: "teamleads", label: "Team leads / supervisors" },
      { code: "managers", label: "Managers" },
      { code: "leadership", label: "Senior management / leadership" },
      { code: "ld", label: "L&D" },
      { code: "talent", label: "Talent Development / Talent Management" },
      { code: "hr", label: "HR / People & Culture" },
      { code: "orgwide", label: "Multiple levels / organisation-wide" },
      { code: "notsure", label: "Not sure yet" },
    ],
  },
  {
    code: "Q15cap",
    section: "Future Capability",
    type: "multi",
    scored: false,
    prompt: "Which capabilities should the learner(s) be able to demonstrate after training?",
    help: "Select up to four.",
    maxSelect: 4,
    options: [
      { code: "confident_use", label: "Use an approved AI tool confidently for relevant work" },
      { code: "instruct", label: "Give AI clear, structured instructions and refine outputs" },
      { code: "verify", label: "Verify AI outputs and apply human judgement" },
      { code: "safe", label: "Use AI safely within data, privacy and governance requirements" },
      { code: "role_tasks", label: "Apply AI to role-specific recurring tasks" },
      { code: "reusable", label: "Create reusable prompts, templates or assistants" },
      { code: "workflow", label: "Identify suitable AI-assisted workflow opportunities" },
      { code: "analysis", label: "Improve analysis, reporting or decision support with AI" },
      { code: "comms", label: "Improve customer / stakeholder communication with AI" },
      { code: "lead", label: "Managers / leaders can guide responsible AI adoption" },
      { code: "consistent", label: "Teams can use AI more consistently across common work" },
      { code: "measure", label: "Measure whether AI adoption produces useful outcomes" },
    ],
  },
  {
    code: "Q15ev",
    section: "Future Capability",
    type: "multi",
    scored: false,
    prompt: "What evidence would show the training gap has been successfully closed?",
    help: "Select all that matter.",
    maxSelect: 6,
    options: [
      { code: "demo", label: "Participant demonstrates the required skill during training" },
      { code: "artifact", label: "Participant produces a validated prompt / template / assistant" },
      { code: "applied", label: "Participant applies a learning at work within 7–14 days" },
      { code: "manager", label: "Manager / supervisor confirms workplace application" },
      { code: "prepost", label: "Pre-vs-post capability assessment improves" },
      { code: "usage", label: "Approved AI usage increases appropriately" },
      { code: "task", label: "A recurring task is performed more effectively with AI" },
      { code: "workflow", label: "A suitable workflow opportunity is identified and validated" },
      { code: "quality", label: "Quality / rework / turnaround improves where measurable" },
      { code: "usecase", label: "A role-specific AI use case is implemented" },
      { code: "discovery", label: "Not sure yet — agree success measures during discovery" },
    ],
  },
];

export function visibleQuestions(a: Answers, route: Route): Question[] {
  return QUESTIONS.filter((q) => (q.show ? q.show(a, route) : true));
}

export function optionLabel(code: string, optionCode: string): string {
  const q = QUESTIONS.find((x) => x.code === code);
  const o = q?.options?.find((x) => x.code === optionCode);
  return o?.label ?? optionCode;
}

export function optionLabels(code: string, optionCodes: string[]): string[] {
  return optionCodes.map((c) => optionLabel(code, c));
}
