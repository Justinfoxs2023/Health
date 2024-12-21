import React, { useState } from 'react';

import { Avatar, Button, TextInput, Text } from 'react-native-paper';
import { ImagePicker } from '../../components/ImagePicker';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useUser } from '../../hooks/useUser';

export const ProfileScreen = () => {
  const { user, updateProfile, uploadAvatar, loading } = useUser();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSave = async () => {
    await updateProfile(formData);
    setEditing(false);
  };

  const handleAvatarChange = async (image: any) => {
    await uploadAvatar(image);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <ImagePicker onImageSelected={handleAvatarChange}>
          <Avatar.Image size={80} source={{ uri: user?.avatar }} />
        </ImagePicker>
        <Text style={styles.username}>{user?.username}</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          label="用户名"
          value={formData.username}
          onChangeText={text => setFormData({ ...formData, username: text })}
          disabled={!editing}
          style={styles.input}
        />
        <TextInput
          label="邮箱"
          value={formData.email}
          onChangeText={text => setFormData({ ...formData, email: text })}
          disabled={!editing}
          style={styles.input}
        />
        <TextInput
          label="手机号"
          value={formData.phone}
          onChangeText={text => setFormData({ ...formData, phone: text })}
          disabled={!editing}
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={editing ? handleSave : () => setEditing(true)}
          loading={loading}
          style={styles.button}
        >
          {editing ? '保存' : '编辑'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
});
