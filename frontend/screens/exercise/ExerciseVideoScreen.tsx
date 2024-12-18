import React from 'react';

import { LoadingSpinner, Icon } from '../../components';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { getExerciseVideos } from '../../api/exercise';
import { useQuery } from '@tanstack/react-query';

interface IExerciseVideo {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** thumbnailUrl 的描述 */
  thumbnailUrl: string;
  /** videoUrl 的描述 */
  videoUrl: string;
  /** duration 的描述 */
  duration: number;
  /** category 的描述 */
  category: string;
  /** level 的描述 */
  level: 'beginner' | 'intermediate' | 'advanced';
  /** instructor 的描述 */
  instructor: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  /** viewCount 的描述 */
  viewCount: number;
  /** tags 的描述 */
  tags: string[];
}

export const ExerciseVideoScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const { data: videos, isLoading } = useQuery<IExerciseVideo[]>(
    'exerciseVideos',
    getExerciseVideos,
  );

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'warmup', name: '热身' },
    { id: 'strength', name: '力量' },
    { id: 'cardio', name: '有氧' },
    { id: 'yoga', name: '瑜伽' },
    { id: 'stretch', name: '拉伸' },
  ];

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderVideoCard = ({ item }: { item: IExerciseVideo }) => (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={() => navigation.navigate('ExerciseVideoPlayer', { id: item.id })}
    >
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{formatDuration(item.duration)}</Text>
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>
            {item.level === 'beginner' ? '初级' : item.level === 'intermediate' ? '中级' : '高级'}
          </Text>
        </View>
      </View>

      <View style={styles.videoContent}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.instructorRow}>
          <Image source={{ uri: item.instructor.avatarUrl }} style={styles.instructorAvatar} />
          <Text style={styles.instructorName}>{item.instructor.name}</Text>
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.viewCount}>
            <Icon name="eye" size={12} color="#999" /> {item.viewCount}次观看
          </Text>
          <View style={styles.tagContainer}>
            {item.tags.slice(0, 2).map((tag, index) => (
              <Text key={index} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>视频教程</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ExerciseVideoSearch')}>
          <Icon name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.categorySection}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item.id && styles.categoryTextActive,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      <FlatList
        data={videos?.filter(
          video => selectedCategory === 'all' || video.category === selectedCategory,
        )}
        renderItem={renderVideoCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.videoList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  categorySection: {
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  categoryList: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#f5f5f5',
  },
  categoryButtonActive: {
    backgroundColor: '#E8F5E9',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  videoList: {
    padding: 15,
  },
  videoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#f0f0f0',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
  },
  levelBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(46,125,50,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  levelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  videoContent: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  instructorName: {
    fontSize: 14,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewCount: {
    fontSize: 12,
    color: '#999',
  },
  tagContainer: {
    flexDirection: 'row',
  },
  tag: {
    fontSize: 12,
    color: '#2E7D32',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  separator: {
    height: 15,
  },
});
