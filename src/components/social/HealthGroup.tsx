export const HealthGroup: React.FC<HealthGroupProps> = ({ group }) => {
  const [activeTab, setActiveTab] = useState('topics');
  const { user } = useAuth();
  const { joinGroup, leaveGroup } = useCommunity();

  return (
    <View style={styles.container}>
      {/* 群组头部信息 */}
      <View style={styles.header}>
        <Image source={{ uri: group.coverImage }} style={styles.coverImage} />
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>{group.name}</Text>
          <Text style={styles.memberCount}>{group.members.length}成员</Text>
          {!group.members.includes(user.id) ? (
            <Button 
              title="加入小组" 
              onPress={() => joinGroup(group.id)}
              style={styles.joinButton}
            />
          ) : (
            <Button 
              title="退出小组" 
              onPress={() => leaveGroup(group.id)}
              style={styles.leaveButton}
            />
          )}
        </View>
      </View>

      {/* 标签页导航 */}
      <TabView
        navigationState={{ index: activeTab, routes }}
        renderScene={renderScene}
        onIndexChange={setActiveTab}
        initialLayout={initialLayout}
      />
    </View>
  );
}; 