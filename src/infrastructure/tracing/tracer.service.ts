import { Injectable } from '@nestjs/common';
import { initTracer, JaegerTracer } from 'jaeger-client';
import { ConfigService } from '../config/config.service';

@Injectable()
export class TracerService {
  private tracer: JaegerTracer;

  constructor(private readonly config: ConfigService) {
    this.initializeTracer();
  }

  private initializeTracer() {
    const config = {
      serviceName: this.config.get('SERVICE_NAME'),
      sampler: {
        type: 'const',
        param: 1,
      },
      reporter: {
        logSpans: true,
        agentHost: this.config.get('JAEGER_AGENT_HOST'),
        agentPort: parseInt(this.config.get('JAEGER_AGENT_PORT')),
      },
    };

    this.tracer = initTracer(config);
  }

  startSpan(operationName: string) {
    return this.tracer.startSpan(operationName);
  }

  injectTraceInfo(span: any, format: string, carrier: any) {
    this.tracer.inject(span, format, carrier);
  }
} 