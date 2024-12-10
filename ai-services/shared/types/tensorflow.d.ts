declare module '@tensorflow/tfjs-node' {
  export interface Tensor {
    arraySync(): number | number[] | number[][] | number[][][] | number[][][][] | number[][][][][] | number[][][][][][];
    array(): Promise<number | number[] | number[][] | number[][][] | number[][][][] | number[][][][][] | number[][][][][][]>;
    dispose(): void;
  }

  export interface LayersModel {
    predict(inputs: Tensor | Tensor[]): Tensor | Tensor[];
    dispose(): void;
  }

  export function tensor(values: number[] | number[][] | number[][][], shape?: number[]): Tensor;
  export function tensor1d(values: number[]): Tensor;
  export function tensor2d(values: number[][], shape?: [number, number]): Tensor;
  export function tensor3d(values: number[][][], shape?: [number, number, number]): Tensor;
  
  export function matMul(a: Tensor, b: Tensor): Tensor;
  export function loadLayersModel(modelPath: string): Promise<LayersModel>;
  
  export const train: {
    adam: (learningRate?: number) => any;
    sgd: (learningRate?: number) => any;
    rmsprop: (learningRate?: number) => any;
  };
  
  export const losses: {
    meanSquaredError: (yTrue: Tensor, yPred: Tensor) => Tensor;
    absoluteDifference: (yTrue: Tensor, yPred: Tensor) => Tensor;
    computeWeightedLoss: (losses: Tensor, weights?: Tensor) => Tensor;
  };

  export const metrics: {
    binaryAccuracy: (yTrue: Tensor, yPred: Tensor) => Tensor;
    categoricalAccuracy: (yTrue: Tensor, yPred: Tensor) => Tensor;
    precision: (yTrue: Tensor, yPred: Tensor) => Tensor;
    recall: (yTrue: Tensor, yPred: Tensor) => Tensor;
  };
} 