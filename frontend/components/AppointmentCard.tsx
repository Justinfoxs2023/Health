import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Props {
  appointment: {
    id: string;
    date: string;
    type: string;
    status: string;
    nutritionist: {
      name: string;
      avatar: string;
    };
    topic: string;
  };
  onPress: () => void;
}

export const AppointmentCard: React.FC<Props> = ({
  appointment,
  onPress
}) => {
  const getStatusColor = () => {
    switch (appointment.status) {
      case '待确认':
        return '#F57C00';
      case '已确认':
        return '#2E7D32';
      case '已完成':
        return '#1976D2';
      case '已取消':
        return '#D32F2F';
      default:
        return '#666';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.date}>
          {format(new Date(appointment.date), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
        </Text>
        <Text style={[styles.status, { color: getStatusColor() }]}>
          {appointment.status}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.type}>{appointment.type}</Text>
        <Text style={styles.topic} numberOfLines={2}>
          {appointment.topic}
        </Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.nutritionist}>
          营养师: {appointment.nutritionist.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  date: {
    fontSize: 14,
    color: '#333'
  },
  status: {
    fontSize: 14,
    fontWeight: '500'
  },
  content: {
    marginBottom: 12
  },
  type: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4
  },
  topic: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  nutritionist: {
    fontSize: 14,
    color: '#666'
  }
}); 