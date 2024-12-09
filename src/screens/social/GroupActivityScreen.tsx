export const GroupActivityScreen: React.FC = () => {
  const [activities, setActivities] = useState<GroupActivity[]>([]);
  const { createActivity, joinActivity } = useCommunity();
  const { user } = useAuth();

  useEffect(() => {
    loadActivities();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* 活动创建按钮 */}
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateActivity')}
      >
        <Text style={styles.buttonText}>发起活动</Text>
      </TouchableOpacity>

      {/* 活动列表 */}
      <FlatList
        data={activities}
        renderItem={({ item }) => (
          <ActivityCard
            activity={item}
            onJoin={() => joinActivity(item.id)}
            onShare={() => shareActivity(item)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadActivities} />
        }
      />
    </SafeAreaView>
  );
}; 