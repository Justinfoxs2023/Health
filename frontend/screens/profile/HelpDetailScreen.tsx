import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useQuery } from 'react-query';
import { getHelpDetail } from '../../api/help';
import { LoadingSpinner } from '../../components';

export const HelpDetailScreen = ({ route }) => {
  const { id } = route.params;
  
  const { data, isLoading } = useQuery(
    ['helpDetail', id],
    () => getHelpDetail(id)
  );

  if (isLoading) return <LoadingSpinner />;

  const helpContent = data?.data;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{helpContent.title}</Text>
      <View style={styles.content}>
        {helpContent.sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
            {section.steps && (
              <View style={styles.steps}>
                {section.steps.map((step, stepIndex) => (
                  <View key={stepIndex} style={styles.step}>
                    <Text style={styles.stepNumber}>{stepIndex + 1}</Text>
                    <Text style={styles.stepContent}>{step}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  content: {
    padding: 15
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2E7D32'
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333'
  },
  steps: {
    marginTop: 15
  },
  step: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start'
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2E7D32',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 10,
    marginTop: 2
  },
  stepContent: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24
  }
}); 