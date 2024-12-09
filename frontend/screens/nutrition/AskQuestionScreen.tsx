import React from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useMutation } from 'react-query';
import { createQuestion } from '../../api/nutrition';
import { ImageUploader, CategorySelector, TagInput, LoadingOverlay } from '../../components';

export const AskQuestionScreen = ({ navigation }) => {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [tags, setTags] = React.useState([]);
  const [images, setImages] = React.useState([]);
  const [isPrivate, setIsPrivate] = React.useState(false);

  const mutation = useMutation(createQuestion, {
    onSuccess: () => {
      navigation.goBack();
    }
  });

  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || !category) {
      // 显示错误提示
      return;
    }

    mutation.mutate({
      title,
      content,
      category,
      tags,
      images,
      isPrivate
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TextInput
          style={styles.titleInput}
          placeholder="请输入问题标题"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />
        
        <CategorySelector
          categories={[
            '饮食咨询',
            '营养方案',
            '体重管理',
            '疾病饮食',
            '运动营养',
            '其他'
          ]}
          selectedCategory={category}
          onSelect={setCategory}
        />

        <TextInput
          style={styles.contentInput}
          placeholder="请详细描述您的问题..."
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />

        <ImageUploader
          images={images}
          onImagesChange={setImages}
          maxImages={5}
        />

        <TagInput
          tags={tags}
          onTagsChange={setTags}
          placeholder="添加标签(最多5个)"
          maxTags={5}
        />

        <TouchableOpacity
          style={styles.privateToggle}
          onPress={() => setIsPrivate(!isPrivate)}
        >
          <View style={[
            styles.checkbox,
            isPrivate && styles.checkboxChecked
          ]} />
          <Text>设为私密提问</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.submitButton,
          (!title.trim() || !content.trim() || !category) && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={!title.trim() || !content.trim() || !category}
      >
        <Text style={styles.submitButtonText}>发布问题</Text>
      </TouchableOpacity>

      {mutation.isLoading && <LoadingOverlay />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollView: {
    flex: 1,
    padding: 15
  },
  titleInput: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    marginBottom: 15
  },
  contentInput: {
    height: 200,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginVertical: 15
  },
  privateToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#2E7D32',
    borderRadius: 4,
    marginRight: 10
  },
  checkboxChecked: {
    backgroundColor: '#2E7D32'
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc'
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
}); 