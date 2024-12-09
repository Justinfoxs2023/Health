import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CustomIcon } from '../../icons';
import { DesignTokens } from '../../tokens';

interface HealthAdviceCardProps {
  title: string;
  description: string;
  type: 'diet' | 'exercise' | 'lifestyle' | 'medical';
  priority: 'high' | 'medium' | 'low';
  imageUrl?: string;
  onPress?: () => void;
}

export const HealthAdviceCard: React.FC<HealthAdviceCardProps> = ({
  title,
  description,
  type,
  priority,
  imageUrl,
  onPress
}) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'diet':
        return 'restaurant';
      case 'exercise':
        return 'fitness-center';
      case 'lifestyle':
        return 'lifestyle';
      case 'medical':
        return 'medical-services';
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 'high':
        return DesignTokens.colors.functional.error;
      case 'medium':
        return DesignTokens.colors.functional.warning;
      case 'low':
        return DesignTokens.colors.functional.success;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <CustomIcon 
            name={getTypeIcon()} 
            size={20} 
            color={DesignTokens.colors.brand.primary} 
          />
          <Text style={styles.type}>{type.toUpperCase()}</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
          <Text style={styles.priorityText}>{priority}</Text>
        </View>
      </View>

      {imageUrl && (
        <Image 
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>了解更多</Text>
        <CustomIcon 
          name="arrow-forward" 
          size={16} 
          color={DesignTokens.colors.brand.primary} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DesignTokens.colors.background.paper,
    borderRadius: DesignTokens.radius.lg,
    overflow: 'hidden',
    ...DesignTokens.shadows.md
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: DesignTokens.spacing.md
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  type: {
    marginLeft: DesignTokens.spacing.sm,
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.text.secondary
  },
  priorityBadge: {
    paddingHorizontal: DesignTokens.spacing.sm,
    paddingVertical: DesignTokens.spacing.xs,
    borderRadius: DesignTokens.radius.full
  },
  priorityText: {
    fontSize: DesignTokens.typography.sizes.xs,
    color: DesignTokens.colors.neutral.white,
    textTransform: 'uppercase'
  },
  image: {
    width: '100%',
    height: 150
  },
  content: {
    padding: DesignTokens.spacing.lg
  },
  title: {
    fontSize: DesignTokens.typography.sizes.lg,
    fontWeight: String(DesignTokens.typography.weights.semibold),
    color: DesignTokens.colors.text.primary,
    marginBottom: DesignTokens.spacing.sm
  },
  description: {
    fontSize: DesignTokens.typography.sizes.md,
    color: DesignTokens.colors.text.secondary
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: DesignTokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: DesignTokens.colors.border
  },
  actionButtonText: {
    marginRight: DesignTokens.spacing.sm,
    fontSize: DesignTokens.typography.sizes.md,
    color: DesignTokens.colors.brand.primary,
    fontWeight: String(DesignTokens.typography.weights.medium)
  }
}); 