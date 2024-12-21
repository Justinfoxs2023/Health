import { ConfigService } from './config.service';
import { Etcd3 } from 'etcd3';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class EtcdConfigService implements OnModuleInit {
  private client: Etcd3;
  private readonly namespace: string;

  constructor(private readonly configService: ConfigService) {
    this.namespace = configService.get('ETCD_NAMESPACE') || 'health';
  }

  async onModuleInit() {
    this.client = new Etcd3({
      hosts: this.configService.get('ETCD_HOSTS').split(','),
      auth: {
        username: this.configService.get('ETCD_USERNAME'),
        password: this.configService.get('ETCD_PASSWORD'),
      },
    });
  }

  async get(key: string): Promise<string> {
    return this.client.get(`${this.namespace}/${key}`).string();
  }

  async put(key: string, value: string): Promise<void> {
    await this.client.put(`${this.namespace}/${key}`).value(value);
  }

  async watch(key: string, callback: (value: string) => void): Promise<void> {
    this.client
      .watch()
      .prefix(`${this.namespace}/${key}`)
      .create()
      .then(watcher => {
        watcher.on('put', response => {
          callback(response.value.toString());
        });
      });
  }
}
