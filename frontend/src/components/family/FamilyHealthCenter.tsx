import React, { useState, useEffect } from 'react';

import { Card, Text, Button } from '../common';
import { FamilyActivityCard } from './FamilyActivityCard';
import { FamilyMemberList } from './FamilyMemberList';
import { HealthRecordPanel } from './HealthRecordPanel';
import { PreventiveCareCard } from './PreventiveCareCard';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useFamilyHealth } from '../../hooks/family';

export const FamilyHealthCenter: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const { familyData, loading, error } = useFamilyHealth();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.header}>
        <Text style={styles.title}>家庭健康中心</Text>
        <Text style={styles.subtitle}>全家人的健康守护者</Text>
      </Card>

      <FamilyMemberList
        members={familyData?.members}
        selectedMember={selectedMember}
        onSelectMember={setSelectedMember}
      />

      {selectedMember && <HealthRecordPanel memberId={selectedMember.id} />}

      <PreventiveCareCard
        vaccinations={familyData?.preventiveCare.vaccinations}
        screenings={familyData?.preventiveCare.screenings}
      />

      <FamilyActivityCard
        exercises={familyData?.familyActivities.exercises}
        mealPlans={familyData?.familyActivities.mealPlans}
        education={familyData?.familyActivities.education}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});
