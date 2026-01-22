export type Skill = {
  id: string;
  name: string;
  level: number; // 0 - 100
};

export type UserLearningProfile = {
  id: string;
  goals: string[];
  skills: Skill[];
  learningPattern?: 'fast' | 'balanced' | 'deep';
};

export type LearningContent = {
  id: string;
  title: string;
  skill: string;
  difficulty: number; // 1–5
  duration: number;
};
