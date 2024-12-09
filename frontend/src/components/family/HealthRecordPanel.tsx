import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Icon, Button } from '../common';
import { MedicalHistoryList } from './MedicalHistoryList';
import { GeneticFactorsList } from './GeneticFactorsList';
import { VaccinationRecord } from './VaccinationRecord';
import { ScreeningRecord } from './ScreeningRecord';

interface Props {
  memberId: string;
  onUpdateRecord?: () => void;
}

export const HealthRecordPanel: React.FC<Props> = ({
  memberId,
  onUpdateRecord
}) => {
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>健康档案</Text>
          <Text style={styles.subtitle}>完整的健康记录管理</Text>
        </View>
        <Button
          icon="edit"
          title="更新记录"
          onPress={onUpdateRecord}
          type="outline"
        />
      </View>

      <ScrollView>
        <MedicalHistoryList memberId={memberId} />
        <GeneticFactorsList memberId={memberId} />
        <VaccinationRecord memberId={memberId} />
        <ScreeningRecord memberId={memberId} />
      </ScrollView>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginBottom: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32'
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  }
}); 