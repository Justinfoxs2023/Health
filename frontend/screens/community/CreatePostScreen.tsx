import React from 'react';

import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { LoadingSpinner, Icon, AlertDialog, ImagePicker, VideoPicker } from '../../components';
import { createPost } from '../../api/community';
import { useMutation } from '@tanstack/react-query';

interfac
e MediaItem {
  type: 'image' | 'video';
  uri: string;
  thumbnailUri?: string;
}

export const CreatePostScreen = ({ navigation }) => {
  const [content, setContent] = React.useState('');
  const [postType, setPostType] = React.useState<'experience' | 'question' | 'challenge'>(
    'experience',
  );
  const [media, setMedia] = React.useState<MediaItem[]>([]);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');

  const mutation = useMutation(createPost, {
    onSuccess: () => {
      navigation.goBack();
    },
    onError: (error: any) => {
      setAlertMessage(error.message || '发布失败，请重试');
      setShowAlert(true);
    },
  });

  const handlePickImage = async () => {
    if (media.length >= 9) {
      setAlertMessage('最多只能上传9张图片或1个视频');
      setShowAlert(true);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setMedia([...media, { type: 'image', uri: result.assets[0].uri }]);
    }
  };

  const handlePickVideo = async () => {
    if (media.length > 0) {
      setAlertMessage('视频和图片不能同时上传');
      setShowAlert(true);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
      videoMaxDuration: 60,
    });

    if (!result.canceled) {
      try {
        const thumbnail = await VideoThumbnails.getThumbnailAsync(result.assets[0].uri, {
          time: 0,
        });
        setMedia([
          {
            type: 'video',
            uri: result.assets[0].uri,
            thumbnailUri: thumbnail.uri,
          },
        ]);
      } catch (error) {
        setAlertMessage('视频处理失败，请重试');
        setShowAlert(true);
      }
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      setAlertMessage('请输入内容');
      setShowAlert(true);
      return;
    }

    mutation.mutate({
      content,
      type: postType,
      media: media.map(item => ({
        type: item.type,
        uri: item.uri,
        thumbnailUri: item.thumbnailUri,
      })),
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="x" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.postTypeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, postType === 'experience' && styles.activeTypeButton]}
            onPress={() => setPostType('experience')}
          >
            <Text style={[styles.typeText, postType === 'experience' && styles.activeTypeText]}>
              经验分享
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, postType === 'question' && styles.activeTypeButton]}
            onPress={() => setPostType('question')}
          >
            <Text style={[styles.typeText, postType === 'question' && styles.activeTypeText]}>
              健康问答
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, postType === 'challenge' && styles.activeTypeButton]}
            onPress={() => setPostType('challenge')}
          >
            <Text style={[styles.typeText, postType === 'challenge' && styles.activeTypeText]}>
              团队挑战
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.publishButton, !content.trim() && styles.publishButtonDisabled]}
          onPress={handleSubmit}
          disabled={!content.trim() || mutation.isLoading}
        >
          <Text style={styles.publishButtonText}>发布</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder={
            postType === 'experience'
              ? '分享您的健康经验...'
              : postType === 'question'
              ? '描述您的健康问题...'
              : '发起一个健康挑战...'
          }
          multiline
          value={content}
          onChangeText={setContent}
        />

        {media.length > 0 && (
          <View style={styles.mediaGrid}>
            {media.map((item, index) => (
              <View key={index} style={styles.mediaItem}>
                <Image
                  source={{ uri: item.type === 'video' ? item.thumbnailUri : item.uri }}
                  style={styles.mediaPreview}
                />
                {item.type === 'video' && (
                  <View style={styles.videoIndicator}>
                    <Icon name="play-circle" size={24} color="#fff" />
                  </View>
                )}
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveMedia(index)}
                >
                  <Icon name="x-circle" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolbarButton} onPress={handlePickImage}>
          <Icon name="image" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarButton} onPress={handlePickVideo}>
          <Icon name="video" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <AlertDialog
        visible={showAlert}
        title="提示"
        message={alertMessage}
        onConfirm={() => setShowAlert(false)}
      />

      {mutation.isLoading && <LoadingSpinner />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  postTypeSelector: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 4,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeTypeButton: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeText: {
    fontSize: 14,
    color: '#666',
  },
  activeTypeText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  publishButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },
  publishButtonDisabled: {
    backgroundColor: '#ccc',
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  input: {
    fontSize: 16,
    color: '#333',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
  },
  mediaItem: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 5,
    position: 'relative',
  },
  mediaPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  videoIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  toolbar: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#f0f0f0',
  },
  toolbarButton: {
    marginRight: 20,
  },
});
