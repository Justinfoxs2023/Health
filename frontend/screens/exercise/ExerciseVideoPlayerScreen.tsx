import React from 'react';

import { LoadingSpinner, Icon, VideoPlayer } from '../../components';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { getExerciseVideoDetail, updateVideoProgress } from '../../api/exercise';
import { useQuery, useMutation } from '@tanstack/react-query';

interface IVideoDetail {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** videoUrl 的描述 */
  videoUrl: string;
  /** duration 的描述 */
  duration: number;
  /** instructor 的描述 */
  instructor: {
    id: string;
    name: string;
    avatarUrl: string;
    description: string;
  };
  /** relatedVideos 的描述 */
  relatedVideos: {
    id: string;
    title: string;
    thumbnailUrl: string;
    duration: number;
  }[];
  /** sections 的描述 */
  sections: {
    title: string;
    startTime: number;
    description?: string;
  }[];
  /** tips 的描述 */
  tips: string[];
}

export const ExerciseVideoPlayerScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [currentTime, setCurrentTime] = React.useState(0);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const { data: video, isLoading } = useQuery<IVideoDetail>(['exerciseVideo', id], () =>
    getExerciseVideoDetail(id),
  );

  const progressMutation = useMutation(updateVideoProgress);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: !isFullscreen,
    });
  }, [navigation, isFullscreen]);

  const handleProgress = (progress: { currentTime: number }) => {
    setCurrentTime(progress.currentTime);
    // 每30秒更新一次进度
    if (Math.floor(progress.currentTime) % 30 === 0) {
      progressMutation.mutate({
        videoId: id,
        progress: progress.currentTime,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={[styles.playerContainer, isFullscreen && styles.fullscreenPlayer]}>
        <VideoPlayer
          url={video?.videoUrl}
          style={styles.player}
          onProgress={handleProgress}
          onFullscreenChange={setIsFullscreen}
        />
      </View>

      {!isFullscreen && (
        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{video?.title}</Text>
            <View style={styles.instructorInfo}>
              <Text style={styles.instructorName}>讲师：{video?.instructor.name}</Text>
              <Text style={styles.duration}>时长：{formatTime(video?.duration || 0)}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>课程章节</Text>
            {video?.sections.map((section, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.sectionItem,
                  currentTime >= section.startTime && styles.currentSection,
                ]}
                onPress={() => {
                  // 跳转到对应时间点
                }}
              >
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTime}>{formatTime(section.startTime)}</Text>
                  <Text style={styles.sectionName}>{section.title}</Text>
                </View>
                {section.description && (
                  <Text style={styles.sectionDesc}>{section.description}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>注意事项</Text>
            {video?.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Icon name="alert-circle" size={16} color="#F57C00" style={styles.tipIcon} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>相关视频</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {video?.relatedVideos.map(relatedVideo => (
                <TouchableOpacity
                  key={relatedVideo.id}
                  style={styles.relatedVideo}
                  onPress={() => navigation.replace('ExerciseVideoPlayer', { id: relatedVideo.id })}
                >
                  <View style={styles.relatedThumbnail}>
                    <Image
                      source={{ uri: relatedVideo.thumbnailUrl }}
                      style={styles.thumbnailImage}
                    />
                    <View style={styles.durationBadge}>
                      <Text style={styles.durationText}>{formatTime(relatedVideo.duration)}</Text>
                    </View>
                  </View>
                  <Text style={styles.relatedTitle} numberOfLines={2}>
                    {relatedVideo.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  playerContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  fullscreenPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    aspectRatio: undefined,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  player: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  instructorInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  instructorName: {
    fontSize: 14,
    color: '#666',
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sectionItem: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  currentSection: {
    backgroundColor: '#E8F5E9',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTime: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  sectionName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  sectionDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginLeft: 45,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tipIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  relatedVideo: {
    width: 160,
    marginRight: 10,
  },
  relatedThumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
  },
  relatedTitle: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
});
