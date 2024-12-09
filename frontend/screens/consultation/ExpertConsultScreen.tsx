import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getExperts } from '../../api/consultation';
import { LoadingSpinner, Icon, RatingStars } from '../../components';

interface Expert {
  id: string;
  name: string;
  avatar: string;
  title: string;
  hospital: string;
  department: string;
  specialties: string[];
  rating: number;
  consultCount: number;
  price: number;
  availableTime: {
    date: string;
    slots: string[];
  }[];
  introduction: string;
  tags: string[];
}

export const ExpertConsultScreen = ({ navigation }) => {
  const [selectedDepartment, setSelectedDepartment] = React.useState<string>('all');
  const { data: experts, isLoading } = useQuery<Expert[]>('experts', getExperts);

  const departments = [
    { id: 'all', name: '全部' },
    { id: 'nutrition', name: '营养科' },
    { id: 'sports', name: '运动医学科' },
    { id: 'rehabilitation', name: '康复科' },
    { id: 'psychology', name: '心理咨询' }
  ];

  const filteredExperts = experts?.filter(expert => 
    selectedDepartment === 'all' || expert.department === selectedDepartment
  );

  const renderExpert = ({ item: expert }: { item: Expert }) => (
    <TouchableOpacity
      style={styles.expertCard}
      onPress={() => navigation.navigate('ExpertDetail', { id: expert.id })}
    >
      <View style={styles.expertHeader}>
        <Image source={{ uri: expert.avatar }} style={styles.avatar} />
        <View style={styles.expertInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{expert.name}</Text>
            <Text style={styles.title}>{expert.title}</Text>
          </View>
          <Text style={styles.hospital}>{expert.hospital}</Text>
          <View style={styles.ratingRow}>
            <RatingStars rating={expert.rating} size={16} />
            <Text style={styles.consultCount}>已咨询 {expert.consultCount} 次</Text>
          </View>
        </View>
      </View>

      <View style={styles.specialtiesContainer}>
        {expert.specialties.map((specialty, index) => (
          <View key={index} style={styles.specialtyTag}>
            <Text style={styles.specialtyText}>{specialty}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.introduction} numberOfLines={2}>
        {expert.introduction}
      </Text>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>咨询费用</Text>
          <Text style={styles.price}>¥{expert.price}</Text>
          <Text style={styles.priceUnit}>/次</Text>
        </View>

        <View style={styles.availableTimeContainer}>
          <Text style={styles.timeLabel}>近期可约时间</Text>
          <View style={styles.timeSlots}>
            {expert.availableTime[0]?.slots.slice(0, 2).map((slot, index) => (
              <Text key={index} style={styles.timeSlot}>{slot}</Text>
            ))}
            {expert.availableTime[0]?.slots.length > 2 && (
              <Text style={styles.moreTimes}>更多...</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.consultButton}
          onPress={() => navigation.navigate('BookConsultation', { expertId: expert.id })}
        >
          <Text style={styles.consultButtonText}>立即咨询</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>专家咨询</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ConsultationHistory')}>
          <Icon name="clock" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.departmentBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={departments}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.departmentButton,
                selectedDepartment === item.id && styles.activeDepartmentButton
              ]}
              onPress={() => setSelectedDepartment(item.id)}
            >
              <Text style={[
                styles.departmentText,
                selectedDepartment === item.id && styles.activeDepartmentText
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.departmentList}
        />
      </View>

      <FlatList
        data={filteredExperts}
        renderItem={renderExpert}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  departmentBar: {
    backgroundColor: '#fff',
    paddingVertical: 10
  },
  departmentList: {
    paddingHorizontal: 15
  },
  departmentButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 10
  },
  activeDepartmentButton: {
    backgroundColor: '#E8F5E9'
  },
  departmentText: {
    fontSize: 14,
    color: '#666'
  },
  activeDepartmentText: {
    color: '#2E7D32',
    fontWeight: 'bold'
  },
  list: {
    padding: 15
  },
  expertCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15
  },
  expertHeader: {
    flexDirection: 'row',
    marginBottom: 15
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15
  },
  expertInfo: {
    flex: 1
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8
  },
  title: {
    fontSize: 14,
    color: '#666'
  },
  hospital: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  consultCount: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12
  },
  specialtyTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8
  },
  specialtyText: {
    fontSize: 12,
    color: '#2E7D32'
  },
  introduction: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#f0f0f0'
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  priceLabel: {
    fontSize: 12,
    color: '#999'
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F57C00',
    marginLeft: 4
  },
  priceUnit: {
    fontSize: 12,
    color: '#999',
    marginLeft: 2
  },
  availableTimeContainer: {
    flex: 1,
    marginLeft: 15
  },
  timeLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4
  },
  timeSlots: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  timeSlot: {
    fontSize: 12,
    color: '#2E7D32',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6
  },
  moreTimes: {
    fontSize: 12,
    color: '#999'
  },
  consultButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 15
  },
  consultButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  separator: {
    height: 10
  }
}); 