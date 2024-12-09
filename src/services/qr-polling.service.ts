import { SocialPlatform } from '../utils/socialPlatform';

export class QrPollingService {
  private pollingInterval: number = 2000; // 2秒
  private maxAttempts: number = 90; // 最多轮询3分钟
  private attempts: number = 0;
  private timerId?: number;

  constructor(
    private platform: Social.Platform,
    private qrId: string,
    private onSuccess: (response: Social.LoginResponse) => void,
    private onError: (error: Error) => void,
    private onExpired: () => void
  ) {}

  start() {
    this.poll();
  }

  stop() {
    if (this.timerId) {
      window.clearTimeout(this.timerId);
      this.timerId = undefined;
    }
  }

  private async poll() {
    try {
      const response = await SocialPlatform.checkQrStatus(this.platform, this.qrId);
      
      if (response.code) {
        this.stop();
        this.onSuccess(response);
        return;
      }

      this.attempts++;
      if (this.attempts >= this.maxAttempts) {
        this.stop();
        this.onExpired();
        return;
      }

      this.timerId = window.setTimeout(() => this.poll(), this.pollingInterval);
    } catch (error) {
      this.stop();
      this.onError(error as Error);
    }
  }
} 