const STORAGE_KEY_PREFIX = "lesson-progress";

export const saveProgress = (lessonId: string, time: number) => {
  localStorage.setItem(`${STORAGE_KEY_PREFIX}-${lessonId}`, time.toString());
};

export const getProgress = (lessonId: string): number => {
  const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}-${lessonId}`);
  return saved ? parseFloat(saved) : 0;
};