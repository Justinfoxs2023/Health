import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

export const HealthSurveyScreen = () => {
  const navigation = useNavigation();

  const handleSurveyComplete = (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);
    // 处理问卷完成事件
    navigation.navigate('SurveyComplete', { results: data });
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'YOUR_SURVEY_URL' }}
        onMessage={handleSurveyComplete}
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
}); 