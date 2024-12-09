from typing import List, Dict, Optional
import numpy as np
from sklearn.preprocessing import StandardScaler
from datetime import datetime

class UserPreference:
    def __init__(self):
        self.scaler = StandardScaler()
        
    def build_user_profile(self, 
                          health_data: Dict,
                          activity_history: List[Dict],
                          user_feedback: List[Dict]) -> Dict:
        """构建用户画像"""
        try:
            profile = {
                # 健康特征
                'health_features': self._extract_health_features(health_data),
                # 活动偏好
                'activity_preferences': self._analyze_activity_preferences(activity_history),
                # 反馈偏好
                'feedback_preferences': self._analyze_feedback(user_feedback),
                # 时间模式
                'time_patterns': self._analyze_time_patterns(activity_history),
                # 更新时间
                'updated_at': datetime.now()
            }
            
            return self._normalize_profile(profile)
        except Exception as e:
            raise Exception(f"Failed to build user profile: {str(e)}")

    def _extract_health_features(self, health_data: Dict) -> Dict:
        """提取健康特征"""
        return {
            'fitness_level': self._calculate_fitness_level(health_data),
            'health_goals': health_data.get('goals', []),
            'medical_conditions': health_data.get('conditions', []),
            'dietary_restrictions': health_data.get('dietary_restrictions', []),
            'vital_signs_patterns': self._analyze_vital_signs(health_data.get('vital_signs', {}))
        }

    def _analyze_activity_preferences(self, activity_history: List[Dict]) -> Dict:
        """分析活动偏好"""
        activities = {}
        for activity in activity_history:
            activity_type = activity['type']
            if activity_type not in activities:
                activities[activity_type] = {
                    'count': 0,
                    'duration': 0,
                    'intensity': [],
                    'completion_rate': []
                }
            
            activities[activity_type]['count'] += 1
            activities[activity_type]['duration'] += activity.get('duration', 0)
            activities[activity_type]['intensity'].append(activity.get('intensity', 0))
            activities[activity_type]['completion_rate'].append(
                activity.get('completion_rate', 0)
            )

        return {
            activity_type: {
                'frequency': data['count'],
                'avg_duration': data['duration'] / data['count'],
                'avg_intensity': np.mean(data['intensity']),
                'avg_completion_rate': np.mean(data['completion_rate'])
            }
            for activity_type, data in activities.items()
        }

    def _analyze_feedback(self, user_feedback: List[Dict]) -> Dict:
        """分析用户反馈"""
        feedback_analysis = {
            'liked_activities': [],
            'disliked_activities': [],
            'preferred_intensity': None,
            'preferred_duration': None
        }

        if not user_feedback:
            return feedback_analysis

        # 分析喜好
        for feedback in user_feedback:
            if feedback.get('rating', 0) >= 4:
                feedback_analysis['liked_activities'].append(feedback['activity_type'])
            elif feedback.get('rating', 0) <= 2:
                feedback_analysis['disliked_activities'].append(feedback['activity_type'])

        # 分析强度和时长偏好
        intensities = [f.get('intensity', 0) for f in user_feedback if f.get('rating', 0) >= 4]
        durations = [f.get('duration', 0) for f in user_feedback if f.get('rating', 0) >= 4]

        if intensities:
            feedback_analysis['preferred_intensity'] = np.mean(intensities)
        if durations:
            feedback_analysis['preferred_duration'] = np.mean(durations)

        return feedback_analysis

    def _analyze_time_patterns(self, activity_history: List[Dict]) -> Dict:
        """分析时间模式"""
        if not activity_history:
            return {}

        time_patterns = {
            'preferred_days': {},
            'preferred_hours': {},
            'consistency_score': 0
        }

        for activity in activity_history:
            activity_time = datetime.fromisoformat(activity['timestamp'])
            day = activity_time.strftime('%A')
            hour = activity_time.hour

            time_patterns['preferred_days'][day] = time_patterns['preferred_days'].get(day, 0) + 1
            time_patterns['preferred_hours'][hour] = time_patterns['preferred_hours'].get(hour, 0) + 1

        # 计算一致性分数
        time_patterns['consistency_score'] = self._calculate_consistency_score(activity_history)

        return time_patterns

    def _normalize_profile(self, profile: Dict) -> Dict:
        """标准化用户画像"""
        numerical_features = [
            profile['health_features'].get('fitness_level', 0),
            *[pref.get('avg_intensity', 0) for pref in profile['activity_preferences'].values()],
            profile['time_patterns'].get('consistency_score', 0)
        ]
        
        normalized_features = self.scaler.fit_transform([numerical_features])[0]
        
        # 更新标准化后的值
        profile['normalized_features'] = {
            'fitness_level': normalized_features[0],
            'activity_intensities': normalized_features[1:-1],
            'consistency': normalized_features[-1]
        }
        
        return profile

    def _calculate_fitness_level(self, health_data: Dict) -> float:
        """计算健康水平"""
        vital_signs = health_data.get('vital_signs', {})
        activity_level = health_data.get('activity_level', 0)
        bmi = self._calculate_bmi(health_data)
        
        # 基于多个指标计算健康水平
        fitness_score = (
            self._normalize_vital_signs(vital_signs) * 0.4 +
            activity_level * 0.3 +
            self._normalize_bmi(bmi) * 0.3
        )
        
        return min(max(fitness_score, 0.0), 1.0)

    def _analyze_vital_signs(self, vital_signs: Dict) -> Dict:
        """分析生命体征"""
        if not vital_signs:
            return {}
        
        return {
            'heart_rate_pattern': self._analyze_heart_rate(vital_signs.get('heart_rate', [])),
            'blood_pressure_pattern': self._analyze_blood_pressure(vital_signs.get('blood_pressure', [])),
            'overall_stability': self._calculate_vital_signs_stability(vital_signs)
        }

    def _calculate_consistency_score(self, activity_history: List[Dict]) -> float:
        """计算一致性分数"""
        if not activity_history:
            return 0.0
        
        # 计算活动间隔的标准差
        timestamps = [datetime.fromisoformat(a['timestamp']) for a in activity_history]
        intervals = np.diff([t.timestamp() for t in timestamps])
        
        if len(intervals) == 0:
            return 0.0
        
        # 标准差越小，一致性越高
        consistency = 1.0 / (1.0 + np.std(intervals) / (24 * 3600))  # 归一化到24小时
        return min(max(consistency, 0.0), 1.0) 