import { CacheService } from '../cache/CacheService';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/Logger';
import { StorageService } from '../storage/StorageService';

@Injectable()
export class CourseService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly eventBus: EventBus,
    private readonly cacheService: CacheService,
    private readonly storageService: StorageService,
  ) {}

  async createCourse(expertId: string, courseData: any): Promise<any> {
    try {
      // 验证课程数据
      this.validateCourseData(courseData);

      // 检查专家资质
      await this.checkExpertQualification(expertId);

      // 上传课程封面
      const coverUrl = await this.storageService.uploadFile('courses', courseData.cover);

      // 创建课程
      const course = await this.databaseService.create('courses', {
        expertId,
        ...courseData,
        cover: coverUrl,
        status: 'draft',
        enrollments: 0,
        rating: 0,
        ratingCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 发送事件
      await this.eventBus.emit('course.created', { course });

      return course;
    } catch (error) {
      this.logger.error('创建课程失败', error);
      throw error;
    }
  }

  async updateCourse(courseId: string, expertId: string, updateData: any): Promise<any> {
    try {
      // 获取课程信息
      const course = await this.databaseService.findOne('courses', { _id: courseId });
      if (!course) {
        throw new Error('课程不存在');
      }

      if (course.expertId !== expertId) {
        throw new Error('无权操作此课程');
      }

      // 如果更新封面
      let coverUrl = course.cover;
      if (updateData.cover) {
        coverUrl = await this.storageService.uploadFile('courses', updateData.cover);
      }

      // 更新课程
      const updatedCourse = await this.databaseService.update(
        'courses',
        { _id: courseId },
        {
          ...updateData,
          cover: coverUrl,
          updatedAt: new Date(),
        },
      );

      // 清除缓存
      await this.clearCourseCache(courseId);

      // 发送事件
      await this.eventBus.emit('course.updated', { course: updatedCourse });

      return updatedCourse;
    } catch (error) {
      this.logger.error('更新课程失败', error);
      throw error;
    }
  }

  async publishCourse(courseId: string, expertId: string): Promise<any> {
    try {
      // 获取课程信息
      const course = await this.databaseService.findOne('courses', { _id: courseId });
      if (!course) {
        throw new Error('课程不存在');
      }

      if (course.expertId !== expertId) {
        throw new Error('无权操作此课程');
      }

      if (course.status !== 'draft') {
        throw new Error('课程状态错误');
      }

      // 验证课程完整性
      await this.validateCourseCompleteness(course);

      // 更新课程状态
      const publishedCourse = await this.databaseService.update(
        'courses',
        { _id: courseId },
        {
          status: 'published',
          publishedAt: new Date(),
          updatedAt: new Date(),
        },
      );

      // 清除缓存
      await this.clearCourseCache(courseId);

      // 发送事件
      await this.eventBus.emit('course.published', { course: publishedCourse });

      return publishedCourse;
    } catch (error) {
      this.logger.error('发布课程失败', error);
      throw error;
    }
  }

  async getCourse(courseId: string): Promise<any> {
    try {
      // 尝试从缓存获取
      const cacheKey = `course:${courseId}`;
      let course = await this.cacheService.get(cacheKey);

      if (!course) {
        // 从数据库获取
        course = await this.databaseService.findOne('courses', { _id: courseId });
        if (!course) {
          throw new Error('课程不存在');
        }

        // 设置缓存
        await this.cacheService.set(cacheKey, course, 3600);
      }

      return course;
    } catch (error) {
      this.logger.error('获取课程失败', error);
      throw error;
    }
  }

  async listCourses(query: {
    category?: string;
    expertId?: string;
    status?: string;
    keyword?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    total: number;
    courses: any[];
  }> {
    try {
      const { category, expertId, status, keyword, page = 1, limit = 20 } = query;
      const conditions: any = {};

      if (category) {
        conditions.category = category;
      }

      if (expertId) {
        conditions.expertId = expertId;
      }

      if (status) {
        conditions.status = status;
      }

      if (keyword) {
        conditions.$or = [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ];
      }

      const skip = (page - 1) * limit;
      const [total, courses] = await Promise.all([
        this.databaseService.count('courses', conditions),
        this.databaseService.find('courses', conditions, { skip, limit, sort: { createdAt: -1 } }),
      ]);

      return { total, courses };
    } catch (error) {
      this.logger.error('获取课程列表失败', error);
      throw error;
    }
  }

  async enrollCourse(courseId: string, userId: string): Promise<any> {
    try {
      // 检查课程状态
      const course = await this.getCourse(courseId);
      if (course.status !== 'published') {
        throw new Error('课程未发布');
      }

      // 检查是否已报名
      const existingEnrollment = await this.databaseService.findOne('enrollments', {
        courseId,
        userId,
      });

      if (existingEnrollment) {
        throw new Error('已报名此课程');
      }

      // 创建报名记录
      const enrollment = await this.databaseService.create('enrollments', {
        courseId,
        userId,
        progress: 0,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 更新课程报名人数
      await this.databaseService.update(
        'courses',
        { _id: courseId },
        {
          $inc: { enrollments: 1 },
          updatedAt: new Date(),
        },
      );

      // 清除缓存
      await this.clearCourseCache(courseId);

      // 发送事件
      await this.eventBus.emit('course.enrolled', { enrollment });

      return enrollment;
    } catch (error) {
      this.logger.error('报名课程失败', error);
      throw error;
    }
  }

  private validateCourseData(data: any): void {
    if (!data.title || !data.description || !data.category || !data.cover) {
      throw new Error('课程数据不完整');
    }
  }

  private async checkExpertQualification(expertId: string): Promise<void> {
    const expert = await this.databaseService.findOne('experts', { userId: expertId });
    if (!expert) {
      throw new Error('专家不存在');
    }

    if (expert.status !== 'active') {
      throw new Error('专家资质未通过审核');
    }
  }

  private async validateCourseCompleteness(course: any): Promise<void> {
    // 检查课程章节
    const chapters = await this.databaseService.find('chapters', { courseId: course._id });
    if (chapters.length === 0) {
      throw new Error('课程还未添加任何章节');
    }

    // 检查课程定价
    if (!course.price && course.price !== 0) {
      throw new Error('请设置课程价格');
    }
  }

  private async clearCourseCache(courseId: string): Promise<void> {
    await this.cacheService.del(`course:${courseId}`);
  }
}
