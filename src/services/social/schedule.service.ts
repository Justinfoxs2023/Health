export class ScheduleService {
  private readonly scheduleRepo: ScheduleRepository;
  private readonly calendarService: CalendarService;
  private readonly notificationService: NotificationService;
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger('ScheduleService');
  }

  // 创建活动日程
  async createActivitySchedule(activityId: string): Promise<Schedule> {
    try {
      const activity = await this.activityRepo.findById(activityId);
      
      // 创建日程
      const schedule = await this.scheduleRepo.create({
        activityId,
        title: activity.title,
        startTime: activity.startTime,
        endTime: activity.endTime,
        location: activity.location,
        reminders: this.generateDefaultReminders(activity.startTime)
      });

      // 同步到用户日历
      await this.syncToCalendar(schedule);
      
      // 设置提醒
      await this.setupReminders(schedule);

      return schedule;
    } catch (error) {
      this.logger.error('创建活动日程失败', error);
      throw error;
    }
  }

  // 生成默认提醒时间
  private generateDefaultReminders(startTime: Date): Reminder[] {
    return [
      { time: subHours(startTime, 24), type: 'day_before' },
      { time: subHours(startTime, 1), type: 'hour_before' },
      { time: subMinutes(startTime, 15), type: 'soon' }
    ];
  }

  // 同步到日历
  private async syncToCalendar(schedule: Schedule): Promise<void> {
    await this.calendarService.addEvent({
      title: schedule.title,
      startDate: schedule.startTime,
      endDate: schedule.endTime,
      location: schedule.location,
      description: schedule.description,
      reminders: schedule.reminders
    });
  }
} 