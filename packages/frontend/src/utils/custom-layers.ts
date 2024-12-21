import * as tf from '@tensorflow/tfjs';

export class CustomAttentionLayer extends tf.layers.Layer {
  private units: number;

  constructor(config: { units: number }) {
    super(config);
    this.units = config.units;
  }

  build(inputShape: tf.Shape | tf.Shape[]): void {
    const shape = inputShape as tf.Shape;
    const inputDim = shape[shape.length - 1];

    this.addWeight('W', [inputDim, this.units], 'float32', tf.initializers.glorotUniform({}));
    this.addWeight('V', [this.units, 1], 'float32', tf.initializers.glorotUniform({}));
  }

  call(inputs: tf.Tensor | tf.Tensor[], kwargs: any): tf.Tensor | tf.Tensor[] {
    return tf.tidy(() => {
      const input = inputs as tf.Tensor;
      const W = this.getWeights()[0];
      const V = this.getWeights()[1];

      // 计算注意力分数
      const score = tf.tanh(tf.dot(input, W));
      const attentionWeights = tf.softmax(tf.dot(score, V), -1);

      // 应用注意力权重
      return tf.mul(input, attentionWeights);
    });
  }

  computeOutputShape(inputShape: tf.Shape | tf.Shape[]): tf.Shape | tf.Shape[] {
    return inputShape;
  }

  getConfig(): any {
    const config = super.getConfig();
    return {
      ...config,
      units: this.units,
    };
  }

  static className = 'CustomAttentionLayer';
}
