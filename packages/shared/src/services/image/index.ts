import { BehaviorSubject } from 'rxjs';

interface ImageState {
  /** progress 的描述 */
  progress: number;
  /** error 的描述 */
  error: Error | null;
}

export class ImageService {
  private state$ = new BehaviorSubject<ImageState>({
    progress: 0,
    error: null,
  });

  // 获取服务状态
  getState() {
    return this.state$.asObservable();
  }

  // 压缩图片
  async compressImage(file: File, quality = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('无法创建canvas上下文'));
            return;
          }

          // 计算压缩后的尺寸
          let { width, height } = img;
          const maxSize = 1920;
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            blob => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('图片压缩失败'));
              }
            },
            'image/jpeg',
            quality,
          );
        };
        img.onerror = () => reject(new Error('图片加载失败'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });
  }

  // 转换为WebP格式
  async convertToWebP(file: Blob): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('无法创建canvas上下文'));
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            blob => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('WebP转换失败'));
              }
            },
            'image/webp',
            0.8,
          );
        };
        img.onerror = () => reject(new Error('图片加载失败'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });
  }

  // 优化图片用于下载
  async optimizeForDownload(src: string): Promise<string> {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const optimizedBlob = await this.compressImage(new File([blob], 'image'));
      return URL.createObjectURL(optimizedBlob);
    } catch (error) {
      console.error('Error in index.ts:', '图片优化失败:', error);
      return src; // 如果优化失败，返回原始图片
    }
  }

  // 获取图片信息
  async getImageInfo(file: File): Promise<{
    width: number;
    height: number;
    size: number;
    type: string;
  }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height,
            size: file.size,
            type: file.type,
          });
        };
        img.onerror = () => reject(new Error('图片加载失败'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });
  }

  // 更新进度
  private updateProgress(progress: number) {
    this.state$.next({
      ...this.state$.value,
      progress: Math.min(100, Math.max(0, progress)),
    });
  }

  // 更新错误状态
  private updateError(error: Error | null) {
    this.state$.next({
      ...this.state$.value,
      error,
    });
  }
}
