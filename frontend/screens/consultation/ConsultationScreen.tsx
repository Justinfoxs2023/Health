import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useQuery } from 'react-query';
import { getConsultationHistory } from '../../api/consultation';
import {
  ConsultationCard,
  LoadingSpinner,
  EmptyState,
  TabFilter
} from '../../components';

export const ConsultationScreen = ({ navigation }) => {
  const [status, setStatus] = React.useState('全部');
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const { data, isLoading, isFetchingMore, fetchMore, refetch } = useQuery(
    ['consultations', status, page],
    () => getConsultationHistory({ status, page, limit }),
    {
      keepPreviousData: true
    }
  );

  const handleLoadMore = () => {
    if (data?.data.pagination.total > page * limit) {
      setPage(prev => prev + 1);
    }
  };

  const renderItem = ({ item }) => (
    <ConsultationCard
      consultation={item}
      onPress={() => navigation.navigate('ConsultationDetail', { id: item._id })}
    />
  );

  if (isLoading && page === 1) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <TabFilter
        tabs={['全部', '待回复', '已回复', '已完成']}
        activeTab={status}
        onChangeTab={(tab) => {
          setStatus(tab);
          setPage(1);
        }}
        style={styles.filter}
      />

      <FlatList
        data={data?.data.consultations}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            icon="message-square"
            title="暂无咨询记录"
            description="开始您的第一次营养咨询吧"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        refreshing={isLoading}
        onRefresh={refetch}
        ListFooterComponent={
          isFetchingMore ? (
            <LoadingSpinner style={styles.loadingMore} />
          ) : null
        }
      />

      <TouchableOpacity
        style={styles.newButton}
        onPress={() => navigation.navigate('NewConsultation')}
      >
        <Text style={styles.newButtonText}>发起新咨询</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  filter: {
    backgroundColor: '#fff',
    paddingVertical: 10
  },
  list: {
    padding: 15,
    flexGrow: 1
  },
  separator: {
    height: 15
  },
  loadingMore: {
    paddingVertical: 15
  },
  newButton: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  newButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
}); 