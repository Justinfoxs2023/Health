// 发帖编辑器组件
export const PostEditor: React.FC = () => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<Media[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = async () => {
    try {
      const post = await createPost({
        content,
        media,
        tags,
        type: 'experience'
      });
      
      // 发布成功后的处理
      Toast.show({
        type: 'success',
        text: '发布成功'
      });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="分享您的健康经验..."
        multiline
      />
      <MediaPicker onSelect={setMedia} />
      <TagSelector onSelect={setTags} />
      <Button title="发布" onPress={handleSubmit} />
    </View>
  );
}; 