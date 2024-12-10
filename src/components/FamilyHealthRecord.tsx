import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button,
  List,
  Divider 
} from 'react-native-paper';
import { HealthMetricsView } from './HealthMetricsView';
import { MedicalHistoryTimeline } from './MedicalHistoryTimeline';
import { HealthAlertsList } from './HealthAlertsList';
import { SharingSettingsModal } from './SharingSettingsModal';

interface FamilyHealthRecordProps {
  memberId: string;
  relationship: string;
  permissions: string[];
  onUpdateSettings: (settings: any) => void;
}

export const FamilyHealthRecord: React.FC<FamilyHealthRecordProps> = ({
  memberId,
  relationship,
  permissions,
  onUpdateSettings
}) => {
  const [record, setRecord] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    loadHealthRecord();
  }, [memberId]);

  const loadHealthRecord = async () => {
    // 加载健康档案数据
    const data = await fetchHealthRecord(memberId);
    setRecord(data);
  };

  const renderHealthOverview = () => (
    <Card style={styles.section}>
      <Card.Content>
        <Title>健康概览</Title>
        <HealthMetricsView 
          metrics={record.metrics}
          trends={record.trends}
        />
        {record.alerts.length > 0 && (
          <HealthAlertsList alerts={record.alerts} />
        )}
      </Card.Content>
    </Card>
  );

  const renderMedicalHistory = () => (
    <Card style={styles.section}>
      <Card.Content>
        <Title>就医记录</Title>
        <MedicalHistoryTimeline 
          history={record.medicalHistory}
          onItemPress={handleHistoryItemPress}
        />
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* 档案导航 */}
        <List.Section>
          <List.Accordion
            title="健康概览"
            expanded={activeSection === 'overview'}
            onPress={() => setActiveSection('overview')}
          >
            {record && renderHealthOverview()}
          </List.Accordion>
          
          <List.Accordion
            title="就医记录"
            expanded={activeSection === 'medical'}
            onPress={() => setActiveSection('medical')}
          >
            {record && renderMedicalHistory()}
          </List.Accordion>
          
          <List.Accordion
            title="健康计划"
            expanded={activeSection === 'plan'}
            onPress={() => setActiveSection('plan')}
          >
            {record && renderHealthPlan()}
          </List.Accordion>
        </List.Section>

        {/* 共享设置 */}
        <Button 
          mode="outlined"
          onPress={() => setShowSettings(true)}
          style={styles.settingsButton}
        >
          档案共享设置
        </Button>
      </ScrollView>

      <SharingSettingsModal
        visible={showSettings}
        permissions={permissions}
        onDismiss={() => setShowSettings(false)}
        onUpdate={onUpdateSettings}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    margin: 8,
  },
  settingsButton: {
    margin: 16,
  }
}); 