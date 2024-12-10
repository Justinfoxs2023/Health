import pytest
from datetime import datetime, timedelta
from src.models.user_preference import UserPreference

class TestUserPreference:
    @pytest.fixture
    def preference_analyzer(self):
        return UserPreference()

    def test_fitness_level_calculation(self, preference_analyzer):
        """测试健康水平计算"""
        test_health_data = {
            'vital_signs': {
                'heart_rate': [70, 75, 72],
                'blood_pressure': [{'systolic': 120, 'diastolic': 80}]
            },
            'activity_level': 0.7,
            'height': 175,
            'weight': 70
        }
        
        fitness_level = preference_analyzer._calculate_fitness_level(test_health_data)
        assert 0 <= fitness_level <= 1
        
        # 测试边界情况
        empty_data = {}
        assert preference_analyzer._calculate_fitness_level(empty_data) == 0.0

    def test_activity_preference_analysis(self, preference_analyzer):
        """测试活动偏好分析"""
        test_activities = [
            {
                'type': 'running',
                'duration': 30,
                'intensity': 0.8,
                'timestamp': datetime.now().isoformat()
            },
            {
                'type': 'running',
                'duration': 25,
                'intensity': 0.7,
                'timestamp': (datetime.now() - timedelta(days=1)).isoformat()
            }
        ]
        
        preferences = preference_analyzer._analyze_activity_preferences(test_activities)
        assert 'running' in preferences
        assert preferences['running']['avg_duration'] == 27.5
        assert 0.7 <= preferences['running']['avg_intensity'] <= 0.8

    def test_consistency_score(self, preference_analyzer):
        """测试一致性分数计算"""
        # 规律活动测试
        regular_activities = [
            {'timestamp': (datetime.now() - timedelta(days=i)).isoformat()}
            for i in range(7)
        ]
        regular_score = preference_analyzer._calculate_consistency_score(regular_activities)
        
        # 不规律活动测试
        irregular_activities = [
            {'timestamp': (datetime.now() - timedelta(days=i*2)).isoformat()}
            for i in range(7)
        ]
        irregular_score = preference_analyzer._calculate_consistency_score(irregular_activities)
        
        assert regular_score > irregular_score 