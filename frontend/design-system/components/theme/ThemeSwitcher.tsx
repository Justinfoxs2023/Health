import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ColorTokens } from '../../styles/colors/colorTokens';
import { ThemeManager, ThemeType } from '../../styles/colors/themeManager';

interface ThemeSwitcherProps {
  onThemeChange?: (theme: ThemeType) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ onThemeChange }) => {
  const [selectedTheme, setSelectedTheme] = React.useState<ThemeType>('vibrant');
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  const themes: ThemeType[] = ['vibrant', 'soft', 'professional'];

  const handleThemeChange = (theme: ThemeType) => {
    setSelectedTheme(theme);
    ThemeManager.getInstance().setTheme({ type: theme });
    onThemeChange?.(theme);

    Animated.spring(animatedValue, {
      toValue: themes.indexOf(theme),
      useNativeDriver: true
    }).start();
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.selector,
          {
            transform: [{
              translateX: animatedValue.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0, 80, 160]
              })
            }]
          }
        ]}
      />
      {themes.map((theme) => (
        <TouchableOpacity
          key={theme}
          style={styles.themeButton}
          onPress={() => handleThemeChange(theme)}
        >
          <View style={styles.colorPreview}>
            <View style={[
              styles.colorSwatch,
              { backgroundColor: ColorTokens[theme].primary.main }
            ]} />
            <View style={[
              styles.colorSwatch,
              { backgroundColor: ColorTokens[theme].secondary.main }
            ]} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: ColorTokens.neutral.gray[100],
    borderRadius: 12,
    padding: 4,
    position: 'relative',
    height: 40
  },
  selector: {
    position: 'absolute',
    width: 76,
    height: 32,
    backgroundColor: ColorTokens.neutral.white,
    borderRadius: 8,
    margin: 4,
    ...Platform.select({
      ios: {
        shadowColor: ColorTokens.neutral.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
      },
      android: {
        elevation: 4
      }
    })
  },
  themeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    zIndex: 1
  },
  colorPreview: {
    flexDirection: 'row',
    gap: 4
  },
  colorSwatch: {
    width: 12,
    height: 12,
    borderRadius: 6
  }
}); 