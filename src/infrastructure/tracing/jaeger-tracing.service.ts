import { ConfigService } from '../config/config.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { initTracer, JaegerTracer } from 'jaeger-client';

@Injectable()
export class JaegerTracingService implements OnModuleInit {
  private tracer: JaegerTracer;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    this.initializeTracer();
  }

  private initializeTracer() {
    const config = {
      serviceName: this.config.get('SERVICE_NAME'),
      sampler: {
        type: 'probabilistic',
        param: 0.1,
      },
      reporter: {
        logSpans: true,
        agentHost: this.config.get('JAEGER_AGENT_HOST'),
        agentPort: parseInt(this.config.get('JAEGER_AGENT_PORT')),
      },
    };

    this.tracer = initTracer(config);
  }

  startSpan(operationName: string, tags?: Record<string, any>) {
    return this.tracer.startSpan(operationName, { tags });
  }

  injectContext(span: any, format: string, carrier: any) {
    this.tracer.inject(span, format, carrier);
  }
}
