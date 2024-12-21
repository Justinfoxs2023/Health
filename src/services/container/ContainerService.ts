import { ContainerOrchestrator } from './ContainerOrchestrator';
import { DockerService } from './DockerService';
import { ImageBuilder } from './ImageBuilder';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContainerService {
  constructor(
    private readonly dockerService: DockerService,
    private readonly imageBuilder: ImageBuilder,
    private readonly orchestrator: ContainerOrchestrator,
  ) {}

  /** 构建容器镜像 */
  async buildImage(dockerfile: string, options: any) {
    return this.imageBuilder.build(dockerfile, options);
  }

  /** 管理容器 */
  async manageContainer(containerId: string, action: 'start' | 'stop' | 'restart' | 'remove') {
    return this.dockerService.manageContainer(containerId, action);
  }

  /** 容器健康检查 */
  async checkContainerHealth(containerId: string) {
    return this.dockerService.healthCheck(containerId);
  }

  /** 容器资源监控 */
  async monitorResources(containerId: string) {
    return this.dockerService.getStats(containerId);
  }

  /** 容器网络管理 */
  async manageNetwork(action: 'create' | 'remove' | 'connect' | 'disconnect', config: any) {
    return this.dockerService.manageNetwork(action, config);
  }

  /** 容器存储管理 */
  async manageVolume(action: 'create' | 'remove' | 'mount', config: any) {
    return this.dockerService.manageVolume(action, config);
  }

  /** 容器编排 */
  async orchestrateContainers(composePath: string) {
    return this.orchestrator.deploy(composePath);
  }

  /** 服务扩缩容 */
  async scaleService(service: string, replicas: number) {
    return this.orchestrator.scale(service, replicas);
  }

  /** 容器日志管理 */
  async manageLogs(containerId: string, options: any) {
    return this.dockerService.getLogs(containerId, options);
  }

  /** 镜像仓库管理 */
  async manageRegistry(action: 'push' | 'pull' | 'tag', image: string) {
    return this.imageBuilder.manageRegistry(action, image);
  }

  /** 容器配置管理 */
  async manageConfig(action: 'create' | 'update' | 'remove', config: any) {
    return this.orchestrator.manageConfig(action, config);
  }

  /** 容器安全扫描 */
  async scanSecurity(image: string) {
    return this.imageBuilder.securityScan(image);
  }
}
