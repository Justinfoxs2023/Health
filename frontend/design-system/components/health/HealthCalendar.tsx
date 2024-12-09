import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DesignTokens } from '../../tokens';

interface HealthEvent {
  id: string;
  date: Date;
  type: 'appointment' | 'medication' | 'exercise' | 'measurement';
  title: string;
  time?: string;
}

interface HealthCalendarProps {
  events: HealthEvent[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onEventPress?: (event: HealthEvent) => void;
}

export const HealthCalendar: React.FC<HealthCalendarProps> = ({
  events,
  selectedDate = new Date(),
  onDateSelect,
  onEventPress
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(selectedDate);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    return { daysInMonth, firstDayOfMonth };
  };

  const renderCalendarDays = () => {
    const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dayEvents = events.filter(event => 
        event.date.toDateString() === date.toDateString()
      );

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            date.toDateString() === selectedDate.toDateString() && styles.selectedDay
          ]}
          onPress={() => onDateSelect?.(date)}
        >
          <Text style={[
            styles.dayText,
            date.toDateString() === selectedDate.toDateString() && styles.selectedDayText
          ]}>
            {day}
          </Text>
          {dayEvents.length > 0 && (
            <View style={styles.eventIndicator} />
          )}
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setCurrentMonth(new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth() - 1
          ))}
        >
          <Text>上个月</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {currentMonth.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
        </Text>
        <TouchableOpacity
          onPress={() => setCurrentMonth(new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth() + 1
          ))}
        >
          <Text>下个月</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.calendar}>
        {renderCalendarDays()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DesignTokens.colors.background.paper,
    borderRadius: DesignTokens.radius.lg,
    padding: DesignTokens.spacing.lg,
    ...DesignTokens.shadows.md
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.lg
  },
  monthText: {
    fontSize: DesignTokens.typography.sizes.lg,
    fontWeight: String(DesignTokens.typography.weights.semibold),
    color: DesignTokens.colors.text.primary
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: DesignTokens.spacing.xs
  },
  selectedDay: {
    backgroundColor: DesignTokens.colors.brand.primary,
    borderRadius: DesignTokens.radius.full
  },
  dayText: {
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.text.primary
  },
  selectedDayText: {
    color: DesignTokens.colors.neutral.white
  },
  eventIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: DesignTokens.colors.brand.primary,
    marginTop: DesignTokens.spacing.xs
  }
}); 