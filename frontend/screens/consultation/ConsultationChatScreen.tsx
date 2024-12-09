import React from 'react';
import { View, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getConsultationMessages, sendMessage } from '../../api/consultation';
import { LoadingSpinner, Icon, ImagePicker } from '../../components';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Message {
  id: string;
  senderId: string;
  senderType: 'user' | 'expert';
  content: string;
  type: 'text' | 'image';
  createdAt: string;
}

export const ConsultationChatScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [message, setMessage] = React.useState('');
  const flatListRef = React.useRef<FlatList>(null);
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery<Message[]>(
    ['consultationMessages', id],
    () => getConsultationMessages(id),
    {
      refetchInterval: 5000 // 每5秒刷新一次消息
    }
  );

  const sendMutation = useMutation(sendMessage, {
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries(['consultationMessages', id]);
    }
  });

  const handleSend = () => {
    if (!message.trim()) return;
    sendMutation.mutate({
      consultationId: id,
      content: message.trim(),
      type: 'text'
    });
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      sendMutation.mutate({
        consultationId: id,
        content: result.assets[0].uri,
        type: 'image'
      });
    }
  };

  const renderMessage = ({ item: message }: { item: Message }) => {
    const isUser = message.senderType === 'user';

    return (
      <View style={[styles.messageRow, isUser && styles.userMessageRow]}>
        {!isUser && (
          <Image source={{ uri: message.senderAvatar }} style={styles.avatar} />
        )}
        <View style={[styles.messageBubble, isUser && styles.userMessageBubble]}>
          {message.type === 'text' ? (
            <Text style={[styles.messageText, isUser && styles.userMessageText]}>
              {message.content}
            </Text>
          ) : (
            <Image
              source={{ uri: message.content }}
              style={styles.messageImage}
              resizeMode="cover"
            />
          )}
          <Text style={[styles.messageTime, isUser && styles.userMessageTime]}>
            {format(new Date(message.createdAt), 'HH:mm', { locale: zhCN })}
          </Text>
        </View>
        {isUser && (
          <Image source={{ uri: message.senderAvatar }} style={styles.avatar} />
        )}
      </View>
    );
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
          <Icon name="image" size={24} color="#666" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="输入消息..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!message.trim() || sendMutation.isLoading}
        >
          <Icon name="send" size={20} color={message.trim() ? '#fff' : '#999'} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  messageList: {
    padding: 15
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end'
  },
  userMessageRow: {
    flexDirection: 'row-reverse'
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 8
  },
  messageBubble: {
    maxWidth: '70%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderTopLeftRadius: 4
  },
  userMessageBubble: {
    backgroundColor: '#E8F5E9',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 4
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22
  },
  userMessageText: {
    color: '#2E7D32'
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end'
  },
  userMessageTime: {
    color: '#81C784'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#f0f0f0'
  },
  imageButton: {
    padding: 8
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 8,
    fontSize: 16,
    maxHeight: 100
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendButtonDisabled: {
    backgroundColor: '#f5f5f5'
  }
}); 