import React, { useState } from 'react';
import { Upload, Input, Button, Card, Spin } from 'antd';
import { CameraOutlined, ScanOutlined, EditOutlined } from '@ant-design/icons';
import { FoodAnalysisService, FoodAnalysisResult } from '../../services/food-analysis.service';

const FoodAnalyzer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FoodAnalysisResult | null>(null);
  const [mode, setMode] = useState<'camera' | 'barcode' | 'text'>('camera');
  
  const foodService = new FoodAnalysisService();

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    try {
      const result = await foodService.analyzeImage(file);
      setResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeInput = async (barcode: string) => {
    setLoading(true);
    try {
      const result = await foodService.analyzeBarcode(barcode);
      setResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTextInput = async (description: string) => {
    setLoading(true);
    try {
      const result = await foodService.analyzeDescription(description);
      setResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="food-analyzer">
      <div className="input-methods">
        <Button 
          icon={<CameraOutlined />} 
          onClick={() => setMode('camera')}
          type={mode === 'camera' ? 'primary' : 'default'}
        >
          拍照识别
        </Button>
        <Button 
          icon={<ScanOutlined />}
          onClick={() => setMode('barcode')}
          type={mode === 'barcode' ? 'primary' : 'default'}
        >
          扫描条形码
        </Button>
        <Button 
          icon={<EditOutlined />}
          onClick={() => setMode('text')}
          type={mode === 'text' ? 'primary' : 'default'}
        >
          文字输入
        </Button>
      </div>

      <Spin spinning={loading}>
        {mode === 'camera' && (
          <Upload.Dragger
            accept="image/*"
            beforeUpload={(file) => {
              handleImageUpload(file);
              return false;
            }}
          >
            <p>点击或拖拽上传图片</p>
          </Upload.Dragger>
        )}

        {mode === 'barcode' && (
          <Input.Search
            placeholder="输入或扫描条形码"
            enterButton="分析"
            onSearch={handleBarcodeInput}
          />
        )}

        {mode === 'text' && (
          <Input.TextArea
            placeholder="输入食物描述"
            autoSize={{ minRows: 3 }}
            onPressEnter={(e) => handleTextInput(e.currentTarget.value)}
          />
        )}

        {result && (
          <Card title="分析结果" className="analysis-result">
            <p>食物类型: {result.foodType}</p>
            <p>份量: {result.portion}g</p>
            <p>卡路里: {result.calories}kcal</p>
            <div className="nutrients">
              <h4>营养成分:</h4>
              <p>蛋白质: {result.nutrients.protein}g</p>
              <p>碳水化合物: {result.nutrients.carbs}g</p>
              <p>脂肪: {result.nutrients.fat}g</p>
              <p>膳食纤维: {result.nutrients.fiber}g</p>
            </div>
          </Card>
        )}
      </Spin>
    </div>
  );
};

export default FoodAnalyzer; 