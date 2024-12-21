import { Component } from '../schemas/component.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class PerformanceService {
  constructor(@InjectModel() private componentModel: Model<Component>) {}

  async trackPerformance(
    componentName: string,
    metrics: {
      renderTime: number;
      memoryUsage: number;
    },
  ) {
    await this.componentModel.findOneAndUpdate(
      { name: componentName },
      {
        $push: {
          'performance.history': {
            ...metrics,
            timestamp: new Date(),
          },
        },
      },
    );
  }

  async getPerformanceReport(componentName: string) {
    const component = await this.componentModel.findOne({ name: componentName });
    return component?.performance?.history || [];
  }
}
