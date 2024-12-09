import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.preprocessing import image
import numpy as np
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class FoodRecognitionModel:
    """食物识别模型类"""
    
    def __init__(self, model_path: str, config: Dict[str, Any]) -> None:
        """
        初始化食物识别模型
        
        Args:
            model_path: 模型文件路径
            config: 模型配置
        """
        self.model = self._load_model(model_path)
        self.config = config
        self.preprocess = tf.keras.applications.resnet50.preprocess_input
        self.class_names = self._load_class_names()
        logger.info("Food recognition model initialized successfully")

    def _load_model(self, model_path: str) -> tf.keras.Model:
        """
        加载模型
        
        Args:
            model_path: 模型文件路径
            
        Returns:
            加载的模型实例
        """
        try:
            base_model = ResNet50(weights='imagenet', include_top=False)
            x = tf.keras.layers.GlobalAveragePooling2D()(base_model.output)
            x = tf.keras.layers.Dense(1024, activation='relu')(x)
            predictions = tf.keras.layers.Dense(
                len(self.class_names), 
                activation='softmax'
            )(x)
            model = tf.keras.Model(inputs=base_model.input, outputs=predictions)
            model.load_weights(model_path)
            return model
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            raise

    def predict(self, img_path: str) -> List[Dict[str, Any]]:
        """
        预测图片中的食物
        
        Args:
            img_path: 图片路径
            
        Returns:
            预测结果列表
        """
        try:
            img = self._preprocess_image(img_path)
            predictions = self.model.predict(img)
            return self._process_predictions(predictions[0])
        except Exception as e:
            logger.error(f"Prediction failed: {str(e)}")
            raise