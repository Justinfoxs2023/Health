import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Icon, Tabs, Button } from '../common';
import { TraditionalMedicine } from './TraditionalMedicine';
import { ModernWellness } from './ModernWellness';
import { useWellness } from '../../hooks/wellness';

interface Props {
  userId: string;
  userProfile: {
    age: number;
    gender: string;
    healthConditions: string[];
    preferences: string[];
    physicalCondition: {
      mobility: number;
      strength: number;
      flexibility: number;
    };
    mentalState: {
      stressLevel: number;
      sleepQuality: number;
      mood: number;
    };
  };
}

export const WellnessService: React.FC<Props> = ({
  userId,
  userProfile
}) => {
  const [activeTab, setActiveTab] = useState('traditional');
  const { recommendations, loading, error } = useWellness(userId, userProfile);

  const tabs = [
    {
      key: 'traditional',
      title: '传统养生',
      icon: 'spa',
      badge: recommendations?.traditional?.length || 0
    },
    {
      key: 'modern',
      title: '现��保健',
      icon: 'fitness-center',
      badge: recommendations?.modern?.length || 0
    }
  ];

  const getAgeGroup = (age: number) => {
    if (age < 18) return '青少年';
    if (age < 40) return '青年';
    if (age < 60) return '中年';
    return '老年';
  };

  return (
    <View style={styles.container}>
      <Card style={styles.header}>
        <View>
          <Text style={styles.title}>个性化养生保健</Text>
          <Text style={styles.subtitle}>
            为{getAgeGroup(userProfile.age)}群体定制的健康养护方案
          </Text>
        </View>
        <Button
          title="健康评估"
          icon="assessment"
          type="outline"
          size="small"
        />
      </Card>

      <View style={styles.recommendationCard}>
        <Text style={styles.recommendationTitle}>
          基于您的身体状况推荐
        </Text>
        <View style={styles.conditionTags}>
          {userProfile.healthConditions.map((condition, index) => (
            <View key={index} style={styles.conditionTag}>
              <Icon name="info" size={16} color="#2E7D32" />
              <Text style={styles.conditionText}>{condition}</Text>
            </View>
          ))}
        </View>
      </View>

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        style={styles.tabs}
      />

      <ScrollView style={styles.content}>
        {activeTab === 'traditional' ? (
          <TraditionalMedicine 
            userId={userId}
            userProfile={userProfile}
            recommendations={recommendations?.traditional}
          />
        ) : (
          <ModernWellness
            userId={userId}
            userProfile={userProfile}
            recommendations={recommendations?.modern}
          />
        )}
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32'
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  recommendationCard: {
    margin: 15,
    padding: 15,
    backgroundColor: '#E8F5E9',
    borderRadius: 8
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E7D32',
    marginBottom: 10
  },
  conditionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  conditionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16
  },
  conditionText: {
    fontSize: 13,
    color: '#2E7D32'
  },
  tabs: {
    marginBottom: 10
  },
  content: {
    flex: 1
  }
}); 