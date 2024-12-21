import { IPostureAnalysis } from '../types/models';
import { Schema, model } from 'mongoose';

const postureAnalysisSchema = new Schema<IPostureAnalysis>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  exerciseType: {
    type: String,
    required: true,
    enum: ['跑步', '深蹲', '硬拉', '卧推', '引体向上', '其他'],
  },

  videoUrl: {
    type: String,
    required: true,
  },

  keypoints: [
    {
      timestamp: Number,
      points: [
        {
          name: String,
          x: Number,
          y: Number,
          confidence: Number,
        },
      ],
    },
  ],

  analysis: {
    score: Number,
    jointAngles: [
      {
        joint: String,
        angle: Number,
        standard: Number,
        deviation: Number,
      },
    ],
    trajectory: {
      smoothness: Number,
      stability: Number,
      symmetry: Number,
    },
    issues: [
      {
        timestamp: Number,
        type: String,
        description: String,
        severity: String,
        suggestion: String,
      },
    ],
  },

  recommendations: [
    {
      aspect: String,
      description: String,
      exercises: [
        {
          name: String,
          description: String,
          videoUrl: String,
        },
      ],
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const PostureAnalysis = model<IPostureAnalysis>('PostureAnalysis', postureAnalysisSchema);
