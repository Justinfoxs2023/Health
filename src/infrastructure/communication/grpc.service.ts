import { Injectable } from '@nestjs/common';
import { Client } from '@nestjs/microservices';
import { ClientGrpc, GrpcOptions } from '@nestjs/microservices';
import type { Observable } from 'rxjs';

@Injectable()
export class GrpcService {
  @Client()
  private readonly client: ClientGrpc;

  constructor(private readonly options: GrpcOptions) {}

  createClient<T>(service: string): T {
    return this.client.getService<T>(service);
  }

  handleCall<T>(call: Observable<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      call.subscribe({
        next: (data: T) => resolve(data),
        error: (error: Error) => reject(error),
        complete: () => {}
      });
    });
  }

  async healthCheck(service: string): Promise<boolean> {
    try {
      const healthService = this.createClient<any>('HealthCheck');
      const response = await this.handleCall<{ status: string }>(healthService.check({}));
      return response.status === 'SERVING';
    } catch (error) {
      return false;
    }
  }
}
