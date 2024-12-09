import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export const PrivacyScreen = () => {
  const privacyContent = [
    {
      title: '信息收集',
      content: `我们收集的信息包括但不限于：
• 个人基本信息（姓名、性别、年龄等）
• 身体健康数据（身高、体重、运动数据等）
• 饮食习惯和偏好
• 设备信息和使用数据

这些信息用于为您提供个性化的健康和营养建议服务。`
    },
    {
      title: '信息使用',
      content: `我们使用收集的信息：
• 提供和改进我们的服务
• 个性化您的使用体验
• 发送服务通知和更新
• 进行数据分析和研究
• 遵守法律法规要求`
    },
    {
      title: '信息保护',
      content: `我们采取严格的安全措施保护您的信息：
• 数据加密存储和传输
• 访问权限控制
• 定期安全审计
• 员工保密培训
• 第三方合作伙伴审查`
    },
    {
      title: '信息共享',
      content: `在未经您同意的情况下，我们不会与第三方共享您的个人信息，除非：
• 法律法规要求
• 保护用户或公众安全
• 防止欺诈或滥用行为
• 保护我们的合法权益`
    },
    {
      title: '您的权利',
      content: `您对您的个人信息拥有以下权利：
• 访问和查看
• 更正和更新
• 删除
• 撤回同意
• 导出数据
• 投诉和建议`
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>隐私政策</Text>
        <Text style={styles.updateDate}>
          更新日期：{new Date().toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.introduction}>
        <Text style={styles.introText}>
          我们重视您的隐私。本隐私政策说明了我们如何收集、使用、保护和共享您的个人信息。请您仔细阅读并理解本政策的全部内容。
        </Text>
      </View>

      {privacyContent.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionContent}>{section.content}</Text>
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          如果您对本隐私政策有任何疑问，请联系我们的客服团队。
        </Text>
        <Text style={styles.footerContact}>
          邮箱：privacy@healthapp.com{'\n'}
          电话：400-123-4567
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  updateDate: {
    fontSize: 14,
    color: '#666'
  },
  introduction: {
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  introText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  sectionContent: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24
  },
  footer: {
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  footerText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10
  },
  footerContact: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  }
}); 