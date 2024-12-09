import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { Icon } from './Icon';

interface Step {
  title: string;
  icon: string;
}

interface Props {
  steps: Step[];
  current: number;
  style?: any;
}

export const Steps: React.FC<Props> = ({ steps, current, style }) => {
  return (
    <View style={[styles.container, style]}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <View style={styles.step}>
            <View style={[
              styles.iconContainer,
              index <= current && styles.activeIconContainer,
              index < current && styles.completedIconContainer
            ]}>
              <Icon
                name={index < current ? 'check' : step.icon}
                size={20}
                color={index <= current ? '#fff' : '#999'}
              />
            </View>
            <Text style={[
              styles.title,
              index <= current && styles.activeTitle
            ]}>
              {step.title}
            </Text>
          </View>
          {index < steps.length - 1 && (
            <View style={[
              styles.connector,
              index < current && styles.activeConnector
            ]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  step: {
    alignItems: 'center',
    flex: 1
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  activeIconContainer: {
    backgroundColor: '#2E7D32'
  },
  completedIconContainer: {
    backgroundColor: '#66BB6A'
  },
  title: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center'
  },
  activeTitle: {
    color: '#2E7D32',
    fontWeight: '500'
  },
  connector: {
    height: 2,
    flex: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: -15
  },
  activeConnector: {
    backgroundColor: '#66BB6A'
  }
}); 