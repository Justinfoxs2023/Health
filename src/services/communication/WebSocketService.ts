import { ConfigurationManager } from '../config/ConfigurationManager';
import { EventEmitter } from 'events';
import { Logger } from '../logger/Logger';
import { Server as WebSocketServer } from 'ws';
import { injectable, inject } from 'inversify';

export interface IWebSocketRoom {
  /** id 的描述 */
  id: string;
  /** clients 的描述 */
  clients: SetWebSocket;
  /** metadata 的描述 */
  metadata: Recordstring /** any 的描述 */;
  /** any 的描述 */
  any;
}

export interface IWebSocketMessage {
  /** type 的描述 */
  type: string;
  /** data 的描述 */
  data: any;
  /** timestamp 的描述 */
  timestamp: Date;
  /** sender 的描述 */
  sender: string;
  /** room 的描述 */
  room: string;
}

export interface IWebSocketStats {
  /** totalConnections 的描述 */
  totalConnections: number;
  /** activeConnections 的描述 */
  activeConnections: number;
  /** messagesSent 的描述 */
  messagesSent: number;
  /** messagesReceived 的描述 */
  messagesReceived: number;
  /** averageLatency 的描述 */
  averageLatency: number;
  /** rooms 的描述 */
  rooms: number;
}

@injectable()
export class WebSocketService extends EventEmitter {
  private server: WebSocketServer;
  private rooms: Map<string, IWebSocketRoom> = new Map();
  private stats: IWebSocketStats = {
    totalConnections: 0,
    activeConnections: 0,
    messagesSent: 0,
    messagesReceived: 0,
    averageLatency: 0,
    rooms: 0,
  };

  constructor(
    @inject() private logger: Logger,
    @inject() private configManager: ConfigurationManager,
  ) {
    super();
    this.initialize();
  }

  /**
   * 初始化WebSocket服务
   */
  private async initialize(): Promise<void> {
    try {
      const config = await this.configManager.get('websocket');
      this.server = new WebSocketServer({
        port: config.port,
        host: config.host,
        path: config.path,
      });

      this.setupServerHandlers();
      this.startStatsCollection();

      this.logger.info('WebSocket服务初始化成功');
    } catch (error) {
      this.logger.error('WebSocket服务初始化失败', error);
      throw error;
    }
  }

  /**
   * 创建房间
   */
  public async createRoom(roomId: string, userIds: string[]): Promise<IWebSocketRoom> {
    try {
      if (this.rooms.has(roomId)) {
        throw new Error('房间已存在');
      }

      const room: IWebSocketRoom = {
        id: roomId,
        clients: new Set(),
        metadata: {
          createdAt: new Date(),
          userIds,
        },
      };

      this.rooms.set(roomId, room);
      this.stats.rooms++;

      this.logger.info(`创建房间成功: ${roomId}`);
      return room;
    } catch (error) {
      this.logger.error('创建房间失败', error);
      throw error;
    }
  }

  /**
   * 加入房间
   */
  public async joinRoom(roomId: string, client: WebSocket, userId: string): Promise<void> {
    try {
      const room = this.rooms.get(roomId);
      if (!room) {
        throw new Error('房间不存在');
      }

      room.clients.add(client);
      client['roomId'] = roomId;
      client['userId'] = userId;

      // 广播加入消息
      this.broadcastToRoom(roomId, {
        type: 'user.joined',
        data: { userId },
        timestamp: new Date(),
      });

      this.logger.info(`用户 ${userId} 加入房间: ${roomId}`);
    } catch (error) {
      this.logger.error('加入房间失败', error);
      throw error;
    }
  }

  /**
   * 离开房间
   */
  public async leaveRoom(roomId: string, client: WebSocket): Promise<void> {
    try {
      const room = this.rooms.get(roomId);
      if (!room) {
        throw new Error('房间不存在');
      }

      room.clients.delete(client);
      const userId = client['userId'];

      // 广播离开消息
      this.broadcastToRoom(roomId, {
        type: 'user.left',
        data: { userId },
        timestamp: new Date(),
      });

      this.logger.info(`用户 ${userId} 离开房间: ${roomId}`);
    } catch (error) {
      this.logger.error('离开房间失败', error);
      throw error;
    }
  }

