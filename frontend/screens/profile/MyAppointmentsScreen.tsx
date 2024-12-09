import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useQuery } from 'react-query';
import { getMyAppointments } from '../../api/appointment';
import { AppointmentCard, LoadingSpinner, TabFilter } from '../../components';

export const MyAppointmentsScreen = ({ navigation }) => {
  const [status, setStatus] = React.useState('全部');

  const { data, isLoading, refetch } = useQuery(
    ['myAppointments', status],
    () => getMyAppointments(status !== '全部' ? status : undefined)
  );

  return (
    <View style={styles.container}>
      <TabFilter
        tabs={['全部', '待确认', '已确认', '已完成', '已取消']}
        activeTab={status}
        onChangeTab={setStatus}
      />
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={data?.data}
          renderItem={({ item }) => (
            <AppointmentCard
              appointment={item}
              onPress={() => navigation.navigate('AppointmentDetail', { id: item._id })}
            />
          )}
          keyExtractor={item => item._id}
          onRefresh={refetch}
          refreshing={isLoading}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  list: {
    padding: 15
  }
}); 