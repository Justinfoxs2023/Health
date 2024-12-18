import React from 'react';

import { Card, Text, Icon, Button, Badge } from '../common';
import { View, StyleSheet, ScrollView } from 'react-native';

interface ITherapyItem {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: 'herbal' | 'acupuncture' | 'massage' | 'aromatherapy' | 'music' | 'meditation';
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** ageGroups 的描述 */
  ageGroups: string[];
  /** benefits 的描述 */
  benefits: string[];
  /** contraindications 的描述 */
  contraindications: string[];
  /** duration 的描述 */
  duration: string;
  /** price 的描述 */
  price: number;
  /** practitioner 的描述 */
  practitioner: {
    name: string;
    title: string;
    experience: string;
  };
  /** rating 的描述 */
  rating: number;
  /** reviews 的描述 */
  reviews: number;
}

interface IProps {
  /** userId 的描述 */
  userId: string;
  /** userProfile 的描述 */
  userProfile: {
    age: number;
    gender: string;
    healthConditions: string[];
    preferences: string[];
  };
  /** recommendations 的描述 */
  recommendations?: ITherapyItem[];
}

export const TraditionalMedicine: React.FC<IProps> = ({ userId, userProfile, recommendations }) => {
  const getTherapyIcon = (type: string) => {
    switch (type) {
      case 'herbal':
        return { name: 'local-pharmacy', color: '#66BB6A' };
      case 'acupuncture':
        return { name: 'healing', color: '#42A5F5' };
      case 'massage':
        return { name: 'spa', color: '#FFA726' };
      case 'aromatherapy':
        return { name: 'local-florist', color: '#EC407A' };
      case 'music':
        return { name: 'music-note', color: '#7E57C2' };
      case 'meditation':
        return { name: 'self-improvement', color: '#26A69A' };
      default:
        return { name: 'favorite', color: '#78909C' };
    }
  };

  const renderTherapyCard = (therapy: ITherapyItem) => {
    const icon = getTherapyIcon(therapy.type);
    const isRecommended = recommendations?.some(rec => rec.id === therapy.id);

    return (
      <Card key={therapy.id} style={styles.therapyCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Icon name={icon.name} size={24} color={icon.color} />
            <View>
              <Text style={styles.therapyTitle}>{therapy.title}</Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={16} color="#FFC107" />
                <Text style={styles.ratingText}>{therapy.rating}</Text>
                <Text style={styles.reviewCount}>({therapy.reviews})</Text>
              </View>
            </View>
          </View>
          {isRecommended && <Badge color="#2E7D32" text="推荐" icon="thumb-up" />}
        </View>

        <Text style={styles.description}>{therapy.description}</Text>

        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>功效与作用</Text>
          <View style={styles.benefitsList}>
            {therapy.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Icon name="check-circle" size={16} color="#66BB6A" />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.ageGroupSection}>
          <Text style={styles.sectionTitle}>适用年龄</Text>
          <View style={styles.ageGroupTags}>
            {therapy.ageGroups.map((group, index) => (
              <View
                key={index}
                style={[
                  styles.ageGroupTag,
                  userProfile.age >= 60 && group === '老年' && styles.activeTag,
                ]}
              >
                <Text style={styles.ageGroupText}>{group}</Text>
              </View>
            ))}
          </View>
        </View>

        {therapy.contraindications.length > 0 && (
          <View style={styles.warningSection}>
            <Icon name="warning" size={20} color="#FFA726" />
            <Text style={styles.warningTitle}>禁忌提示</Text>
            <View style={styles.warningList}>
              {therapy.contraindications.map((item, index) => (
                <Text key={index} style={styles.warningText}>
                  • {item}
                </Text>
              ))}
            </View>
          </View>
        )}

        <View style={styles.practitionerSection}>
          <View style={styles.practitionerInfo}>
            <Text style={styles.practitionerName}>{therapy.practitioner.name}</Text>
            <Text style={styles.practitionerTitle}>{therapy.practitioner.title}</Text>
            <Text style={styles.practitionerExperience}>从业{therapy.practitioner.experience}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>¥{therapy.price}</Text>
            <Text style={styles.duration}>/{therapy.duration}</Text>
          </View>
          <View style={styles.actionButtons}>
            <Button title="了解详情" icon="info" type="outline" size="small" />
            <Button title="立即预约" icon="event" type="solid" size="small" />
          </View>
        </View>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>中医养生</Text>
        {/* 渲染中医疗法卡片 */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>替代疗法</Text>
        {/* 渲染替代疗法卡片 */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  therapyCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  therapyTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  reviewCount: {
    fontSize: 12,
    color: '#999',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  benefitsSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#444',
  },
  ageGroupSection: {
    marginBottom: 15,
  },
  ageGroupTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ageGroupTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeTag: {
    backgroundColor: '#2E7D32',
  },
  ageGroupText: {
    fontSize: 12,
    color: '#2E7D32',
  },
  warningSection: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F57C00',
    marginBottom: 8,
  },
  warningList: {
    gap: 4,
  },
  warningText: {
    fontSize: 13,
    color: '#666',
  },
  practitionerSection: {
    marginBottom: 15,
  },
  practitionerInfo: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
  },
  practitionerName: {
    fontSize: 15,
    fontWeight: '500',
  },
  practitionerTitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  practitionerExperience: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E7D32',
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
});
