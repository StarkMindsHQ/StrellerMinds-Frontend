import * as tf from '@tensorflow/tfjs';

let model: tf.Sequential | null = null;

export async function initModel() {
  model = tf.sequential();

  model.add(
    tf.layers.dense({
      inputShape: [2],
      units: 8,
      activation: 'relu',
    }),
  );

  model.add(tf.layers.dense({ units: 1 }));

  model.compile({
    optimizer: 'adam',
    loss: 'meanSquaredError',
  });

  return model;
}
