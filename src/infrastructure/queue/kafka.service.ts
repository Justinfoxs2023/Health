import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { ConfigService } from '../config/config.service';

@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor(private readonly config: ConfigService) {
    this.kafka = new Kafka({
      clientId: config.get('SERVICE_NAME'),
      brokers: config.get('KAFKA_BROKERS').split(',')
    });
  }

  async onModuleInit() {
    await this.initializeProducer();
    await this.initializeConsumer();
  }

  private async initializeProducer() {
    this.producer = this.kafka.producer();
    await this.producer.connect();
  }

  private async initializeConsumer() {
    this.consumer = this.kafka.consumer({ groupId: this.config.get('SERVICE_NAME') });
    await this.consumer.connect();
  }

  async sendMessage(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }]
    });
  }

  async subscribe(topic: string, handler: (message: any) => Promise<void>) {
    await this.consumer.subscribe({ topic });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        await handler(JSON.parse(message.value.toString()));
      }
    });
  }
} 