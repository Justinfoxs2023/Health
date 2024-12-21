import React from 'react';

import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface IProps {
  /** value 的描述 */
  value: { hour: number; minute: number };
  /** onChange 的描述 */
  onChange: (time: { hour: number; minute: number }) => void;
  /** minHour 的描述 */
  minHour?: number;
  /** maxHour 的描述 */
  maxHour?: number;
  /** interval 的描述 */
  interval?: number;
}

export const TimePicker: React.FC<IProps> = ({
  value,
  onChange,
  minHour = 9,
  maxHour = 18,
  interval = 30,
}) => {
  const timeSlots = React.useMemo(() => {
    const slots = [];
    for (let hour = minHour; hour <= maxHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        slots.push({ hour, minute });
      }
    }
    return slots;
  }, [minHour, maxHour, interval]);

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {timeSlots.map((slot, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.timeSlot,
            value.hour === slot.hour && value.minute === slot.minute && styles.selectedSlot,
          ]}
          onPress={() => onChange(slot)}
        >
          <Text
            style={[
              styles.timeText,
              value.hour === slot.hour && value.minute === slot.minute && styles.selectedText,
            ]}
          >
            {formatTime(slot.hour, slot.minute)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  selectedSlot: {
    backgroundColor: '#E8F5E9',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  selectedText: {
    color: '#2E7D32',
    fontWeight: '500',
  },
});
