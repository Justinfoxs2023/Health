import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export const TermsScreen = () => {
  const termsContent = [
    {
      title: '服务条款',
      content: `欢迎使用健康营养师App。在使用我们的服务之前，请您仔细阅读以下条款。使用我们的服务即表示您同意接受以下所有条款。`
    },
    {
      title: '账号注册',
      content: `1. 您需要注册账号才能使用完整服务
2. 注册信息必须真实、准确、有效
3. 您必须保护好账号和密码的安全
4. 不得将账号转让或出借给他人使用
5. 如发现账号被盗用应立即通知我们`
    },
    {
      title: '用户行为规范',
      content: `您在使用服务时应当遵守：
• 遵守法律法规
• 尊重他人权益
• 不得发布虚假或误导信息
• 不得从事违法或不当行为
• 不得滥用或破坏服务功能`
    },
    {
      title: '健康建议免责声明',
      content: `• 我们提供的健康和营养建议仅供参考
• 具体医疗问题请咨询专业医生
• 用户应对自身健康状况负责
• 我们不对因使用建议造成的后果负责
• 如有疑问请及时咨询专业人士`
    },
    {
      title: '知识产权',
      content: `• App中的内容均受知识产权保护
• 未经许可不得复制或传播
• 用户上传内容的权利归用户所有
• 用户授权我们使用其上传的内容
• 我们有权处理侵权内容`
    },
    {
      title: '服务变更与终止',
      content: `• 我们有权随时变更或终止服务
• 重大变更会提前通知用户
• 违反协议的账号可能被终止
• 终止后相关数据可能被删除
• 部分条款在终止后仍然有效`
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>用户协议</Text>
        <Text style={styles.updateDate}>
          更新日期：{new Date().toLocaleDateString()}
        </Text>
      </View>

      {termsContent.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionContent}>{section.content}</Text>
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          如您对本协议有任何疑问，请联系我们的客服团队。
        </Text>
        <Text style={styles.footerContact}>
          邮箱：support@healthapp.com{'\n'}
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