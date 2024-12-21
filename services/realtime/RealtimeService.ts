/**
 * @fileoverview TS 文件 RealtimeService.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

@Injectable()
export class RealtimeService {
  private readonly connections: Map<string, WebSocket>;

  constructor(
    private readonly messageQueue: MessageQueue,
    private readonly presenceService: PresenceService,
  ) {
    this.connections = new Map();
  }

  async handleConnection(userId: string, socket: WebSocket) {
    // 保存连接
    this.connections.set(userId, socket);

    // 更新在线状态
    await this.presenceService.setOnline(userId);

    // 订阅消息
    await this.subscribeToMessages(userId, socket);
  }

  async broadcast(channel: string, message: any) {
    // 广播消息给所有订阅者
    const subscribers = await this.messageQueue.getSubscribers(channel);

    for (const userId of subscribers) {
      const socket = this.connections.get(userId);
      if (socket) {
        socket.send(JSON.stringify(message));
      }
    }
  }

  private async subscribeToMessages(userId: string, socket: WebSocket) {
    // 订阅用户相关的所有频道
    const channels = await this.messageQueue.getUserChannels(userId);

    for (const channel of channels) {
      await this.messageQueue.subscribe(channel, message => {
        socket.send(JSON.stringify(message));
      });
    }
  }
}
