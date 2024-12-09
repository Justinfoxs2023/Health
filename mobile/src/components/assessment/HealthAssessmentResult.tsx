import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, useTheme, Button } from 'react-native-paper';
import { HealthDataCard } from '../health/HealthDataCard';

interface HealthAssessmentResultProps {
  result: {
    bmi: number;
    bmiCategory: string;
    healthScore: number;
    recommendations: string[];
    risks: string[];
    lifestyle: {
      exercise: string[];
      diet: string[];
      sleep: string[];
    };
  };
  onClose: () => void;
}

export const HealthAssessmentResult = ({ result, onClose }: HealthAssessmentResultProps) => {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.scoreCard}>
        <Card.Content>
          <Text style={styles.scoreTitle}>健康评分</Text>
          <Text style={styles.scoreValue}>{result.healthScore}</Text>
          <Text style={styles.scoreMax}>/100</Text>
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionTitle}>身体质量指数 (BMI)</Text>
          <Text style={styles.bmiValue}>{result.bmi.toFixed(1)}</Text>
          <Text style={styles.bmiCategory}>{result.bmiCategory}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionTitle}>健康建议</Text>
          {result.recommendations.map((recommendation, index) => (
            <Text key={index} style={styles.listItem}>• {recommendation}</Text>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionTitle}>生活方式改善建议</Text>
          <Text style={styles.subTitle}>运动建议</Text>
          {result.lifestyle.exercise.map((item, index) => (
            <Text key={index} style={styles.listItem}>• {item}</Text>
          ))}
          
          <Text style={styles.subTitle}>饮食建议</Text>
          {result.lifestyle.diet.map((item, index) => (
            <Text key={index} style={styles.listItem}>• {item}</Text>
          ))}
          
          <Text style={styles.subTitle}>睡眠建议</Text>
          {result.lifestyle.sleep.map((item, index) => (
            <Text key={index} style={styles.listItem}>• {item}</Text>
          ))}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={onClose}
        style={styles.closeButton}
      >
        完成
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scoreCard: {
    marginBottom: 16,
    alignItems: 'center',
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  scoreMax: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  bmiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  bmiCategory: {
    fontSize: 16,
    color: '#666',
  },
  listItem: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  closeButton: {
    marginVertical: 24,
  },
}); 