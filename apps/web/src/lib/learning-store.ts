import { create } from "zustand";
import { api } from "./api";
import type {
  GlossaryEntry,
  LessonDetail,
  ModuleDetail,
  ModuleSummary,
  QuizQuestion,
  QuizResult,
} from "./learning-types";

interface LearningState {
  modules: ModuleSummary[];
  modulesLoading: boolean;
  currentModule: ModuleDetail | null;
  moduleLoading: boolean;
  currentLesson: LessonDetail | null;
  lessonLoading: boolean;
  quizQuestions: QuizQuestion[];
  quizLoading: boolean;
  glossary: GlossaryEntry[];
  glossaryLoading: boolean;

  fetchModules: () => Promise<void>;
  fetchModule: (moduleId: string) => Promise<void>;
  fetchLesson: (lessonId: string) => Promise<void>;
  completeLesson: (lessonId: string) => Promise<void>;
  fetchQuiz: (moduleId: string) => Promise<void>;
  submitQuiz: (moduleId: string, answers: number[]) => Promise<QuizResult>;
  fetchGlossary: () => Promise<void>;
}

export const useLearningStore = create<LearningState>((set) => ({
  modules: [],
  modulesLoading: false,
  currentModule: null,
  moduleLoading: false,
  currentLesson: null,
  lessonLoading: false,
  quizQuestions: [],
  quizLoading: false,
  glossary: [],
  glossaryLoading: false,

  fetchModules: async () => {
    set({ modulesLoading: true });
    try {
      const { data } = await api.get<ModuleSummary[]>("/learning/modules");
      set({ modules: data });
    } finally {
      set({ modulesLoading: false });
    }
  },

  fetchModule: async (moduleId: string) => {
    set({ moduleLoading: true });
    try {
      const { data } = await api.get<ModuleDetail>(`/learning/modules/${moduleId}`);
      set({ currentModule: data });
    } finally {
      set({ moduleLoading: false });
    }
  },

  fetchLesson: async (lessonId: string) => {
    set({ lessonLoading: true });
    try {
      const { data } = await api.get<LessonDetail>(`/learning/lessons/${lessonId}`);
      set({ currentLesson: data });
    } finally {
      set({ lessonLoading: false });
    }
  },

  completeLesson: async (lessonId: string) => {
    await api.post(`/learning/lessons/${lessonId}/complete`);
    set((state) => ({
      currentLesson: state.currentLesson?.id === lessonId
        ? { ...state.currentLesson, completed: true }
        : state.currentLesson,
      currentModule: state.currentModule
        ? {
            ...state.currentModule,
            lessons: state.currentModule.lessons.map((l) =>
              l.id === lessonId ? { ...l, completed: true } : l
            ),
            completed_count: state.currentModule.lessons.filter(
              (l) => l.completed || l.id === lessonId
            ).length,
          }
        : null,
    }));
  },

  fetchQuiz: async (moduleId: string) => {
    set({ quizLoading: true });
    try {
      const { data } = await api.get<QuizQuestion[]>(`/learning/modules/${moduleId}/quiz`);
      set({ quizQuestions: data });
    } finally {
      set({ quizLoading: false });
    }
  },

  submitQuiz: async (moduleId: string, answers: number[]) => {
    const { data } = await api.post<QuizResult>(`/learning/modules/${moduleId}/quiz`, { answers });
    return data;
  },

  fetchGlossary: async () => {
    set({ glossaryLoading: true });
    try {
      const { data } = await api.get<GlossaryEntry[]>("/learning/glossary");
      set({ glossary: data });
    } finally {
      set({ glossaryLoading: false });
    }
  },
}));
