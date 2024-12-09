import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getExerciseGroups } from '../../api/exercise';
import { LoadingSpinner, Icon } from '../../components';

interface ExerciseGroup {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  memberCount: number;
  postCount: number;
  tags: string[];
  lastActive: string;
  isJoined: boolean;
}

export const ExerciseSocialScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = React.useState<'all' | 'joined'>('all');
  const { data: groups, isLoading } = useQuery<ExerciseGroup[]>('exerciseGroups', getExerciseGroups);

  const filteredGroups = groups?.filter(group => 
    selectedTab === 'all' || group.isJoined
  );

  const renderGroup = ({ item: group }: { item: ExerciseGroup }) => (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() => navigation.navigate('GroupDetail', { id: group.id })}
    >
      <Image source={{ uri: group.coverImage }} style={styles.groupImage} />
      <View style={styles.groupContent}>
        <Text style={styles.groupName}>{group.name}</Text>
        <Text style={styles.groupDesc} numberOfLines={2}>
          {group.description}
        </Text>
        <View style={styles.groupStats}>
          <View style={styles.statItem}>
            <Icon name="users" size={16} color="#666" />
            <Text style={styles.statText}>{group.memberCount}人</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="message-circle" size={16} color="#666" />
            <Text style={styles.statText}>{group.postCount}帖</Text>
          </View>
        </View>
        <View style={styles.tagsContainer}>
          {group.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'all' && styles.activeTab]}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.activeTabText]}>
            全部圈子
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'joined' && styles.activeTab]}
          onPress={() => setSelectedTab('joined')}
        >
          <Text style={[styles.tabText, selectedTab === 'joined' && styles.activeTabText]}>
            我的圈子
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredGroups}
        renderItem={renderGroup}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateGroup')}
      >
        <Icon name="plus" size={24} color="#fff" />
        <Text style={styles.createButtonText}>创建圈子</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2E7D32'
  },
  tabText: {
    fontSize: 14,
    color: '#666'
  },
  activeTabText: {
    color: '#2E7D32',
    fontWeight: 'bold'
  },
  list: {
    padding: 15
  },
  groupCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden'
  },
  groupImage: {
    width: '100%',
    height: 120
  },
  groupContent: {
    padding: 15
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  groupDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8
  },
  groupStats: {
    flexDirection: 'row',
    marginBottom: 8
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  tag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4
  },
  tagText: {
    fontSize: 12,
    color: '#2E7D32'
  },
  separator: {
    height: 15
  },
  createButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8
  }
}); 