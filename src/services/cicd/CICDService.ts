import { BuildService } from './BuildService';
import { DeploymentService } from './DeploymentService';
import { GitService } from './GitService';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CICDService {
  constructor(
    private readonly gitService: GitService,
    private readonly buildService: BuildService,
    private readonly deploymentService: DeploymentService,
  ) {}

  /** 触发CI流程 */
  async triggerCI(repository: string, branch: string) {
    // 代码检出
    await this.gitService.checkout(repository, branch);

    // 运行构建
    const buildResult = await this.buildService.build({
      repository,
      branch,
      config: {
        cache: true,
        parallel: true,
      },
    });

    // 运行测试
    await this.buildService.runTests();

    // 代码质量检查
    await this.buildService.codeQualityCheck();

    return buildResult;
  }

  /** 触发CD流程 */
  async triggerCD(buildId: string, environment: string) {
    // 准备部署
    await this.deploymentService.prepare(buildId);

    // 执行部署
    const deployResult = await this.deploymentService.deploy({
      buildId,
      environment,
      config: {
        strategy: 'rolling',
        timeout: '5m',
        healthCheck: true,
      },
    });

    // 部署后检查
    await this.deploymentService.postDeployCheck(deployResult.id);

    return deployResult;
  }

  /** 回滚部署 */
  async rollback(deploymentId: string) {
    return this.deploymentService.rollback(deploymentId);
  }

  /** 获取流水线状态 */
  async getPipelineStatus(pipelineId: string) {
    return {
      ci: await this.buildService.getStatus(pipelineId),
      cd: await this.deploymentService.getStatus(pipelineId),
    };
  }

  /** 配置流水线 */
  async configurePipeline(config: any) {
    await this.buildService.updateConfig(config.ci);
    await this.deploymentService.updateConfig(config.cd);
  }

  /** 自动化发布 */
  async autoRelease(version: string) {
    // 创建发布分支
    await this.gitService.createReleaseBranch(version);

    // 更新版本信息
    await this.buildService.updateVersion(version);

    // 触发发布流程
    return this.triggerCD(version, 'production');
  }
}
