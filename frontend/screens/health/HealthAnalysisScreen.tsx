import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useQuery } from 'react-query';
import { getHealthAnalysis } from '../../api/health';
import {
  HealthIndexCard,
  RiskWarningCard,
  RecommendationList,
  LoadingSpinner
} from '../../components';

export const HealthAnalysisScreen = () => {
  const { data, isLoading } = useQuery('healthAnalysis', getHealthAnalysis);

  if (isLoading) return <LoadingSpinner />;

  const { healthIndex, risks, recommendations } = data?.data || {};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.indexContainer}>
        <HealthIndexCard
          title="BMI指数"
          value={healthIndex.bmi.value}
          status={healthIndex.bmi.status}
          icon="activity"
          style={styles.card}
        />
        <HealthIndexCard
          title="血压"
          value={healthIndex.bloodPressure.value}
          status={healthIndex.bloodPressure.status}
          icon="heart"
          style={styles.card}
        />
        <HealthIndexCard
          title="血糖"
          value={healthIndex.bloodSugar.value}
          status={healthIndex.bloodSugar.status}
          icon="droplet"
          style={styles.card}
        />
      </View>

      {risks?.length > 0 && (
        <View style={styles.section}>
          <RiskWarningCard
            risks={risks}
            onPress={(risk) => {
              // 处理风险点击事件
            }}
          />
        </View>
      )}

      <View style={styles.section}>
        <RecommendationList
          title="饮食建议"
          recommendations={recommendations.diet}
          icon="utensils"
          style={styles.recommendationList}
        />
        <RecommendationList
          title="运动建议"
          recommendations={recommendations.exercise}
          icon="activity"
          style={styles.recommendationList}
        />
        <RecommendationList
          title="生活方式建议"
          recommendations={recommendations.lifestyle}
          icon="sun"
          style={styles.recommendationList}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  indexContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    justifyContent: 'space-between'
  },
  card: {
    width: '48%',
    marginBottom: 15
  },
  section: {
    padding: 15
  },
  recommendationList: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15
  }
}); 