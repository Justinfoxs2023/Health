import React, { useState, useEffect } from 'react';

import { Surface, Text, Avatar, Button, Searchbar, FAB } from 'react-native-paper';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { AddMemberModal } from '@/components/AddMemberModal';
import { FamilyMemberCard } from '@/components/FamilyMemberCard';
import { HealthMetricsChart } from '@/components/HealthMetricsChart';
import { PermissionSettings } from '@/components/PermissionSettings';
import { useFamily } from '@/hooks/useFamily';

export const FamilyHealthScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const { familyMembers, familyReport, loadFamilyData, addMember, updateMemberSettings } =
    useFamily();

  useEffect(() => {
    loadFamilyData();
  }, []);

  const handleAddMember = async memberInfo => {
    try {
      await addMember(memberInfo);
      setShowAddModal(false);
      loadFamilyData();
    } catch (error) {
      // 处理错误
    }
  };

  const handleMemberPress = member => {
    setSelectedMember(member);
  };

  return (
    <View style={styles.container}>
      {/* 搜索栏 */}
      <Searchbar
        placeholder="搜索家庭成员..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />

      {/* 家庭成员列表 */}
      <ScrollView style={styles.memberList}>
        {familyMembers.map(member => (
          <FamilyMemberCard
            key={member.id}
            member={member}
            onPress={() => handleMemberPress(member)}
            report={familyReport?.members.find(m => m.memberId === member.id)}
          />
        ))}
      </ScrollView>

      {/* 家庭健康概览 */}
      {familyReport && (
        <Surface style={styles.healthOverview}>
          <Text style={styles.overviewTitle}>家庭健康概览</Text>
          <HealthMetricsChart data={familyReport.familyMetrics} />
          {familyReport.riskFactors.length > 0 && (
            <View style={styles.alerts}>
              <Text style={styles.alertTitle}>需要关注</Text>
              {familyReport.riskFactors.map((factor, index) => (
                <Text key={index} style={styles.alertText}>
                  {factor}
                </Text>
              ))}
            </View>
          )}
        </Surface>
      )}

      {/* 添加成员按钮 */}
      <FAB style={styles.fab} icon="plus" onPress={() => setShowAddModal(true)} />

      {/* 添加成员模态框 */}
      <AddMemberModal
        visible={showAddModal}
        onDismiss={() => setShowAddModal(false)}
        onAdd={handleAddMember}
        searchQuery={searchQuery}
      />

      {/* 成员详情模态框 */}
      {selectedMember && (
        <PermissionSettings
          member={selectedMember}
          onUpdate={updateMemberSettings}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    margin: 8,
    elevation: 2,
  },
  memberList: {
    flex: 1,
    padding: 8,
  },
  healthOverview: {
    margin: 8,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  alerts: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff3e0',
    borderRadius: 4,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f57c00',
  },
  alertText: {
    marginTop: 4,
    color: '#e65100',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
