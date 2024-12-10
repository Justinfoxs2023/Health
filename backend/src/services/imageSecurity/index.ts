import { createHash } from 'crypto';
import { promisify } from 'util';
import { exec } from 'child_process';
import { Image } from '../../schemas/Image';
import { logger } from '../logger';

const execAsync = promisify(exec);

interface SecurityCheckResult {
  type: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  timestamp: number;
}

class ImageSecurityService {
  /** 文件类型检查 */
  private async checkFileType(buffer: Buffer): Promise<SecurityCheckResult> {
    try {
      // 检查文件头
      const fileSignature = buffer.toString('hex', 0, 4);
      const validSignatures = {
        'ffd8ffe0': 'image/jpeg',
        '89504e47': 'image/png',
        '47494638': 'image/gif',
      };

      const mimeType = Object.entries(validSignatures).find(([sig]) => 
        fileSignature.startsWith(sig)
      )?.[1];

      if (!mimeType) {
        return {
          type: 'file_type',
          status: 'error',
          message: '不支持的文件类型',
          timestamp: Date.now(),
        };
      }

      return {
        type: 'file_type',
        status: 'success',
        message: `文件类型验证通过: ${mimeType}`,
        timestamp: Date.now(),
      };
    } catch (error) {
      logger.error('文件类型检查失败:', error);
      return {
        type: 'file_type',
        status: 'error',
        message: '文件类型检查失败',
        timestamp: Date.now(),
      };
    }
  }

  /** 文件大小检查 */
  private async checkFileSize(buffer: Buffer): Promise<SecurityCheckResult> {
    try {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const size = buffer.length;

      if (size > maxSize) {
        return {
          type: 'file_size',
          status: 'error',
          message: '文件大小超过限制',
          timestamp: Date.now(),
        };
      }

      return {
        type: 'file_size',
        status: 'success',
        message: `文件大小验证通过: ${(size / 1024 / 1024).toFixed(2)}MB`,
        timestamp: Date.now(),
      };
    } catch (error) {
      logger.error('文件大小检查失败:', error);
      return {
        type: 'file_size',
        status: 'error',
        message: '文件大小检查失败',
        timestamp: Date.now(),
      };
    }
  }

  /** 图片完整性检查 */
  private async checkImageIntegrity(buffer: Buffer): Promise<SecurityCheckResult> {
    try {
      // 使用 ClamAV 进行病毒扫描
      const tempFile = `/tmp/${createHash('md5').update(buffer).digest('hex')}`;
      await promisify(require('fs').writeFile)(tempFile, buffer);
      
      try {
        await execAsync(`clamscan ${tempFile}`);
        return {
          type: 'integrity',
          status: 'success',
          message: '图片完整性验证通过',
          timestamp: Date.now(),
        };
      } catch (error) {
        if (error.code === 1) { // ClamAV 发现威胁
          return {
            type: 'integrity',
            status: 'error',
            message: '图片可能包含恶意内容',
            timestamp: Date.now(),
          };
        }
        throw error;
      } finally {
        await promisify(require('fs').unlink)(tempFile).catch(() => {});
      }
    } catch (error) {
      logger.error('图片完整性检查失败:', error);
      return {
        type: 'integrity',
        status: 'error',
        message: '图片完整性检查失败',
        timestamp: Date.now(),
      };
    }
  }

  /** 元数据检查 */
  private async checkMetadata(buffer: Buffer): Promise<SecurityCheckResult> {
    try {
      // 检查是否包含敏感元数据
      const sensitivePatterns = [
        /location/i,
        /gps/i,
        /coordinate/i,
        /author/i,
        /copyright/i,
      ];

      // 使用 ExifTool 提取元数据
      const tempFile = `/tmp/${createHash('md5').update(buffer).digest('hex')}`;
      await promisify(require('fs').writeFile)(tempFile, buffer);
      
      try {
        const { stdout } = await execAsync(`exiftool -json ${tempFile}`);
        const metadata = JSON.parse(stdout)[0];

        const sensitiveFields = Object.keys(metadata).filter(field => 
          sensitivePatterns.some(pattern => pattern.test(field))
        );

        if (sensitiveFields.length > 0) {
          return {
            type: 'metadata',
            status: 'warning',
            message: `发现敏感元数据字段: ${sensitiveFields.join(', ')}`,
            timestamp: Date.now(),
          };
        }

        return {
          type: 'metadata',
          status: 'success',
          message: '元数据检查通过',
          timestamp: Date.now(),
        };
      } finally {
        await promisify(require('fs').unlink)(tempFile).catch(() => {});
      }
    } catch (error) {
      logger.error('元数据检查失败:', error);
      return {
        type: 'metadata',
        status: 'error',
        message: '元数据检查失败',
        timestamp: Date.now(),
      };
    }
  }

  /** 执行所有安全检查 */
  async performSecurityChecks(buffer: Buffer): Promise<SecurityCheckResult[]> {
    const checks = [
      this.checkFileType(buffer),
      this.checkFileSize(buffer),
      this.checkImageIntegrity(buffer),
      this.checkMetadata(buffer),
    ];

    return Promise.all(checks);
  }

  /** 更新图片安全状态 */
  async updateImageSecurityStatus(imageId: string, checks: SecurityCheckResult[]): Promise<void> {
    try {
      await Image.findByIdAndUpdate(imageId, {
        $set: { securityChecks: checks },
      });
    } catch (error) {
      logger.error('更新图片安全状态失败:', error);
      throw error;
    }
  }

  /** 验证图片是否安全 */
  isImageSafe(checks: SecurityCheckResult[]): boolean {
    const hasError = checks.some(check => check.status === 'error');
    return !hasError;
  }
}

// 创建单例实例
export const imageSecurity = new ImageSecurityService(); 