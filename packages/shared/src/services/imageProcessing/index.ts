import { BehaviorSubject } from 'rxjs';
import { ImageService } from '../image';
import { HttpService } from '../http';

interface ImageProcessingTask {
  id: string;
  imageId: string;
  type: 'compress' | 'convert' | 'resize';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: any;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

interface ImageProcessingState {
  tasks: ImageProcessingTask[];
  currentTask: ImageProcessingTask | null;
  processing: boolean;
  error: Error | null;
}

export class ImageProcessingService {
  private state$ = new BehaviorSubject<ImageProcessingState>({
    tasks: [],
    currentTask: null,
    processing: false,
    error: null
  });

  private imageService: ImageService;
  private httpService: HttpService;
  private taskQueue: ImageProcessingTask[] = [];
  private processing = false;

  constructor(
    imageService = new ImageService(),
    httpService = new HttpService()
  ) {
    this.imageService = imageService;
    this.httpService = httpService;
  }

  // 添加处理任务
  async addTask(
    file: File,
    type: ImageProcessingTask['type'],
    options?: any
  ): Promise<string> {
    try {
      // 上传原始图片
      const formData = new FormData();
      formData.append('file', file);
      const response = await this.httpService.post('/api/images/upload', formData);
      const { imageId } = response.data;

      // 创建处理任务
      const task: ImageProcessingTask = {
        id: Math.random().toString(36).substr(2, 9),
        imageId,
        type,
        status: 'pending',
        progress: 0,
        createdAt: new Date()
      };

      // 添加到任务队列
      this.taskQueue.push(task);
      this.updateState({
        tasks: [...this.state$.value.tasks, task]
      });

      // 开始处理队列
      this.processQueue();

      return task.id;
    } catch (error) {
      this.updateState({ error });
      throw error;
    }
  }

  // 处理任务队列
  private async processQueue() {
    if (this.processing || this.taskQueue.length === 0) {
      return;
    }

    this.processing = true;
    const task = this.taskQueue[0];
    this.updateState({
      currentTask: task,
      processing: true
    });

    try {
      // 更新任务状态
      task.status = 'processing';
      this.updateTaskState(task);

      // 订阅处理进度
      const subscription = this.imageService.getState().subscribe(state => {
        task.progress = state.progress;
        this.updateTaskState(task);
      });

      // 根据任务类型处理图片
      let result;
      switch (task.type) {
        case 'compress':
          result = await this.handleCompressTask(task);
          break;
        case 'convert':
          result = await this.handleConvertTask(task);
          break;
        case 'resize':
          result = await this.handleResizeTask(task);
          break;
      }

      // 更新任务状态
      task.status = 'completed';
      task.result = result;
      task.completedAt = new Date();
      this.updateTaskState(task);

      subscription.unsubscribe();
    } catch (error) {
      task.status = 'failed';
      task.error = error.message;
      this.updateTaskState(task);
    }

    // 移除已完成的任务
    this.taskQueue.shift();
    this.processing = false;

    // 继续处理队列
    this.processQueue();
  }

  // 处理压缩任务
  private async handleCompressTask(task: ImageProcessingTask) {
    const response = await this.httpService.get(`/api/images/${task.imageId}`);
    const { url } = response.data;

    const file = await fetch(url).then(res => res.blob());
    const compressedFile = await this.imageService.compressImage(file as File);

    // 上传压缩后的图片
    const formData = new FormData();
    formData.append('file', compressedFile);
    const result = await this.httpService.post('/api/images/upload', formData);

    return result.data;
  }

  // 处理转换任务
  private async handleConvertTask(task: ImageProcessingTask) {
    const response = await this.httpService.get(`/api/images/${task.imageId}`);
    const { url } = response.data;

    const file = await fetch(url).then(res => res.blob());
    const convertedFile = await this.imageService.convertToWebP(file as File);

    // 上传转换后的图片
    const formData = new FormData();
    formData.append('file', convertedFile);
    const result = await this.httpService.post('/api/images/upload', formData);

    return result.data;
  }

  // 处理调整大小任务
  private async handleResizeTask(task: ImageProcessingTask) {
    const response = await this.httpService.get(`/api/images/${task.imageId}`);
    const { url } = response.data;

    const file = await fetch(url).then(res => res.blob());
    const srcSet = await this.imageService.generateSrcSet(file as File);

    return { srcSet };
  }

  // 获取任务状态
  getTaskState(taskId: string): ImageProcessingTask | null {
    return this.state$.value.tasks.find(task => task.id === taskId) || null;
  }

  // 获取所有任务
  getAllTasks(): ImageProcessingTask[] {
    return this.state$.value.tasks;
  }

  // 获取状态流
  getState() {
    return this.state$.asObservable();
  }

  // 取消任务
  cancelTask(taskId: string) {
    const taskIndex = this.taskQueue.findIndex(task => task.id === taskId);
    if (taskIndex > -1) {
      this.taskQueue.splice(taskIndex, 1);
      this.updateState({
        tasks: this.state$.value.tasks.filter(task => task.id !== taskId)
      });
    }
  }

  // 清理已完成的任务
  clearCompletedTasks() {
    this.updateState({
      tasks: this.state$.value.tasks.filter(task => task.status === 'pending' || task.status === 'processing')
    });
  }

  // 更新状态
  private updateState(partial: Partial<ImageProcessingState>) {
    this.state$.next({
      ...this.state$.value,
      ...partial
    });
  }

  // 更新任务状态
  private updateTaskState(updatedTask: ImageProcessingTask) {
    this.updateState({
      tasks: this.state$.value.tasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    });
  }

  // 销毁服务
  destroy() {
    this.state$.complete();
  }
} 