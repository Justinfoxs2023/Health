import { AuthGuard } from '../auth/auth.guard';
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { DeveloperService } from './developer.service';
import { IAPIKeyConfig } from './interfaces';
import { Logger } from '../logger/logger.service';

@Controller()
@UseGuards()
export class DeveloperController {
  constructor(
    private readonly developerService: DeveloperService,
    private readonly logger: Logger,
  ) {}

  // API密钥管理
  @Post()
  async createApiKey(@Body() userId: string, @Body() permissions: string[]) {
    try {
      const apiKey = await this.developerService.createApiKey(userId, permissions);
      return {
        success: true,
        data: apiKey,
      };
    } catch (error) {
      this.logger.error('创建API密钥失败', error);
      throw error;
    }
  }

  @Get()
  async getApiKey(@Param() id: string) {
    try {
      const apiKey = await this.developerService.getApiKey(id);
      return {
        success: true,
        data: apiKey,
      };
    } catch (error) {
      this.logger.error('获取API密钥失败', error);
      throw error;
    }
  }

  @Put()
  async updateApiKey(@Param() id: string, @Body() update: Partial<IAPIKeyConfig>) {
    try {
      const apiKey = await this.developerService.updateApiKey(id, update);
      return {
        success: true,
        data: apiKey,
      };
    } catch (error) {
      this.logger.error('更新API密钥失败', error);
      throw error;
    }
  }

  @Delete()
  async deleteApiKey(@Param() id: string) {
    try {
      const result = await this.developerService.deleteApiKey(id);
      return {
        success: result,
      };
    } catch (error) {
      this.logger.error('删除API密钥失败', error);
      throw error;
    }
  }

  // API文档管理
  @Get()
  async getApiDocumentation(@Param() path: string) {
    try {
      const docs = await this.developerService.getApiDocumentation(path);
      return {
        success: true,
        data: docs,
      };
    } catch (error) {
      this.logger.error('获取API文档失败', error);
      throw error;
    }
  }

  @Put()
  async updateApiDocumentation(@Param() path: string, @Body() content: any) {
    try {
      const result = await this.developerService.updateApiDocumentation(path, content);
      return {
        success: result,
      };
    } catch (error) {
      this.logger.error('更新API文档失败', error);
      throw error;
    }
  }

  // SDK管理
  @Get()
  async getSdkVersions() {
    try {
      const versions = await this.developerService.getSdkVersions();
      return {
        success: true,
        data: versions,
      };
    } catch (error) {
      this.logger.error('获取SDK版本失败', error);
      throw error;
    }
  }

  @Post()
  async uploadSdkVersion(@Body() version: string, @Body() files: any[]) {
    try {
      const result = await this.developerService.uploadSdkVersion(version, files);
      return {
        success: result,
      };
    } catch (error) {
      this.logger.error('上传SDK版本失败', error);
      throw error;
    }
  }

  // 开发者账号管理
  @Post()
  async createDeveloperAccount(@Body() data: any) {
    try {
      const account = await this.developerService.createDeveloperAccount(data);
      return {
        success: true,
        data: account,
      };
    } catch (error) {
      this.logger.error('创建开发者账号失败', error);
      throw error;
    }
  }

  @Get()
  async getDeveloperAccount(@Param() id: string) {
    try {
      const account = await this.developerService.getDeveloperAccount(id);
      return {
        success: true,
        data: account,
      };
    } catch (error) {
      this.logger.error('获取开发者账号失败', error);
      throw error;
    }
  }

  @Put()
  async updateDeveloperAccount(@Param() id: string, @Body() update: any) {
    try {
      const result = await this.developerService.updateDeveloperAccount(id, update);
      return {
        success: result,
      };
    } catch (error) {
      this.logger.error('更新开发者账号失败', error);
      throw error;
    }
  }

  // 使用统计
  @Get()
  async getApiUsageStats(
    @Query() apiKeyId: string,
    @Query() startDate: string,
    @Query() endDate: string,
  ) {
    try {
      const stats = await this.developerService.getApiUsageStats(
        apiKeyId,
        new Date(startDate),
        new Date(endDate),
      );
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      this.logger.error('获取API使用统计失败', error);
      throw error;
    }
  }

  // 开发者支持
  @Post()
  async submitSupportTicket(@Body() data: any) {
    try {
      const ticket = await this.developerService.submitSupportTicket(data);
      return {
        success: true,
        data: ticket,
      };
    } catch (error) {
      this.logger.error('提交支持工单失败', error);
      throw error;
    }
  }

  @Get()
  async getSupportTicket(@Param() id: string) {
    try {
      const ticket = await this.developerService.getSupportTicket(id);
      return {
        success: true,
        data: ticket,
      };
    } catch (error) {
      this.logger.error('获取支持工单失败', error);
      throw error;
    }
  }

  @Put()
  async updateSupportTicket(@Param() id: string, @Body() update: any) {
    try {
      const result = await this.developerService.updateSupportTicket(id, update);
      return {
        success: result,
      };
    } catch (error) {
      this.logger.error('更新支持工单失败', error);
      throw error;
    }
  }

  // 示例代码
  @Get()
  async getCodeExamples(@Query() language: string, @Query() feature: string) {
    try {
      const examples = await this.developerService.getCodeExamples(language, feature);
      return {
        success: true,
        data: examples,
      };
    } catch (error) {
      this.logger.error('获取示例代码失败', error);
      throw error;
    }
  }

  @Post()
  async addCodeExample(@Body() data: any) {
    try {
      const result = await this.developerService.addCodeExample(data);
      return {
        success: result,
      };
    } catch (error) {
      this.logger.error('添加示例代码失败', error);
      throw error;
    }
  }
}
