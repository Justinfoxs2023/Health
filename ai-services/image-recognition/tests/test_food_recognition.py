import pytest
import tensorflow as tf
import numpy as np
from src.models.food_detection.food_recognition import FoodRecognitionModel

class TestFoodRecognitionModel:
    @pytest.fixture
    def model_config(self):
        return {
            'model_path': './test_models/food_model.h5',
            'class_names_path': './test_data/class_names.json',
            'confidence_threshold': 0.7
        }
    
    @pytest.fixture
    def test_model(self, model_config):
        return FoodRecognitionModel(model_config['model_path'], model_config)

    def test_model_initialization(self, test_model):
        """测试模型初始化"""
        assert test_model.model is not None
        assert isinstance(test_model.model, tf.keras.Model)
        assert len(test_model.class_names) > 0

    def test_image_preprocessing(self, test_model):
        """测试图像预处理"""
        test_image_path = './test_data/test_food.jpg'
        processed_img = test_model._preprocess_image(test_image_path)
        
        assert processed_img.shape == (1, 224, 224, 3)
        assert np.max(processed_img) <= 1.0
        assert np.min(processed_img) >= -1.0

    def test_prediction_format(self, test_model):
        """测试预测结果格式"""
        test_image_path = './test_data/test_food.jpg'
        predictions = test_model.predict(test_image_path)
        
        assert isinstance(predictions, list)
        assert len(predictions) <= 5  # top 5 predictions
        
        for pred in predictions:
            assert 'food' in pred
            assert 'confidence' in pred
            assert 'nutrition' in pred
            assert 0 <= pred['confidence'] <= 1 