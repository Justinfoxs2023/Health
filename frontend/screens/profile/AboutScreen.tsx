import React from 'react';
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { Icon } from '../../components';
import { version } from '../../package.json';

export const AboutScreen = ({ navigation }) => {
  const handlePress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.appName}>健康营养师</Text>
        <Text style={styles.version}>版本 {version}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>关于我们</Text>
        <Text style={styles.description}>
          健康营养师是一款专注于为用户提供专业营养咨询和健康管理服务的应用。我们致力于通过科学的方法，帮助用户建立健康的生活方式，实现健康管理目标。
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>联系我们</Text>
        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => handlePress('mailto:support@healthapp.com')}
        >
          <Icon name="mail" size={20} color="#666" />
          <Text style={styles.contactText}>support@healthapp.com</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => handlePress('tel:400-123-4567')}
        >
          <Icon name="phone" size={20} color="#666" />
          <Text style={styles.contactText}>400-123-4567</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => handlePress('https://www.healthapp.com')}
        >
          <Icon name="globe" size={20} color="#666" />
          <Text style={styles.contactText}>www.healthapp.com</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>关注我们</Text>
        <View style={styles.socialRow}>
          <Image
            source={require('../../assets/images/wechat-qr.png')}
            style={styles.qrCode}
          />
          <View style={styles.socialInfo}>
            <Text style={styles.socialTitle}>微信公众号</Text>
            <Text style={styles.socialDesc}>关注获取更多健康资讯</Text>
          </View>
        </View>
      </View>

      <View style={styles.links}>
        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate('Privacy')}
        >
          <Text style={styles.linkText}>隐私政策</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate('Terms')}
        >
          <Text style={styles.linkText}>用户协议</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.copyright}>
        Copyright © {new Date().getFullYear()} HealthApp
        {'\n'}All rights reserved
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    alignItems: 'center',
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 15
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  version: {
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
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  contactText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  qrCode: {
    width: 100,
    height: 100,
    marginRight: 15
  },
  socialInfo: {
    flex: 1
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  socialDesc: {
    fontSize: 14,
    color: '#666'
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20
  },
  link: {
    marginHorizontal: 15
  },
  linkText: {
    fontSize: 16,
    color: '#2E7D32'
  },
  copyright: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginBottom: 20
  }
}); 