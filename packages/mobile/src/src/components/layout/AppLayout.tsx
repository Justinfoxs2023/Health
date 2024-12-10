import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideNav?: boolean;
}

export const AppLayout = ({ children, hideHeader, hideNav }: AppLayoutProps) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {!hideHeader && <Header />}
      <View style={styles.content}>
        {children}
      </View>
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