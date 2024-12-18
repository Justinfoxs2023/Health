import React, { useState } from 'react';

import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { Card, Text, Button, Chip, useTheme, ActivityIndicator } from 'react-native-paper';
import { View, StyleSheet, Image, ScrollView } from 'react-native';

interface INutritionInfo {
  /** calories 的描述 */
  calories: number;
  /** protein 的描述 */
  protein: number;
  /** carbs 的描述 */
  carbs: number;
  /** fat 的描述 */
  fat: number;
  /** fiber 的描述 */
  fiber: number;
  /** vitamins 的描述 */
  vitamins: {
    [key: string]: number;
  };
  /** minerals 的描述 */
  minerals: {
    [key: string]: number;
  };
}

interface IFoodAnalysis {
  /** foodName 的描述 */
  foodName: string;
  /** confidence 的描述 */
  confidence: number;
  /** portion 的描述 */
  portion: string;
  /** nutrition 的描述 */
  nutrition: INutritionInfo;
  /** healthIndex 的描述 */
  healthIndex: number;
  /** recommendations 的描述 */
  recommendations: string[];
  /** alternatives 的描述 */
  alternatives: Array<{
    name: string;
    reason: string;
  }>;
}

interface IFoodAnalyzerProps {
  /** onAnalysisComplete 的描述 */
  onAnalysisComplete: (analysis: IFoodAnalysis) => void;
}

export const FoodAnalyzer = ({ onAnalysisComplete }: IFoodAnalyzerProps) => {
  const theme = useTheme();
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<IFoodAnalysis | null>(null);

  const takePicture = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('需要相机权限来拍摄食物照片');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImage(result.assets[0].uri);
      analyzeFood(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('需要相册权限来选择食物照片');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImage(result.assets[0].uri);
      analyzeFood(result.assets[0].uri);
    }
  };

  const analyzeFood = async (imageUri: string) => {
    setAnalyzing(true);
    try {
      // 调用AI食物识别API
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'food.jpg',
      });

      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setAnalysis(result);
      onAnalysisComplete(result);
    } catch (error) {
      console.error('Error in FoodAnalyzer.tsx:', '食物分析失败:', error);
      alert('食物分析失败，请重试');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={takePicture} icon="camera" style={styles.button}>
          拍摄食物
        </Button>
        <Button mode="outlined" onPress={pickImage} icon="image" style={styles.button}>
          从相册选择
        </Button>
      </View>

      {image && (
        <Card style={styles.imageCard}>
          <Card.Cover source={{ uri: image }} style={styles.foodImage} />
        </Card>
      )}

      {analyzing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>正在分析食物营养成分...</Text>
        </View>
      )}

      {analysis && (
        <Card style={styles.analysisCard}>
          <Card.Content>
            <View style={styles.header}>
              <Text style={styles.foodName}>{analysis.foodName}</Text>
              <Chip mode="outlined">{Math.round(analysis.confidence * 100)}% 匹配</Chip>
            </View>

            <Text style={styles.sectionTitle}>营养成分</Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{analysis.nutrition.calories}</Text>
                <Text style={styles.nutritionLabel}>卡路里</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{analysis.nutrition.protein}g</Text>
                <Text style={styles.nutritionLabel}>蛋白质</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{analysis.nutrition.carbs}g</Text>
                <Text style={styles.nutritionLabel}>碳水</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{analysis.nutrition.fat}g</Text>
                <Text style={styles.nutritionLabel}>脂肪</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>健康建议</Text>
            {analysis.recommendations.map((recommendation, index) => (
              <Text key={index} style={styles.recommendation}>
                • {recommendation}
              </Text>
            ))}

            <Text style={styles.sectionTitle}>更健康的替代选择</Text>
            {analysis.alternatives.map((alternative, index) => (
              <View key={index} style={styles.alternative}>
                <Text style={styles.alternativeName}>{alternative.name}</Text>
                <Text style={styles.alternativeReason}>{alternative.reason}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  imageCard: {
    marginBottom: 16,
  },
  foodImage: {
    height: 200,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  analysisCard: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  nutritionItem: {
    width: '25%',
    padding: 8,
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  recommendation: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 22,
  },
  alternative: {
    marginBottom: 12,
  },
  alternativeName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  alternativeReason: {
    fontSize: 14,
    color: '#666',
  },
});
