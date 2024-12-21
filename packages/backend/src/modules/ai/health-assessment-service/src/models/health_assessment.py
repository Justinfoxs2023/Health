import numpy as np
from sklearn.ensemble import RandomForestClassifier
from .data_processor import DataProcessor

class HealthAssessmentModel:
    def __init__(self, config):
        self.config = config
        self.model = self._init_model()
        self.data_processor = DataProcessor()

    def assess_health(self, user_data):
        """
        评估用户健康状况
        """
        processed_data = self.data_processor.process_user_data(user_data)
        assessment = self._generate_assessment(processed_data)
        recommendations = self._generate_recommendations(assessment)
        
        return {
            'assessment': assessment,
            'recommendations': recommendations,
            'risk_factors': self._analyze_risk_factors(processed_data)
        }

    def _generate_assessment(self, data):
        vital_signs_score = self._assess_vital_signs(data['vital_signs'])
        lifestyle_score = self._assess_lifestyle(data['lifestyle'])
        medical_score = self._assess_medical_history(data['medical_history'])
        
        return {
            'overall_score': self._calculate_overall_score([
                vital_signs_score,
                lifestyle_score,
                medical_score
            ]),
            'categories': {
                'vital_signs': vital_signs_score,
                'lifestyle': lifestyle_score,
                'medical': medical_score
            }
        }

    def _analyze_risk_factors(self, data):
        risk_factors = []
        
        # 分析各项指标风险
        for category, metrics in data.items():
            risks = self._check_category_risks(category, metrics)
            if risks:
                risk_factors.extend(risks)
        
        return sorted(risk_factors, key=lambda x: x['severity'], reverse=True)

    def _generate_recommendations(self, assessment):
        recommendations = []
        
        # 基于评估结果生成建议
        for category, score in assessment['categories'].items():
            if score < 0.6:  # 低于60分需要改善
                recommendations.extend(
                    self._get_category_recommendations(category, score)
                )
        
        return recommendations 