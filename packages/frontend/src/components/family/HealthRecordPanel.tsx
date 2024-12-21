import React from 'react';

import { Card, Text, Icon, Button } from '../common';
import { GeneticFactorsList } from './GeneticFactorsList';
import { IScreeningRecord } from './ScreeningRecord';
import { MedicalHistoryList } from './MedicalHistoryList';
import { VaccinationRecord } from './VaccinationRecord';
import { View, StyleSheet, ScrollView } from 'react-native';

interface IProps {
  /** memberId 的描述 */
  memberId: string;
  /** onUpdateRecord 的描述 */
  onUpdateRecord?: () => void;
}

export const HealthRecordPanel: React.FC<IProps> = ({ memberId, onUpdateRecord }) => {
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>健康档案</Text>
          <Text style={styles.subtitle}>完整的健康记录管理</Text>
        </View>
        <Button icon="edit" title="更新记录" onPress={onUpdateRecord} type="outline" />
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
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
