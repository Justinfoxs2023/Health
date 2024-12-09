// 初始化数据库集合
db = db.getSiblingDB('health_management');

// 创建用户集合
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "password", "status"],
      properties: {
        username: {
          bsonType: "string",
          description: "用户名 - 必填且唯一"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "邮箱 - 必填且符合邮箱格式"
        },
        phone: {
          bsonType: "string",
          description: "手机号"
        },
        password: {
          bsonType: "string",
          description: "密码 - 加密存储"
        },
        status: {
          enum: ["active", "inactive", "locked"],
          description: "账号状态"
        },
        profile: {
          bsonType: "object",
          properties: {
            name: { bsonType: "string" },
            gender: { bsonType: "string" },
            birthDate: { bsonType: "date" },
            height: { bsonType: "number" },
            weight: { bsonType: "number" }
          }
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

// 创建健康数据集合
db.createCollection('health_records', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "type", "data", "timestamp"],
      properties: {
        userId: {
          bsonType: "objectId",
          description: "关联用户ID"
        },
        type: {
          enum: ["vital_signs", "exercise", "diet", "sleep"],
          description: "记录类型"
        },
        data: {
          bsonType: "object",
          properties: {
            value: { bsonType: "number" },
            unit: { bsonType: "string" },
            metadata: { bsonType: "object" }
          }
        },
        deviceId: { bsonType: "string" },
        timestamp: { bsonType: "date" }
      }
    }
  }
});

// 创建AI分析结果集合
db.createCollection('ai_analysis', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "type", "results", "createdAt"],
      properties: {
        userId: {
          bsonType: "objectId",
          description: "关联用户ID"
        },
        type: {
          enum: ["food_recognition", "health_assessment", "recommendation"],
          description: "分析类型"
        },
        results: {
          bsonType: "object",
          properties: {
            predictions: { bsonType: "array" },
            confidence: { bsonType: "number" },
            recommendations: { bsonType: "array" }
          }
        },
        modelInfo: {
          bsonType: "object",
          properties: {
            modelId: { bsonType: "string" },
            version: { bsonType: "string" }
          }
        },
        createdAt: { bsonType: "date" }
      }
    }
  }
});

// 创建索引
// 用户索引
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "phone": 1 }, { sparse: true });
db.users.createIndex({ "username": 1 });
db.users.createIndex({ "status": 1 });

// 健康数据索引
db.health_records.createIndex({ "userId": 1, "timestamp": -1 });
db.health_records.createIndex({ "userId": 1, "type": 1, "timestamp": -1 });
db.health_records.createIndex({ "deviceId": 1 });

// AI分析结果索引
db.ai_analysis.createIndex({ "userId": 1, "type": 1, "createdAt": -1 });
db.ai_analysis.createIndex({ "modelInfo.modelId": 1 });

// 创建TTL索引用于数据自动清理
db.health_records.createIndex({ "timestamp": 1 }, { expireAfterSeconds: 7776000 }); // 90天后自动删除 

// 添加复合索引
db.health_records.createIndex({ 
    "userId": 1, 
    "type": 1, 
    "data.timestamp": -1 
}, { 
    name: "user_activity_lookup" 
});

db.ai_analysis.createIndex({ 
    "userId": 1, 
    "type": 1, 
    "createdAt": -1 
}, { 
    name: "user_analysis_lookup" 
});