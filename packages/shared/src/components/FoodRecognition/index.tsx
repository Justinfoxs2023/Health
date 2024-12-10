import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../Card';
import { Loading } from '../Loading';
import { FoodRecognitionResult, foodService } from '../../services/food';
import { CameraIcon, UploadIcon, RefreshIcon } from '@heroicons/react/outline';

interface Props {
  /** 识别结果回调 */
  onResult?: (result: FoodRecognitionResult) => void;
  /** 错误回调 */
  onError?: (error: Error) => void;
}

/** 食物识别组件 */
export const FoodRecognitionComponent: React.FC<Props> = ({
  onResult,
  onError
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [result, setResult] = useState<FoodRecognitionResult>();

  /** 处理文件选择 */
  const handleFileSelect = async (file: File) => {
    try {
      setLoading(true);
      setError(undefined);
      setResult(undefined);

      // 预览图片
      const reader = new FileReader();
      reader.onload = e => setImage(e.target?.result as string);
      reader.readAsDataURL(file);

      // 识别食物
      const recognitionResult = await foodService.recognizeFood(file);
      setResult(recognitionResult);
      onResult?.(recognitionResult);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  /** 处理文件输入变化 */
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  /** 处理拖放 */
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  /** 处理拖拽进入 */
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  /** 打开文件选择器 */
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  /** 重试 */
  const handleRetry = () => {
    setImage(undefined);
    setError(undefined);
    setResult(undefined);
  };

  /** 获取营养素值的显示文本 */
  const getNutrientValueText = (value: number, unit: string): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}${unit === 'mg' ? 'g' : 'mg'}`;
    }
    return `${value.toFixed(1)}${unit}`;
  };

  return (
    <Card className="p-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* 上传区域 */}
      {!image && !loading && !result && (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
          onClick={openFileSelector}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col items-center">
            <UploadIcon className="w-12 h-12 text-gray-400 mb-4" />
            <div className="text-lg font-medium mb-2">{t('food.recognition.upload')}</div>
            <div className="text-sm text-gray-500">{t('food.recognition.tips')}</div>
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {loading && (
        <div className="text-center py-8">
          <Loading />
          <div className="mt-4 text-gray-500">{t('food.recognition.processing')}</div>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            onClick={handleRetry}
          >
            <RefreshIcon className="w-5 h-5 inline-block mr-2" />
            {t('food.recognition.retry')}
          </button>
        </div>
      )}

      {/* 识别结果 */}
      {result && (
        <div>
          <div className="flex items-start gap-6">
            {/* 食物图片 */}
            {image && (
              <div className="w-1/3">
                <img
                  src={image}
                  alt={result.name}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}

            {/* 食物信息 */}
            <div className="flex-1">
              <div className="mb-6">
                <div className="text-2xl font-bold mb-2">{result.name}</div>
                <div className="text-gray-500">{result.description}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    {t('food.info.type')}
                  </div>
                  <div className="font-medium">
                    {t(`food.types.${result.type}`)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    {t('food.info.confidence')}
                  </div>
                  <div className="font-medium">
                    {(result.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* 营养成分 */}
              <div>
                <div className="text-lg font-medium mb-4">
                  {t('food.info.nutrients')}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {result.nutrients.map((nutrient, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="text-sm text-gray-500 mb-1">
                        {t(`nutrition.nutrients.${nutrient.type}`)}
                      </div>
                      <div className="text-lg font-medium">
                        {getNutrientValueText(nutrient.value, nutrient.unit)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="mt-6 flex gap-4">
                <button
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  onClick={handleRetry}
                >
                  <RefreshIcon className="w-5 h-5 inline-block mr-2" />
                  {t('food.recognition.retry')}
                </button>
                <button
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                  onClick={openFileSelector}
                >
                  <CameraIcon className="w-5 h-5 inline-block mr-2" />
                  {t('food.recognition.upload')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default FoodRecognitionComponent; 