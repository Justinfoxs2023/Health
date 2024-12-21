import React from 'react';

import { LoadingSpinner, ReviewList, AvailabilityCalendar, ServiceCard } from '../../components';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { getNutritionistDetail } from '../../api/nutritionist';
import { useQuery } from 'react-query';

export const NutritionistDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { data, isLoading } = useQuery(['nutritionist', id], () => getNutritionistDetail(id));

  if (isLoading) return <LoadingSpinner />;

  const nutritionist = data?.data;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: nutritionist.avatar }} style={styles.avatar} />
        <View style={styles.basicInfo}>
          <Text style={styles.name}>{nutritionist.name}</Text>
          <Text style={styles.title}>{nutritionist.title}</Text>
          <View style={styles.stats}>
            <Text style={styles.statItem}>咨询 {nutritionist.consultationCount}</Text>
            <Text style={styles.statItem}>好评率 {nutritionist.rating}%</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>个人简介</Text>
        <Text style={styles.bio}>{nutritionist.bio}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>专业领域</Text>
        <View style={styles.tagContainer}>
          {nutritionist.specialties.map((specialty, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{specialty}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>提供服务</Text>
        {nutritionist.services.map((service, index) => (
          <ServiceCard key={index} service={service} style={styles.serviceCard} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>工作时间</Text>
        <AvailabilityCalendar availability={nutritionist.availability} style={styles.calendar} />
      </View>

      <View style={styles.section}>
        <View style={styles.reviewHeader}>
          <Text style={styles.sectionTitle}>用户评价</Text>
          <Text style={styles.reviewCount}>共 {nutritionist.reviews.length} 条</Text>
        </View>
        <ReviewList reviews={nutritionist.reviews} style={styles.reviewList} />
      </View>

      <TouchableOpacity
        style={styles.consultButton}
        onPress={() => navigation.navigate('NewConsultation', { nutritionistId: id })}
      >
        <Text style={styles.consultButtonText}>立即咨询</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  basicInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
  },
  statItem: {
    fontSize: 14,
    color: '#666',
    marginRight: 15,
  },
  section: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#E8F5E9',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  tagText: {
    color: '#2E7D32',
    fontSize: 14,
  },
  serviceCard: {
    marginBottom: 10,
  },
  calendar: {
    marginTop: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
  },
  reviewList: {
    marginTop: 10,
  },
  consultButton: {
    backgroundColor: '#2E7D32',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  consultButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
