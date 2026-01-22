export function evaluateSkill(correct: number, total: number): number {
  return Math.round((correct / total) * 100);
}
