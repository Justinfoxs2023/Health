# @health/shared

健康管理系统共享组件和工具库

## 功能特性

### 基础组件
- Button - 按钮组件
- Input - 输入框组件
- Form - 表单组件
- Modal - 模态框组件
- Table - 表格组件
- Message - 消息提示组件
- Loading - 加载组件
- Confirm - 确认框组件
- ErrorBoundary - 错误边界组件

### 业务组件
- HealthDataCard - 健康数据卡片
- HealthDataForm - 健康数据表单
- HealthDataTable - 健康数据表格
- LocaleSwitch - 语言切换
- ThemeSwitch - 主题切换
- LogViewer - 日志查看器
- Skeleton - 骨架屏组件
- VirtualScroll - 虚拟滚动组件
- Animation - 动画组件
- HealthAnalysis - 健康数据分析组件
- Statistics - 统计组件
- DataExport - 数据导出组件
- SyncStatus - 同步状态组件
- OfflineStatus - 离线状态组件

### 图片处理组件
- Image - 优化的图片组件
  - 支持懒加载
  - 支持WebP格式
  - 支持响应式图片
  - 支持图片预加载
  - 支持加载状态和错误处理
  
- ImageUpload - 图片上传组件
  - 支持图片压缩
  - 支持格式转换
  - 支持大小限制
  - 支持类型验证
  - 显示上传进度
  
- ImagePreview - 图片预览组件
  - 支持图片缩放
  - 支持图片旋转
  - 支持图片下载
  - 支持键盘和鼠标操作
  
- ImageProcessingTasks - 图片处理任务管理
  - 显示任务列表和状态
  - 支持任务取消
  - 支持任务重试
  - 显示处理进度
  
- ImageCacheStatus - 图片缓存状态
  - 显示缓存统计信息
  - 支持缓存清理
  - 显示命中率
  
- ImageSecurityStatus - 图片安全状态
  - 显示签名验证状态
  - 显示哈希验证状态
  - 显示内容验证状态
  - 显示安全检查结果

### 服务
- HttpService - HTTP请求服务
- ErrorService - 错误处理服务
- ThemeService - 主题管理服务
- I18nService - 国际化服务
- StorageService - 存储服务
- LoggerService - 日志服务
- AuthService - 认证服务
- AnalysisService - 数据分析服务
- SyncService - 数据同步服务
- ExportService - 数据导出服务
- StatisticsService - 统计服务
- OfflineService - 离线支持服务

### 图片处理服务
- ImageService - 图片基础服务
  - 图片压缩
  - 格式转换
  - 响应式图片生成
  - 预加载管理
  
- ImageProcessingService - 图片处理服务
  - 任务队列管理
  - 处理进度跟踪
  - 错误处理
  - 结果管理
  
- ImageCacheService - 图片缓存服务
  - 内存缓存管理
  - 预加载策略
  - 缓存清理
  - 性能优化
  
- ImageSecurityService - 图片安全服务
  - 图片验证
  - 签名生成和验证
  - 内容加密和解密
  - 防篡改保护

## 安装

```bash
npm install @health/shared
```

## 使用示例

### 图片组件

```tsx
import { Image, ImageUpload, ImagePreview } from '@health/shared';

// 使用优化的图片组件
<Image
  src="example.jpg"
  alt="示例图片"
  lazy={true}
  placeholder={<Skeleton.Image />}
  onLoad={() => console.log('图片加载完成')}
  onError={(error) => console.log('图片加载失败', error)}
/>

// 使用图片上传组件
<ImageUpload
  onChange={(url) => console.log('图片上传成功', url)}
  maxSize={5}
  accept="image/*"
/>

// 使用图片预览组件
<ImagePreview
  visible={true}
  src="example.jpg"
  onClose={() => setVisible(false)}
/>
```

### 图片处理服务

```tsx
import {
  ImageService,
  ImageProcessingService,
  ImageCacheService,
  ImageSecurityService
} from '@health/shared';

// 创建服务实例
const imageService = new ImageService();
const processingService = new ImageProcessingService();
const cacheService = new ImageCacheService();
const securityService = new ImageSecurityService();

// 压缩图片
const compressedFile = await imageService.compressImage(file);

// 添加处理任务
const taskId = await processingService.addTask(file, 'compress');

// 缓存图片
await cacheService.set(url, blob);

// 验证图片安全性
const isValid = await securityService.validateImage(file);
```

## 开发

### 安装依赖
```bash
npm install
```

### 运行测试
```bash
npm test
```

### 构建
```bash
npm run build
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

MIT 