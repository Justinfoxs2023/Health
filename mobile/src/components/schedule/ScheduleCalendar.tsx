import React from 'react';

import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Card, Text, useTheme } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

// 配置中文
LocaleConfig.locales['zh'] = {
  monthNames: [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ],
  monthNamesShort: [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ],
  dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
};
LocaleConfig.defaultLocale = 'zh';

interface IScheduleCalendarProps {
  /** events 的描述 */
  events: {
    [date: string]: {
      marked: boolean;
      dotColor?: string;
      selected?: boolean;
    };
  };
  /** onDayPress 的描述 */
  onDayPress: (day: any) => void;
}

export const ScheduleCalendar = ({ events, onDayPress }: IScheduleCalendarProps) => {
  const theme = useTheme();

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Calendar
          markedDates={events}
          onDayPress={onDayPress}
          theme={{
            todayTextColor: theme.colors.primary,
            selectedDayBackgroundColor: theme.colors.primary,
            selectedDayTextColor: '#ffffff',
            arrowColor: theme.colors.primary,
            monthTextColor: theme.colors.text,
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14,
          }}
        />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
});
