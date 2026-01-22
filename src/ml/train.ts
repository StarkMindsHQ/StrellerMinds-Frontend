import * as tf from '@tensorflow/tfjs';

export async function train(model: tf.Sequential) {
  const xs = tf.tensor2d([
    [20, 1],
    [50, 3],
    [80, 5],
  ]);

  const ys = tf.tensor2d([[1], [3], [5]]);

  await model.fit(xs, ys, { epochs: 40 });
}
