import * as tf from '@tensorflow/tfjs';

export function recommendDifficulty(
  model: tf.Sequential,
  skillLevel: number,
  recentScore: number,
): number {
  try {
    const input = tf.tensor2d([[skillLevel, recentScore]]);
    const prediction = model.predict(input) as tf.Tensor;
    return Math.round(prediction.dataSync()[0]);
  } catch {
    return fallbackDifficulty(skillLevel);
  }
}

function fallbackDifficulty(level: number) {
  if (level < 40) return 1;
  if (level < 70) return 3;
  return 5;
}
