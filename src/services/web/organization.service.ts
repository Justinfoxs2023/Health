import { Logger } from '../../utils/logger';
import { Organization, WebUser } from '../../types/web';
import { AuthService } from '../auth/auth.service';

export class OrganizationService {
  private logger: Logger;
  private authService: AuthService;

  constructor() {
    this.logger = new Logger('Organization');
    this.authService = new AuthService();
  }

  // 创建组织
  async createOrganization(
    orgData: Partial<Organization>,
    creator: WebUser
  ): Promise<Organization> {
    try {
      // 1. 验证数据
      await this.validateOrgData(orgData);
      
      // 2. 创建组织
      const organization = await this.saveOrganization({
        ...orgData,
        admins: [creator.id],
        members: [{
          userId: creator.id,
          role: 'admin',
          joinedAt: new Date()
        }]
      });
      
      // 3. 设置权限
      await this.setupOrgPermissions(organization);
      
      return organization;
    } catch (error) {
      this.logger.error('创建组织失败', error);
      throw error;
    }
  }

  // 管理成员
  async manageMember(
    orgId: string,
    action: 'add' | 'remove' | 'update',
    memberData: any
  ): Promise<void> {
    try {
      switch (action) {
        case 'add':
          await this.addMember(orgId, memberData);
          break;
        case 'remove':
          await this.removeMember(orgId, memberData.userId);
          break;
        case 'update':
          await this.updateMember(orgId, memberData);
          break;
      }
    } catch (error) {
      this.logger.error('管理成员失败', error);
      throw error;
    }
  }

  // 获取组织数据
  async getOrganizationData(
    orgId: string,
    options: DataOptions
  ): Promise<OrganizationData> {
    try {
      // 1. 获取成员数据
      const membersData = await this.getMembersData(orgId, options);
      
      // 2. 聚合数据
      const aggregatedData = await this.aggregateOrgData(membersData);
      
      // 3. 生成报告
      return {
        summary: await this.generateOrgSummary(aggregatedData),
        details: aggregatedData,
        trends: await this.analyzeOrgTrends(aggregatedData)
      };
    } catch (error) {
      this.logger.error('获取组织数据失败', error);
      throw error;
    }
  }
} 