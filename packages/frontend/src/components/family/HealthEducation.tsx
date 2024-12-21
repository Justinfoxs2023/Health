import React from 'react';

import { Card, Text, Icon, Button } from '../common';
import { View, StyleSheet, FlatList, Image } from 'react-native';

interface ICourse {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** category 的描述 */
  category: string;
  /** thumbnail 的描述 */
  thumbnail: string;
  /** duration 的描述 */
  duration: string;
  /** progress 的描述 */
  progress: number;
  /** description 的描述 */
  description: string;
  /** tags 的描述 */
  tags: string[];
}

interface IProps {
  /** familyId 的描述 */
  familyId: string;
}

export const HealthEducation: React.FC<IProps> = ({ familyId }) => {
  const renderCourseCard = ({ item }: { item: ICourse }) => (
    <Card style={styles.courseCard}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />

      <View style={styles.courseContent}>
        <View style={styles.courseHeader}>
          <Text style={styles.courseTitle}>{item.title}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.courseInfo}>
          <View style={styles.infoItem}>
            <Icon name="access-time" size={16} color="#666" />
            <Text style={styles.infoText}>{item.duration}</Text>
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{Math.round(item.progress * 100)}%</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${item.progress * 100}%` }]} />
            </View>
          </View>
        </View>

        <View style={styles.tags}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionButtons}>
          <Button title="继续学习" icon="play-circle" type="solid" size="small" />
          <Button title="课程详情" icon="info" type="outline" size="small" />
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>健康教育</Text>
          <Text style={styles.subtitle}>提升全家人的健康知识</Text>
        </View>
        <Icon name="school" size={24} color="#2E7D32" />
      </View>

      <FlatList
        data={[]} // 从API获取数据
        renderItem={renderCourseCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.coursesList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  coursesList: {
    padding: 15,
  },
  courseCard: {
    marginBottom: 15,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0',
  },
  courseContent: {
    padding: 15,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  courseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '500',
  },
  progressBar: {
    width: 100,
    height: 4,
    backgroundColor: '#E8F5E9',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 2,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
});
