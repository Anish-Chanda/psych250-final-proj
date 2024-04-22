enum Category {
  communication = "communication",
  hiring = "hiring",
  leadership = "leadership",
  motivation = "motivation",
  organizationalCulture = "organizationalCulture",
}
export type APIResp = {
  startupName: string;
  startupSummary: string;
  scenarios: Scenario[];
};

export type Scenario = {
  question: string;
  choices: string[];
  correctAnswer: number;
  reason: string;
  category: Category;
};

export type Startup = {
  startupName: string;
  startupSummary: string;
};

export type Scores = {
  hiring: number;
  leadership: number;
  motivation: number;
  organizationalCulture: number;
  communication: number;
};

