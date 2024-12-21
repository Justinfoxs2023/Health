import React from 'react';

import { Card, Text, Icon, Button } from '../common';
import { View, StyleSheet, ScrollView } from 'react-native';

interface ITherapyProgram {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: 'physical' | 'mental';
  /** category 的描述 */
  category: 'rehabilitation' | 'pain' | 'posture' | 'stress' | 'sleep' | 'emotional';
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** methods 的描述 */
  methods: string[];
  /** duration 的描述 */
  duration: string;
  /** frequency 的描述 */
  frequency: string;
  /** professional 的描述 */
  professional: {
    name: string;
    title: string;
    speciality: string[];
  };
}

interface IProps {
  /** userId 的描述 */
  userId: string;
  /** userProfile 的描述 */
  userProfile: {
    age: number;
    gender: string;
    healthConditions: string[];
    preferences: string[];
  };
}

export const ModernWellness: React.FC<IProps> = ({ userId, userProfile }) => {
  const getProgramIcon = (category: string) => {
    switch (category) {
      case 'rehabilitation':
        return 'accessibility';
      case 'pain':
        return 'healing';
      case 'posture':
        return 'accessibility-new';
      case 'stress':
        return 'psychology';
      case 'sleep':
        return 'bedtime';
      case 'emotional':
        return 'mood';
      default:
        return 'favorite';
    }
  };

  const renderProgramCard = (program: ITherapyProgram) => (
    <Card key={program.id} style={styles.programCard}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Icon name={getProgramIcon(program.category)} size={24} color="#2E7D32" />
          <View>
            <Text style={styles.programTitle}>{program.title}</Text>
            <Text style={styles.programType}>
              {program.type === 'physical' ? '物理治疗' : '心理健康'}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.description}>{program.description}</Text>

      <View style={styles.methodsSection}>
        <Text style={styles.sectionTitle}>治疗方法</Text>
        <View style={styles.methodsList}>
          {program.methods.map((method, index) => (
            <View key={index} style={styles.methodItem}>
              <Icon name="check" size={16} color="#66BB6A" />
              <Text style={styles.methodText}>{method}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.scheduleSection}>
        <View style={styles.scheduleItem}>
          <Icon name="schedule" size={16} color="#666" />
          <Text style={styles.scheduleText}>疗程: {program.duration}</Text>
        </View>
        <View style={styles.scheduleItem}>
          <Icon name="update" size={16} color="#666" />
          <Text style={styles.scheduleText}>频率: {program.frequency}</Text>
        </View>
      </View>

      <View style={styles.professionalSection}>
        <Text style={styles.sectionTitle}>专业医师</Text>
        <View style={styles.professionalInfo}>
          <View style={styles.professionalHeader}>
            <Text style={styles.professionalName}>{program.professional.name}</Text>
            <Text style={styles.professionalTitle}>{program.professional.title}</Text>
          </View>
          <View style={styles.specialityTags}>
            {program.professional.speciality.map((item, index) => (
              <View key={index} style={styles.specialityTag}>
                <Text style={styles.specialityText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <Button title="了解详情" icon="info" type="outline" size="small" />
        <Button title="预约咨���" icon="event" type="solid" size="small" />
      </View>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>物理治疗</Text>
        {/* 渲染物理治疗项目 */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>心理健康</Text>
        {/* 渲染心理健康项目 */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  programCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  programTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  programType: {
    fontSize: 12,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  methodsSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  methodsList: {
    gap: 8,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  methodText: {
    fontSize: 14,
    color: '#444',
  },
  scheduleSection: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 15,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scheduleText: {
    fontSize: 14,
    color: '#666',
  },
  professionalSection: {
    marginBottom: 15,
  },
  professionalInfo: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
  },
  professionalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  professionalName: {
    fontSize: 15,
    fontWeight: '500',
  },
  professionalTitle: {
    fontSize: 13,
    color: '#666',
  },
  specialityTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialityTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialityText: {
    fontSize: 12,
    color: '#2E7D32',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 15,
  },
});