  /**
   * 关闭房间
   */
  public async closeRoom(roomId: string): Promise<void> {
    try {
      const room = this.rooms.get(roomId);
      if (!room) {
        throw new Error('房间不存在');
      }

      // 通知所有客户端
      this.broadcastToRoom(roomId, {
        type: 'room.closed',
        data: { roomId },
        timestamp: new Date(),
      });

      // 关闭所有连接
      room.clients.forEach(client => {
        client.close();
      });

      this.rooms.delete(roomId);
      this.stats.rooms--;

      this.logger.info(`关闭房间: ${roomId}`);
    } catch (error) {
      this.logger.error('关闭房间失败', error);
      throw error;
    }
  }

  /**
   * 发送消息到房间
   */
  public async sendToRoom(roomId: string, type: string, data: any): Promise<void> {
    try {
      const message: IWebSocketMessage = {
        type,
        data,
        timestamp: new Date(),
        room: roomId,
      };

      await this.broadcastToRoom(roomId, message);
    } catch (error) {
      this.logger.error('发送消息到房间失败', error);
      throw error;
    }
  }

  /**
   * 发送消息到用户
   */
  public async sendToUser(userId: string, type: string, data: any): Promise<void> {
    try {
      const message: IWebSocketMessage = {
        type,
        data,
        timestamp: new Date(),
        sender: userId,
      };

      const client = this.findClientByUserId(userId);
      if (client) {
        await this.sendToClient(client, message);
      }
    } catch (error) {
      this.logger.error('发送消息到用户失败', error);
      throw error;
    }
  }

  /**
   * 获取服务统计
   */
  public getStats(): IWebSocketStats {
    return { ...this.stats };
  }

  /**
   * 设置服务器处理器
   */
  private setupServerHandlers(): void {
    this.server.on('connection', (client: WebSocket) => {
      this.handleNewConnection(client);

      client.on('message', (data: WebSocket.Data) => {
        this.handleClientMessage(client, data);
      });

      client.on('close', () => {
        this.handleClientDisconnection(client);
      });

      client.on('error', error => {
        this.handleClientError(client, error);
      });
    });
  }

  /**
   * 处理新连接
   */
  private handleNewConnection(client: WebSocket): void {
    this.stats.totalConnections++;
    this.stats.activeConnections++;

    this.logger.info('新的WebSocket连接');
  }

  /**
   * 处理客户端消息
   */
  private handleClientMessage(client: WebSocket, data: WebSocket.Data): void {
    try {
      const message = JSON.parse(data.toString());
      this.stats.messagesReceived++;

      // 发出消息事件
      this.emit(message.type, message.data, client);

      this.logger.debug('收到客户端消息', message);
    } catch (error) {
      this.logger.error('处理客户端消息失败', error);
    }
  }

  /**
   * 处理客户端断开连接
   */
  private handleClientDisconnection(client: WebSocket): void {
    try {
      this.stats.activeConnections--;

      // 如果在房间中，离开房间
      const roomId = client['roomId'];
      if (roomId) {
        this.leaveRoom(roomId, client);
      }

      this.logger.info('客户端断开连接');
    } catch (error) {
      this.logger.error('处理客户端断开连接失败', error);
    }
  }

  /**
   * 处理客户端错误
   */
  private handleClientError(client: WebSocket, error: Error): void {
    this.logger.error('客户端错误', error);
  }

  /**
   * 广播消息到房间
   */
  private async broadcastToRoom(roomId: string, message: IWebSocketMessage): Promise<void> {
    try {
      const room = this.rooms.get(roomId);
      if (!room) {
        throw new Error('房间不存在');
      }

      const promises = Array.from(room.clients).map(client => this.sendToClient(client, message));

      await Promise.all(promises);
    } catch (error) {
      this.logger.error('广播消息到房间失败', error);
      throw error;
    }
  }

  /**
   * 发送消息到客户端
   */
  private async sendToClient(client: WebSocket, message: IWebSocketMessage): Promise<void> {
    return new Promise((resolve, reject) => {
      client.send(JSON.stringify(message), error => {
        if (error) {
          reject(error);
        } else {
          this.stats.messagesSent++;
          resolve();
        }
      });
    });
  }

  /**
   * 查找用户的客户端连接
   */
  private findClientByUserId(userId: string): WebSocket | undefined {
    for (const room of this.rooms.values()) {
      for (const client of room.clients) {
        if (client['userId'] === userId) {
          return client;
        }
      }
    }
    return undefined;
  }

  /**
   * 启动统计收集
   */
  private startStatsCollection(): void {
    setInterval(() => {
      try {
        this.calculateStats();
      } catch (error) {
        this.logger.error('计算WebSocket统计失败', error);
      }
    }, 1000);
  }

  /**
   * 计算统计数据
   */
  private calculateStats(): void {
    // 实现统计计算逻辑
  }
}
