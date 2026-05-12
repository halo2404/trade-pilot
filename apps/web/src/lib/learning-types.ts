export interface LessonSummary {
  id: string;
  title: string;
  order: number;
  completed: boolean;
}

export interface LessonDetail {
  id: string;
  module_id: string;
  title: string;
  content: string;
  order: number;
  completed: boolean;
}

export interface ModuleSummary {
  id: string;
  title: string;
  description: string;
  order: number;
  lesson_count: number;
  completed_count: number;
  has_quiz: boolean;
}

export interface ModuleDetail {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: LessonSummary[];
  lesson_count: number;
  completed_count: number;
  has_quiz: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  order: number;
}

export interface QuizResultItem {
  question: string;
  options: string[];
  your_answer: number;
  correct_index: number;
  explanation: string;
  correct: boolean;
}

export interface QuizResult {
  score: number;
  total: number;
  passed: boolean;
  items: QuizResultItem[];
}

export interface QuizAttemptSummary {
  id: string;
  score: number;
  total: number;
  attempted_at: string;
}

export interface GlossaryEntry {
  id: string;
  term: string;
  definition: string;
  order: number;
}
