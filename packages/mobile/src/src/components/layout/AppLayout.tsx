import React from 'react';

import { BottomNav } from './BottomNav';
import { Header } from './Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

interface IAppLayoutProps {
  /** children 的描述 */
  children: React.ReactNode;
  /** hideHeader 的描述 */
  hideHeader?: boolean;
  /** hideNav 的描述 */
  hideNav?: boolean;
}

export const AppLayout = ({ children, hideHeader, hideNav }: IAppLayoutProps) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {!hideHeader && <Header />}
      <View style={styles.content}>{children}</View>
      {!hideNav && <BottomNav />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
