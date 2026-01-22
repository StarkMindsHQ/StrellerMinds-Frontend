export function adaptDifficulty(score: number, currentDifficulty: number) {
  if (score > 80) return currentDifficulty + 1;
  if (score < 40) return currentDifficulty - 1;
  return currentDifficulty;
}
