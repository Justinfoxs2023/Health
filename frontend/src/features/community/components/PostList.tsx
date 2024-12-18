/**
 * @fileoverview TSX 文件 PostList.tsx 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const socket = useSocket();

  useEffect(() => {
    // 监听实时互动更新
    socket.on('interaction_update', data => {
      setPosts(prev =>
        prev.map(post =>
          post.id === data.postId
            ? { ...post, interactions: { ...post.interactions, [data.type]: data.count } }
            : post,
        ),
      );
    });

    return () => {
      socket.off('interaction_update');
    };
  }, []);

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <PostCard post={item} />}
      refreshControl={<RefreshControl onRefresh={fetchPosts} />}
    />
  );
};
