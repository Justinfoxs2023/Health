// 创建数据库和用户
db = db.getSiblingDB('health_management');

// 创建用户
db.createUser({
  user: 'health_app',
  pwd: 'health_app_password',
  roles: [{ role: 'readWrite', db: 'health_management' }]
});

// 创建集合
db.createCollection('users');
db.createCollection('health_records');
db.createCollection('exercise_records');
db.createCollection('diet_records');
db.createCollection('vital_signs');
db.createCollection('user_profiles');
db.createCollection('ai_analysis_results');

// 创建索引
// 用户集合索引
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "phone": 1 }, { unique: true });
db.users.createIndex({ "username": 1 });

// 健康记录索引
db.health_records.createIndex({ "userId": 1, "timestamp": -1 });
db.health_records.createIndex({ "type": 1, "timestamp": -1 });

// 运动记录索引
db.exercise_records.createIndex({ "userId": 1, "startTime": -1 });
db.exercise_records.createIndex({ "type": 1, "userId": 1 });

// 饮食记录索引
db.diet_records.createIndex({ "userId": 1, "timestamp": -1 });
db.diet_records.createIndex({ "mealType": 1, "timestamp": -1 });

// 生命体征索引
db.vital_signs.createIndex({ "userId": 1, "type": 1, "timestamp": -1 });

// AI分析结果索引
db.ai_analysis_results.createIndex({ "userId": 1, "type": 1, "createdAt": -1 });

// 初始化配置数据
db.system_configs.insertMany([
  {
    type: "vital_signs_thresholds",
    config: {
      heart_rate: { min: 60, max: 100 },
      blood_pressure: { 
        systolic: { min: 90, max: 140 },
        diastolic: { min: 60, max: 90 }
      },
      blood_oxygen: { min: 95, max: 100 },
      temperature: { min: 36.3, max: 37.2 }
    }
  },
  {
    type: "ai_service_configs",
    config: {
      image_recognition: {
        supported_types: ["food", "exercise", "medical"],
        confidence_threshold: 0.8
      },
      health_assessment: {
        evaluation_factors: ["vital_signs", "exercise", "diet", "sleep"],
        update_frequency: "daily"
      },
      recommendation: {
        types: ["diet", "exercise", "lifestyle"],
        refresh_interval: 3600
      }
    }
  }
]); 