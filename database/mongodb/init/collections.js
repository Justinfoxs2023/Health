// 初始化数据库集合和索引
db = db.getSiblingDB('health_management_dev');

// 1. 用户相关集合
// 用户基本信息
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "password_hash", "created_at"],
      properties: {
        username: {
          bsonType: "string",
          description: "用户名"
        },
        email: {
          bsonType: "string",
          description: "邮箱"
        },
        password_hash: {
          bsonType: "string",
          description: "密码哈希"
        },
        profile: {
          bsonType: "object",
          properties: {
            name: {
              bsonType: "string",
              description: "姓名"
            },
            gender: {
              enum: ["male", "female", "other"],
              description: "性别"
            },
            birth_date: {
              bsonType: "date",
              description: "出生日期"
            },
            height: {
              bsonType: "number",
              description: "身高(cm)"
            },
            weight: {
              bsonType: "number",
              description: "体重(kg)"
            }
          }
        },
        roles: {
          bsonType: "array",
          description: "用户角色"
        },
        status: {
          enum: ["active", "inactive", "suspended"],
          description: "账户状态"
        },
        created_at: {
          bsonType: "date",
          description: "创建时间"
        },
        updated_at: {
          bsonType: "date",
          description: "更新时间"
        }
      }
    }
  }
}),  // 添加逗号

// 更新用户角色
db.users.updateMany({}, { $set: { roles: [] } }),

// 添加用户状态管理逻辑
db.users.createIndex({ status: 1 }),

// 健康记录集合
db.createCollection('health_records', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "record_type", "data", "created_at"],
      properties: {
        user_id: {
          bsonType: "objectId",
          description: "用户ID"
        },
        record_type: {
          enum: ["vital_signs", "exercise", "diet", "sleep", "medication"],
          description: "记录类型"
        },
        data: {
          bsonType: "object",
          properties: {
            vital_signs: {
              bsonType: "object",
              properties: {
                blood_pressure: {
                  systolic: {
                    bsonType: "number",
                    description: "收缩压"
                  },
                  diastolic: {
                    bsonType: "number",
                    description: "舒张压"
                  }
                },
                heart_rate: {
                  bsonType: "number",
                  description: "心率"
                },
                blood_oxygen: {
                  bsonType: "number",
                  description: "血氧"
                },
                temperature: {
                  bsonType: "number",
                  description: "体温"
                }
              }
            },
            exercise: {
              bsonType: "object",
              properties: {
                type: {
                  bsonType: "string",
                  description: "运动类型"
                },
                duration: {
                  bsonType: "number",
                  description: "时长(分钟)"
                },
                intensity: {
                  bsonType: "number",
                  description: "强度"
                },
                calories: {
                  bsonType: "number",
                  description: "消耗卡路里"
                }
              }
            }
          }
        },
        device_id: {
          bsonType: "string",
          description: "设备ID"
        },
        created_at: {
          bsonType: "date",
          description: "创建时间"
        }
      }
    }
  }
}),  // 添加逗号

// 确保所有记录类型都有相应的字段
db.health_records.updateMany({}, { $set: { "data.vital_signs": {}, "data.exercise": {} } }),  // 添加逗号

// AI分析结果集合
db.createCollection('ai_analysis', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "analysis_type", "results", "created_at"],
      properties: {
        user_id: {
          bsonType: "objectId",
          description: "用户ID"
        },
        analysis_type: {
          enum: ["pose_estimation", "diet_analysis", "sleep_quality", "health_risk"],
          description: "分析类型"
        },
        input_data: {
          bsonType: "object",
          description: "输入数据"
        },
        results: {
          bsonType: "object",
          properties: {
            predictions: {
              bsonType: "array",
              description: "预测结果"
            },
            confidence: {
              bsonType: "number",
              description: "置信度"
            },
            recommendations: {
          bsonType: "array",
              description: "建议"
            }
          }
        },
        model_info: {
          bsonType: "object",
          properties: {
            model_id: {
              bsonType: "string",
              description: "模型ID"
            },
            version: {
              bsonType: "string",
              description: "版本"
            }
          }
        },
        processing_time: {
          bsonType: "number",
          description: "处理时间(ms)"
        },
        created_at: {
          bsonType: "date",
          description: "创建时间"
        }
      }
    }
  }
}),  // 添加逗号

// 更新输入数据结构
db.ai_analysis.updateMany({}, { $set: { input_data: {} } }),  // 添加逗号

// 系统监控指标集合
db.createCollection('system_metrics', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["metric_type", "timestamp", "value"],
      properties: {
        metric_type: {
          enum: ["index_usage", "query_performance", "data_growth", "storage_usage"],
          description: "监控指标类型"
        },
        timestamp: { bsonType: "date" },
        value: { bsonType: "number" },
        details: {
          bsonType: "object",
          properties: {
            collection_name: { bsonType: "string" },
            index_name: { bsonType: "string" },
            query_pattern: { bsonType: "string" },
            execution_time: { bsonType: "number" }
          }
        }
      }
    }
  }
}),  // 添加逗号

// 更新监控指标详细信息
db.system_metrics.updateMany({}, { $set: { details: {} } }),  // 添加逗号

// 1. 情绪与心理健康集合
db.createCollection('mood_journals', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "mood_data", "created_at"],
      properties: {
        user_id: {
          bsonType: "objectId",
          description: "用户ID"
        },
        mood_data: {
          bsonType: "object",
          required: ["primary_mood", "intensity"],
          properties: {
            primary_mood: {
              enum: ["happy", "sad", "anxious", "calm", "angry", "energetic"],
              description: "主要情绪"
            },
            intensity: {
              bsonType: "number",
              minimum: 1,
              maximum: 10,
              description: "情绪强度"
            },
            secondary_moods: {
              bsonType: "array",
              description: "次要情绪"
            },
            triggers: {
              bsonType: "array",
              description: "诱发因素"
            }
          }
        },
        context: {
          bsonType: "object",
          properties: {
            location: { bsonType: "string" },
            activity: { bsonType: "string" },
            social_context: { bsonType: "string" }
          }
        },
        ai_analysis: {
          bsonType: "object",
          properties: {
            sentiment_score: { bsonType: "number" },
            patterns: { bsonType: "array" },
            recommendations: { bsonType: "array" }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 更新情绪数据结构
db.mood_journals.updateMany({}, { $set: { mood_data: {} } }),  // 添加逗号

// 2. 健康教育课程集合
db.createCollection('health_courses', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "category", "content", "status"],
      properties: {
        title: {
          bsonType: "string",
          description: "课程标题"
        },
        category: {
          enum: ["nutrition", "exercise", "mental_health", "sleep", "rehabilitation"],
          description: "课程类别"
        },
        difficulty_level: {
          enum: ["beginner", "intermediate", "advanced"],
          description: "难度等级"
        },
        content: {
          bsonType: "object",
          properties: {
            sections: { bsonType: "array" },
            resources: { bsonType: "array" },
            quizzes: { bsonType: "array" }
          }
        },
        status: {
          enum: ["draft", "published", "archived"],
          description: "课程状态"
        }
      }
    }
  }
}),  // 添加逗号

// 3. 社交支持网络集合
db.createCollection('social_support', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "type", "content"],
      properties: {
        user_id: {
          bsonType: "objectId",
          description: "用户ID"
        },
        type: {
          enum: ["group", "challenge", "achievement", "support_message"],
          description: "社交类型"
        },
        content: {
          bsonType: "object",
          description: "内容"
        },
        participants: {
          bsonType: "array",
          description: "参与者"
        },
        status: {
          enum: ["active", "completed", "archived"],
          description: "状态"
        }
      }
    }
  }
}),  // 添加逗号

// 添加运动训练计划集合
db.createCollection('training_plans', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "plan_type", "exercises", "status"],
      properties: {
        user_id: {
          bsonType: "objectId",
          description: "用户ID"
        },
        plan_type: {
          enum: ["rehabilitation", "fitness", "professional", "weight_loss"],
          description: "训练类型"
        },
        exercises: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["name", "sets", "duration"],
            properties: {
              name: { bsonType: "string" },
              sets: { bsonType: "number" },
              duration: { bsonType: "number" },
              intensity: { bsonType: "number" },
              rest_time: { bsonType: "number" }
            }
          }
        },
        ai_recommendations: {
          bsonType: "object",
          properties: {
            difficulty_adjustment: { bsonType: "number" },
            focus_areas: { bsonType: "array" },
            risk_warnings: { bsonType: "array" }
          }
        },
        status: {
          enum: ["active", "completed", "paused"],
          description: "计划状态"
        }
      }
    }
  }
}),  // 添加逗号

// 添加营养追踪集合
db.createCollection('nutrition_tracking', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "meal_type", "foods", "timestamp"],
      properties: {
        user_id: {
          bsonType: "objectId",
          description: "用户ID"
        },
        meal_type: {
          enum: ["breakfast", "lunch", "dinner", "snack"],
          description: "餐食类型"
        },
        foods: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["name", "portion", "calories"],
            properties: {
              name: { bsonType: "string" },
              portion: { bsonType: "number" },
              calories: { bsonType: "number" },
              nutrients: {
                bsonType: "object",
                properties: {
                  protein: { bsonType: "number" },
                  carbs: { bsonType: "number" },
                  fat: { bsonType: "number" },
                  vitamins: { bsonType: "object" }
                }
              }
            }
          }
        },
        ai_analysis: {
          bsonType: "object",
          properties: {
            balance_score: { bsonType: "number" },
            suggestions: { bsonType: "array" }
          }
        },
        timestamp: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 创建索引
// 用户索引
db.users.createIndex({ "email": 1 }, { unique: true }),  // 添加逗号
db.users.createIndex({ "username": 1 }, { unique: true }),  // 添加逗号
db.users.createIndex({ "created_at": 1 }),  // 添加逗号

// 健康记录索引
db.health_records.createIndex({ "user_id": 1, "record_type": 1 }),  // 添加逗号
db.health_records.createIndex({ "created_at": 1 }),  // 添加逗号
db.health_records.createIndex({
  "created_at": 1
}, {
  expireAfterSeconds: 31536000,  // 一年后过期
  partialFilterExpression: {
    "record_type": "vital_signs"  // 仅对生命体征数据应用
  }
}),  // 添加逗号

// AI分析结果索引
db.ai_analysis.createIndex({ "user_id": 1, "analysis_type": 1 }),  // 添加逗号
db.ai_analysis.createIndex({ "model_info.model_id": 1 }),  // 添加逗号
db.ai_analysis.createIndex({ "created_at": 1 }),  // 添加逗号

// 系统指标索引
db.system_metrics.createIndex({ "timestamp": 1 }, {
  expireAfterSeconds: 2592000  // 30天后期
}),  // 添加逗号
db.system_metrics.createIndex({
  "metric_type": 1,
  "service_name": 1,
  "timestamp": -1
}),  // 添加逗号

// 情绪日记索引
db.mood_journals.createIndex({ "user_id": 1, "created_at": -1 }),  // 添加逗号
db.mood_journals.createIndex({
  "created_at": 1
}, {
  expireAfterSeconds: 31536000,  // 一年后过期
}),  // 添加逗号

// 健康课程索引
db.health_courses.createIndex({ "category": 1, "difficulty_level": 1 }),  // 添加逗号
db.health_courses.createIndex({ "status": 1 }),  // 添加逗号

// 社交支持索引
db.social_support.createIndex({ "user_id": 1, "type": 1 }),  // 添加逗号
db.social_support.createIndex({ "participants": 1 }),  // 添加逗号

// 训练计划索引
db.training_plans.createIndex({ "user_id": 1, "status": 1 }),  // 添加逗号
db.training_plans.createIndex({ "plan_type": 1 }),  // 添加逗号
db.training_plans.createIndex({
  "created_at": 1
}, {
  expireAfterSeconds: 7776000,  // 90天后过期
}),  // 添加逗号

// 营养追踪索引
db.nutrition_tracking.createIndex({ "user_id": 1, "timestamp": -1 }),  // 添加逗号
db.nutrition_tracking.createIndex({ "meal_type": 1, "timestamp": -1 }),  // 添加逗号
db.nutrition_tracking.createIndex({
  "timestamp": 1
}, {
  expireAfterSeconds: 15552000,  // 180天后过期
}),  // 添加逗号

// 片配置
sh.enableSharding("health_management_dev"),  // 添加逗号

// 用户数据分片
sh.shardCollection("health_management_dev.users", { "_id": "hashed" }),  // 添加逗号

// 康记录分片
sh.shardCollection("health_management_dev.health_records", {
  "user_id": "hashed"
}),  // 添加逗号

// AI分析果分片
sh.shardCollection("health_management_dev.ai_analysis", {
  "user_id": "hashed"
}),  // 添加逗号

// 系指分片
sh.shardCollection("health_management_dev.system_metrics", {
  "timestamp": 1
}),  // 添加逗号

// 情绪日记分片
sh.shardCollection("health_management_dev.mood_journals", { "user_id": "hashed" }),  // 添加逗号

// 健康课程分片
sh.shardCollection("health_management_dev.health_courses", { "category": 1, "difficulty_level": 1 }),  // 添加逗号
sh.shardCollection("health_management_dev.health_courses", { "status": 1 }),  // 添加逗号

// 社交支持分片
sh.shardCollection("health_management_dev.social_support", { "user_id": "hashed" }),  // 添加逗号

// 训练计划分片
sh.shardCollection("health_management_dev.training_plans", { "user_id": "hashed" }),  // 添加逗号

// 营养追踪分片
sh.shardCollection("health_management_dev.nutrition_tracking", { "user_id": "hashed" }),  // 添加逗号

// 添加数据质量检查触发器
db.training_plans.createIndex(
  { "exercises.intensity": 1 },
  {
    partialFilterExpression: {
      "exercises.intensity": { $gt: 0, $lte: 10 }  // 确保运动强度在合理范围内
    }
  }),  // 添加逗号

db.nutrition_tracking.createIndex(
  { "foods.calories": 1 },
  {
    partialFilterExpression: {
      "foods.calories": { $gt: 0, $lt: 5000 }  // 确保卡路里值在合理范围内
    }
  }),  // 添加逗号

// 添加系统监控集合
db.createCollection('system_monitoring', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["metric_type", "timestamp", "value"],
      properties: {
        metric_type: {
          enum: ["index_usage", "data_distribution", "query_performance", "storage_usage"],
          description: "监控指标类型"
        },
        timestamp: { bsonType: "date" },
        value: { bsonType: "number" },
        metadata: {
          bsonType: "object",
          properties: {
            collection_name: { bsonType: "string" },
            index_name: { bsonType: "string" },
            query_pattern: { bsonType: "string" },
            execution_time: { bsonType: "number" }
          }
        }
      }
    }
  }
}),  // 添加逗号

// 添加数据清理策略配置集合
db.createCollection('data_cleanup_policies', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["collection_name", "policy_type", "retention_period"],
      properties: {
        collection_name: { bsonType: "string" },
        policy_type: {
          enum: ["ttl", "archival", "compression", "sampling"],
          description: "清理策略类型"
        },
        retention_period: { bsonType: "number" },
        cleanup_schedule: { bsonType: "string" },
        last_cleanup: { bsonType: "date" },
        next_cleanup: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 更新现有集合的验证规则
db.runCommand({
  collMod: "health_records",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "type", "data", "created_at"],
      properties: {
        data_quality: {
          bsonType: "object",
          properties: {
            completeness: { bsonType: "number", minimum: 0, maximum: 100 },
            accuracy: { bsonType: "number", minimum: 0, maximum: 100 },
            consistency: { bsonType: "number", minimum: 0, maximum: 100 }
          }
        },
        validation_status: {
          enum: ["pending", "validated", "rejected"],
          description: "数据验证状态"
        }
      }
    }
  }
}),  // 添加逗号

// 添加新索引和监控
// 系统监控索引
db.system_monitoring.createIndex(
  { "timestamp": 1, "metric_type": 1 },
  { expireAfterSeconds: 7776000 }),  // 添加逗号

db.system_monitoring.createIndex(
  { "metadata.collection_name": 1, "metadata.index_name": 1, "timestamp": -1 }),  // 添加逗号

// 添加索引使用况监控
db.createCollection('index_usage_stats', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["collection_name", "index_name", "usage_count", "last_used"],
      properties: {
        collection_name: { bsonType: "string" },
        index_name: { bsonType: "string" },
        usage_count: { bsonType: "number" },
        last_used: { bsonType: "date" },
        query_patterns: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              pattern: { bsonType: "string" },
              count: { bsonType: "number" }
            }
          }
      }
    }
  }
}),  // 添加逗号

// 创建数据分布统计视图
db.createView(
  "data_distribution_stats",
  "health_records",
  [
    {
      $group: {
        _id: {
          type: "$type",
          year: { $year: "$created_at" },
          month: { $month: "$created_at" }
        },
        count: { $sum: 1 },
        avg_size: { $avg: { $bsonSize: "$$ROOT" } }
      }
    }
  ]
),

// 优化现有索引
db.health_records.createIndex(
  { "user_id": 1, "type": 1, "created_at": -1 },
  {
    partialFilterExpression: {
      "validation_status": "validated"
    },
    name: "validated_records_lookup"
  }),  // 添加逗号

// 添加数据质量检查索引
db.health_records.createIndex(
  { "data_quality.completeness": 1 },
  {
    partialFilterExpression: {
      "data_quality.completeness": { $lt: 80 }
    },
    name: "low_quality_data_alert"
  }),  // 添加逗号

// 添加用户健康目标追踪集合
db.createCollection('health_goals', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "goal_type", "target", "start_date", "end_date"],
      properties: {
        user_id: { bsonType: "objectId" },
        goal_type: {
          enum: ["weight", "exercise", "nutrition", "sleep", "mental_health"],
          description: "目标类型"
        },
        target: {
          bsonType: "object",
          properties: {
            metric: { bsonType: "string" },
            value: { bsonType: "number" },
            unit: { bsonType: "string" }
          }
        },
        progress: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              date: { bsonType: "date" },
              value: { bsonType: "number" },
              notes: { bsonType: "string" }
            }
          }
        },
        status: {
          enum: ["active", "completed", "abandoned"],
          description: "目标状��"
        }
      }
    }
  }
}),  // 添加逗号

// 添加健康知识库集合
db.createCollection('health_knowledge', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "category", "content", "created_at"],
      properties: {
        title: { bsonType: "string" },
        category: {
          enum: ["nutrition", "exercise", "mental_health", "disease_prevention", "rehabilitation"],
          description: "知识类别"
        },
        content: { bsonType: "string" },
        tags: { bsonType: "array" },
        difficulty_level: {
          enum: ["beginner", "intermediate", "advanced"],
          description: "难度级别"
        },
        references: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              title: { bsonType: "string" },
              url: { bsonType: "string" },
              author: { bsonType: "string" }
            }
          }
        }
      }
    }
  }
}),  // 添加逗号

// 添加用户反馈集合
db.createCollection('user_feedback', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "feedback_type", "content", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        feedback_type: {
          enum: ["bug_report", "feature_request", "general_feedback", "satisfaction_survey"],
          description: "反馈类型"
        },
        content: { bsonType: "string" },
        satisfaction_level: {
          bsonType: "number",
          minimum: 1,
          maximum: 5
        },
        status: {
          enum: ["pending", "in_progress", "resolved", "closed"],
          description: "处理状态"
        }
      }
    }
  }
}),  // 添加逗号

// 创建相应的索引
db.health_goals.createIndex({ "user_id": 1, "status": 1 }),  // 添加逗号
db.health_goals.createIndex({ "end_date": 1 }, {
  expireAfterSeconds: 7776000  // 90天后过期
}),  // 添加逗号

db.health_knowledge.createIndex({
  "title": "text",
  "content": "text"
}, {
  weights: {
    title: 10,
    content: 5
  },
  name: "knowledge_search"
}),  // 添加逗号

db.user_feedback.createIndex({ "user_id": 1, "created_at": -1 }),  // 添加逗号
db.user_feedback.createIndex({ "status": 1, "feedback_type": 1 }),  // 添加逗号

// 添加数据分析视图
db.createView(
  "user_health_insights",
  "health_records",
  [
    {
      $lookup: {
        from: "health_goals",
        localField: "user_id",
        foreignField: "user_id",
        as: "goals"
      }
    },
    {
      $group: {
        _id: "$user_id",
        total_records: { $sum: 1 },
        avg_completion_rate: { $avg: "$goals.progress.completion_rate" },
        recent_activities: {
          $push: {
            type: "$type",
            timestamp: "$created_at",
            data: "$data"
          }
        }
      }
    }
  ]
),  // 添加逗号

// 添加性能监控索引
db.system_monitoring.createIndex(
  { "timestamp": 1, "metric_type": 1 },
  {
    partialFilterExpression: {
      "value": { $gt: 0 }
    },
  name: "performance_monitoring"
}),  // 添加逗号

// 为现有的health_records集合添加新字段
db.health_records.updateMany({}, {
  $set: {
    "data_source": {
      "device_type": null,
      "device_model": null,
      "app_version": null,
      "collection_method": "manual"
    },
    "sharing_settings": {
      "is_public": false,
      "shared_with": [],
      "share_level": "none"
    },
    "analysis_flags": {
      "needs_review": false,
      "is_anomaly": false,
      "confidence_score": 1.0
    }
  }
}),  // 添加逗号

// 为ai_analysis集合添加新字段
db.ai_analysis.updateMany({}, {
  $set: {
    "processing_metadata": {
      "duration_ms": null,
      "model_version": null,
      "confidence_threshold": 0.8,
      "processing_steps": []
    },
    "feedback": {
      "is_accurate": null,
      "user_comments": null,
      "correction_needed": false
    },
    "usage_stats": {
      "times_viewed": 0,
      "times_shared": 0,
      "last_accessed": new Date()
    }
  }
}),  // 添加逗号

// 添加新的复合索引
db.health_records.createIndex(
  {
    "user_id": 1,
    "data.value": 1,
    "created_at": -1,
    "data_quality.accuracy": 1
  },
  {
    partialFilterExpression: {
      "data_quality.accuracy": { $gt: 0.9 }
    },
    name: "high_quality_data_lookup"
  }),  // 添加逗号

// 添加文本搜索索引
db.health_records.createIndex(
  {
    "data.metadata.notes": "text",
    "data.metadata.tags": "text"
  },
  {
    weights: {
      "data.metadata.notes": 2,
      "data.metadata.tags": 1
    },
    name: "content_search"
  }),  // 添加逗号

// 添加TTL索引用于数据归档
db.health_records.createIndex(
  { "archived_at": 1 },
  {
    expireAfterSeconds: 15552000,  // 180天后自动归档
    partialFilterExpression: {
      "is_archived": true
    }
  }),  // 添加逗号

// 创建数据分析视图
db.createView(
  "health_trends",
  "health_records",
  [
    {
      $match: {
        "data_quality.accuracy": { $gt: 0.8 }
      }
    },
    {
      $group: {
        _id: {
          user_id: "$user_id",
          type: "$type",
          year_month: {
            $dateToString: {
              format: "%Y-%m",
              date: "$created_at"
            }
          }
        },
        avg_value: { $avg: "$data.value" },
        min_value: { $min: "$data.value" },
        max_value: { $max: "$data.value" },
        record_count: { $sum: 1 },
        quality_score: { $avg: "$data_quality.accuracy" }
      }
    },
    {
      $sort: {
        "_id.user_id": 1,
        "_id.year_month": -1
      }
    }
  ]
),  // 添加逗号

// 添加性能优化索引
db.ai_analysis.createIndex(
  {
    "user_id": 1,
    "created_at": -1,
    "results.confidence": -1
  },
  {
    partialFilterExpression: {
      "results.confidence": { $gt: 0.9 }
    },
    name: "high_confidence_results"
  }),  // 添加逗号

// 创建数据监控和分析集合
db.createCollection('data_monitoring', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["collection_name", "metric_type", "timestamp", "value"],
      properties: {
        collection_name: { bsonType: "string" },
        metric_type: {
          enum: ["growth_rate", "query_performance", "index_usage", "data_quality"],
          description: "监控指标类型"
        },
        timestamp: { bsonType: "date" },
        value: { bsonType: "number" },
        details: {
          bsonType: "object",
          properties: {
            query_pattern: { bsonType: "string" },
            execution_time: { bsonType: "number" },
            index_name: { bsonType: "string" },
            scan_type: { bsonType: "string" },
            documents_scanned: { bsonType: "number" },
            quality_metrics: {
              bsonType: "object",
              properties: {
                completeness: { bsonType: "number" },
                accuracy: { bsonType: "number" },
                consistency: { bsonType: "number" }
              }
            }
          }
        }
      }
    }
  }
}),  // 添加逗号

// 创建数据趋势分析视图
db.createView(
  "collection_growth_trends",
  "data_monitoring",
  [
    {
      $match: {
        metric_type: "growth_rate"
      }
    },
    {
      $group: {
        _id: {
          collection: "$collection_name",
          year_month: {
            $dateToString: {
              format: "%Y-%m",
              date: "$timestamp"
            }
          }
        },
        avg_growth_rate: { $avg: "$value" },
        total_size: { $last: "$details.total_size" },
        document_count: { $last: "$details.document_count" }
      }
    },
    {
      $sort: {
        "_id.collection": 1,
        "_id.year_month": -1
      }
    }
  ]
),  // 添加逗号

// 添加索引使用情况监控
db.data_monitoring.createIndex(
  {
    "collection_name": 1,
    "metric_type": 1,
    "timestamp": -1
  },
  {
    name: "monitoring_lookup"
  }),  // 添加逗号

// 添加数据质量��控触发器
db.data_monitoring.createIndex(
  {
    "details.quality_metrics.accuracy": 1,
    "timestamp": -1
  },
  {
    partialFilterExpression: {
      "details.quality_metrics.accuracy": { $lt: 0.9 }
    },
    name: "low_quality_alert"
  }),  // 添加逗号

// 创建查询性能分析视图
db.createView(
  "query_performance_analysis",
  "data_monitoring",
  [
    {
      $match: {
        metric_type: "query_performance"
      }
    },
    {
      $group: {
        _id: {
          collection: "$collection_name",
          query_pattern: "$details.query_pattern"
        },
        avg_execution_time: { $avg: "$details.execution_time" },
        total_executions: { $sum: 1 },
        slow_queries: {
          $sum: {
            $cond: [
              { $gt: ["$details.execution_time", 100] },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $sort: {
        "avg_execution_time": -1
      }
    }
  ]
),  // 添加逗号

// 添加自动清理策略
db.data_monitoring.createIndex(
  { "timestamp": 1 },
  {
    expireAfterSeconds: 7776000  // 90后自动清理监控数
  }),  // 添加逗号

// 添加数据质量评分汇总视图
db.createView(
  "data_quality_summary",
  "data_monitoring",
  [
    {
      $match: {
        metric_type: "data_quality"
      }
    },
    {
      $group: {
        _id: "$collection_name",
        avg_completeness: { $avg: "$details.quality_metrics.completeness" },
        avg_accuracy: { $avg: "$details.quality_metrics.accuracy" },
        avg_consistency: { $avg: "$details.quality_metrics.consistency" },
        total_records: { $sum: 1 },
        last_check: { $max: "$timestamp" }
      }
    }
  ]
),  // 添加逗号

// 添加模型性能监控集合
db.createCollection('model_performance_metrics', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["model_id", "metric_type", "timestamp", "value"],
      properties: {
        model_id: { bsonType: "string" },
        metric_type: {
          enum: ["accuracy", "latency", "throughput", "error_rate"],
          description: "模型性能指标类型"
        },
        timestamp: { bsonType: "date" },
        value: { bsonType: "number" },
        context: {
          bsonType: "object",
          properties: {
            batch_size: { bsonType: "number" },
            input_shape: { bsonType: "array" },
            hardware_info: { bsonType: "string" }
          }
        }
      }
    }
  }
}),  // 添加逗号

// 添加查询性能监控索引
db.health_records.createIndex(
  {
    "query_pattern": 1,
    "execution_time": 1,
    "timestamp": -1
  },
  {
    partialFilterExpression: {
      "execution_time": { $gt: 100 }  // 监控慢查询
    },
    name: "slow_query_monitor"
  }),  // 添加逗号

// 创建数据质量监控视图
db.createView(
  "data_quality_monitor",
  "health_records",
  [
    {
      $group: {
        _id: {
          collection: "$type",
          day: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$created_at"
            }
          }
        },
        completeness: {
          $avg: {
            $cond: [
              { $eq: [{ $type: "$data" }, "object"] },
              { $divide: [
                { $size: { $objectToArray: "$data" } },
                { $literal: 10 }  // 预期字段数
              ]},
              0
            ]
          }
        },
        accuracy: {
          $avg: "$data_quality.accuracy"
        },
        volume: { $sum: 1 },
        null_rate: {
          $avg: {
            $cond: [
              { $eq: ["$data", null] },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $project: {
        collection: "$_id.collection",
        date: "$_id.day",
        metrics: {
          completeness: "$completeness",
          accuracy: "$accuracy",
          volume: "$volume",
          null_rate: "$null_rate",
          health_score: {
            $multiply: [
              { $avg: ["$completeness", "$accuracy"] },
              { $subtract: [1, "$null_rate"] }
            ]
          }
        }
      }
    ),  // 添加逗号

// 添加数据增长趋势分析索引
db.health_records.createIndex(
  {
    "type": 1,
    "created_at": 1,
    "data_size": 1
  },
  {
    name: "growth_analysis"
  }),  // 添加逗号

// 创建查询模式优化视图
db.createView(
  "query_pattern_analysis",
  "system_monitoring",
  [
    {
      $match: {
        metric_type: { $in: ["index_usage", "query_performance"] }
      }
    },
    {
      $group: {
        _id: {
          collection: "$details.collection_name",
          pattern: "$details.query_pattern"
        },
        avg_execution_time: { $avg: "$details.execution_time" },
        index_utilization: {
          $avg: {
            $cond: [
              { $gt: ["$details.index_name", null] },
              1,
              0
            ]
          }
        }
      }
    }
  ]), // 第三处逗号修复

// 添加数据质量监控索引
db.health_records.createIndex(
  {
    "data_quality.completeness": 1,
    "data_quality.accuracy": 1,
    "created_at": -1
  },
  {
    name: "quality_monitoring",
    partialFilterExpression: {
      "data_quality.completeness": { $lt: 0.8 }  // 重点监控低质量数据
    }
  }),  // 添加逗号

// 创建性能分析视图
db.createView(
  "performance_analysis",
  "system_metrics",
  [
    {
      $match: {
        metric_type: { $in: ["index_usage", "query_performance"] }
    },
    {
      $group: {
        _id: {
          collection: "$details.collection_name",
          pattern: "$details.query_pattern"
        },
        avg_execution_time: { $avg: "$details.execution_time" },
        index_utilization: {
          $avg: {
            $cond: [
              { $gt: ["$details.index_name", null] },
              1,
              0
            ]
          }
        }
      }
    }
  ]), // 第三处逗号修复

// 添加数据增长趋势监控索引
db.health_records.createIndex(
  {
    "created_at": 1,
    "data_size": 1,
    "type": 1
  },
  {
    name: "growth_monitoring",
    expireAfterSeconds: 7776000  // 90天后自动清理监控数据
  }),  // 添加逗号

// 添加监控报告集合
db.createCollection('monitoring_reports', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["report_type", "timestamp", "metrics", "status"],
      properties: {
        report_type: {
          enum: ["performance", "storage", "quality", "optimization"],
          description: "报告类型"
        },
        timestamp: { bsonType: "date" },
        metrics: {
          bsonType: "object",
          properties: {
            query_stats: {
              bsonType: "object",
              properties: {
                slow_queries: { bsonType: "array" },
                avg_response_time: { bsonType: "number" },
                index_usage_stats: { bsonType: "object" }
            },
            storage_stats: {
              bsonType: "object",
              properties: {
                total_size: { bsonType: "number" },
                growth_rate: { bsonType: "number" },
                collection_sizes: { bsonType: "object" }
              }
            },
            data_quality: {
              bsonType: "object",
              properties: {
                completeness_score: { bsonType: "number" },
                accuracy_score: { bsonType: "number" },
                problem_records: { bsonType: "array" }
              }
            },
            alerts: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  level: {
                    enum: ["critical", "warning", "info"],
                    description: "告警级别"
                  },
                  message: { bsonType: "string" },
                  threshold: { bsonType: "number" },
                  current_value: { bsonType: "number" }
                }
              }
            },
            recommendations: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  type: {
                    enum: ["index", "query", "schema", "storage"],
                    description: "优化类型"
                  },
                  description: { bsonType: "string" },
                  impact: {
                    enum: ["high", "medium", "low"],
                    description: "影程度"
                  },
                  implementation: { bsonType: "string" }
                }
              }
            },
            status: {
              enum: ["normal", "warning", "critical"],
              description: "系统状态"
            }
          }
        }
      }
    }
  }),  // 添加逗号

// 添加容量规划集合
db.createCollection('capacity_planning', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["plan_type", "timestamp", "projections"],
      properties: {
        plan_type: {
          enum: ["storage", "performance", "scaling"],
          description: "规划类型"
        },
        timestamp: { bsonType: "date" },
        current_metrics: {
          bsonType: "object",
          properties: {
            storage_used: { bsonType: "number" },
            query_load: { bsonType: "number" },
            user_count: { bsonType: "number" }
          }
        },
        projections: {
          bsonType: "object",
          properties: {
            three_month: { bsonType: "object" },
            six_month: { bsonType: "object" },
            one_year: { bsonType: "object" }
          }
        },
        recommendations: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              timeframe: { bsonType: "string" },
              action: { bsonType: "string" },
              estimated_cost: { bsonType: "number" }
          }
    }
  }
}), // 第四处逗号修复

// 添加性能优化视图
db.createView(
  "performance_insights",
  "system_metrics",
  [
    {
      $match: {
        timestamp: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 30))
        }
      }
    },
    {
      $group: {
        _id: {
          collection: "$details.collection_name",
          operation: "$details.query_pattern"
        },
        avg_response_time: { $avg: "$details.execution_time" },
        total_operations: { $sum: 1 },
        slow_queries: {
          $push: {
            $cond: [
              { $gt: ["$details.execution_time", 100] },
              "$details",
              null
            ]
          }
        }
      }
    }
  ]
),  // 添加逗号

// 添加系统性能监控集合
db.createCollection('system_performance', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["timestamp", "metrics", "alerts"],
      properties: {
        timestamp: { bsonType: "date" },
        metrics: {
          bsonType: "object",
          properties: {
            cpu_usage: { bsonType: "number" },
            memory_usage: { bsonType: "number" },
            disk_io: { bsonType: "number" },
            network_latency: { bsonType: "number" },
            active_connections: { bsonType: "number" }
          }
        },
        alerts: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              type: {
                enum: ["performance", "capacity", "error", "security"]
              },
              severity: {
                enum: ["critical", "warning", "info"]
              },
              message: { bsonType: "string" },
              threshold: { bsonType: "number" },
              current_value: { bsonType: "number" }
            }
          }
        }
      }
    }
  }),  // 添加逗号

// 添加优化建议集合
db.createCollection('optimization_suggestions', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["created_at", "type", "status"],
      properties: {
        type: {
          enum: ["index", "query", "schema", "capacity"],
          description: "优化类型"
        },
        target: {
          bsonType: "object",
          properties: {
            collection: { bsonType: "string" },
            field: { bsonType: "string" },
            query_pattern: { bsonType: "string" }
          }
        },
        suggestion: { bsonType: "string" },
        impact: {
          bsonType: "object",
          properties: {
            performance_gain: { bsonType: "number" },
            storage_impact: { bsonType: "number" },
            risk_level: {
              enum: ["low", "medium", "high"]
            }
          }
        },
        status: {
          enum: ["pending", "approved", "rejected", "implemented"],
          description: "建议状态"
        }
      }
    }
  }
}),  // 添加逗号

// 创建容量规划视图
db.createView(
  "capacity_planning",
  "health_records",
  [
    {
      $group: {
        _id: {
          collection: "$type",
          month: {
            $dateToString: {
              format: "%Y-%m",
              date: "$created_at"
            }
          }
        },
        data_size: { $sum: { $bsonSize: "$$ROOT" } },
        record_count: { $sum: 1 },
        avg_record_size: { $avg: { $bsonSize: "$$ROOT" } }
      }
    },
    {
      $project: {
        collection: "$_id.collection",
        month: "$_id.month",
        metrics: {
          total_size_mb: { $divide: ["$data_size", 1048576] },
          record_count: "$record_count",
          avg_record_size_kb: { $divide: ["$avg_record_size", 1024] }
        },
        growth_metrics: {
          projected_6month_size_mb: {
            $multiply: [
              { $divide: ["$data_size", 1048576] },
              1.5
            ]
          }
        }
      }
    }
  ]
),  // 添加逗号

// 添加CPU使用率索引
db.system_performance.createIndex(
  { "metrics.cpu_usage": 1, "timestamp": -1 },
  { partialFilterExpression: { "metrics.cpu_usage": { $gt: 80 } }
),  // 添加逗号

// 1. 添加模型训练记录集合
db.createCollection('model_training_records', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["model_id", "training_type", "status", "created_at"],
      properties: {
        model_id: { bsonType: "string" },
        training_type: {
          enum: ["initial", "incremental", "fine_tuning"],
          description: "训练类型"
        },
        dataset_info: {
          bsonType: "object",
          properties: {
            size: { bsonType: "number" },
            distribution: { bsonType: "object" },
            validation_split: { bsonType: "number" }
          }
        },
        hyperparameters: {
          bsonType: "object",
          properties: {
            learning_rate: { bsonType: "number" },
            batch_size: { bsonType: "number" },
            epochs: { bsonType: "number" }
          }
        },
        metrics: {
          bsonType: "object",
          properties: {
            training_loss: { bsonType: "array" },
            validation_loss: { bsonType: "array" },
            accuracy: { bsonType: "array" }
          }
        },
        status: {
          enum: ["pending", "training", "completed", "failed"],
          description: "训练状态"
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 2. 添加分布式任务处理集合
db.createCollection('distributed_tasks', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["task_id", "type", "status", "created_at"],
      properties: {
        task_id: { bsonType: "string" },
        type: {
          enum: ["image_processing", "model_inference", "data_analysis"],
          description: "任务类型"
        },
        priority: {
          enum: ["high", "normal", "low"],
          description: "优先级"
        },
        worker_info: {
          bsonType: "object",
          properties: {
            worker_id: { bsonType: "string" },
            capacity: { bsonType: "number" },
            current_load: { bsonType: "number" }
          }
        },
        execution_stats: {
          bsonType: "object",
          properties: {
            start_time: { bsonType: "date" },
            end_time: { bsonType: "date" },
            duration: { bsonType: "number" },
            retries: { bsonType: "number" }
          }
        },
        status: {
          enum: ["queued", "processing", "completed", "failed"],
          description: "任务状态"
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 3. 添加实��分析��果集合
db.createCollection('realtime_analysis', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "analysis_type", "data", "timestamp"],
      properties: {
        user_id: { bsonType: "objectId" },
        analysis_type: {
          enum: ["vital_signs", "activity", "diet", "sleep"],
          description: "分析类型"
        },
        data: { bsonType: "object" },
        timestamp: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 4. 为已有集合添加新索引
db.model_training_records.createIndex(
  { "model_id": 1, "created_at": -1 },
  { name: "model_training_history" }
),  // 添加逗号

db.distributed_tasks.createIndex(
  { "priority": 1, "status": 1, "created_at": 1 },
  { name: "task_scheduling" }
),  // 添加逗号

db.realtime_analysis.createIndex(
  { "session_id": 1, "timestamp": -1 },
  {
    name: "realtime_monitoring",
    expireAfterSeconds: 86400 // 24小时后过期
  }
),  // 添加逗号

// 5. 更新现有集合的验证规则
db.runCommand({
  collMod: "health_records",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "record_type", "data", "created_at"],
      properties: {
        processing_metadata: {
          bsonType: "object",
          properties: {
            source_device: { bsonType: "string" },
            processing_pipeline: { bsonType: "array" },
            quality_checks: { bsonType: "object" }
          }
        }
      }
    }
  }
}),  // 添加逗号

// 1. 添加视觉分析结果集合
db.createCollection('vision_analysis', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "analysis_type", "results", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        analysis_type: {
          enum: ["rehabilitation", "athletic_performance", "injury_risk"],
          description: "视觉分析类型"
        },
        image_data: {
          bsonType: "object",
          properties: {
            source_url: { bsonType: "string" },
            processed_url: { bsonType: "string" },
            metadata: { bsonType: "object" }
          }
        },
        results: {
          bsonType: "object",
          properties: {
            pose_analysis: { bsonType: "object" },
            recommendations: { bsonType: "array" },
            risk_factors: { bsonType: "array" },
            performance_metrics: { bsonType: "object" }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 2. 添加分布式任务追踪集合
db.createCollection('distributed_tasks', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["task_id", "type", "status", "created_at"],
      properties: {
        task_id: { bsonType: "string" },
        type: {
          enum: ["image_processing", "model_inference", "data_analysis"],
          description: "任务类型"
        },
        priority: {
          enum: ["high", "normal", "low"],
          description: "优先级"
        },
        status: {
          enum: ["pending", "processing", "completed", "failed"],
          description: "任务状态"
        },
        worker_info: {
          bsonType: "object",
          properties: {
            worker_id: { bsonType: "string" },
            start_time: { bsonType: "date" },
            end_time: { bsonType: "date" }
          }
        },
        performance_metrics: {
          bsonType: "object",
          properties: {
            processing_time: { bsonType: "number" },
            memory_usage: { bsonType: "number" },
            cpu_usage: { bsonType: "number" }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 3. 添加模型评估记录集合
db.createCollection('model_evaluations', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["model_id", "metrics", "timestamp"],
      properties: {
        model_id: { bsonType: "string" },
        metrics: {
          bsonType: "object",
          properties: {
            accuracy: { bsonType: "number" },
            precision: { bsonType: "number" },
            recall: { bsonType: "number" }
          }
        },
        timestamp: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 4. 为新集合创建索引
db.vision_analysis.createIndex(
  { "user_id": 1, "analysis_type": 1, "created_at": -1 },
  { name: "vision_analysis_lookup" }
),  // 添加逗号

db.distributed_tasks.createIndex(
  { "task_id": 1 },
  { unique: true }
),  // 添加逗号

db.distributed_tasks.createIndex(
  { "status": 1, "priority": 1, "created_at": 1 },
  { name: "task_scheduling" }
),  // 添加逗号

db.model_evaluations.createIndex(
  { "model_id": 1, "created_at": -1 },
  { name: "model_performance_history" }
),  // 添加逗号

// 5. 更新现有集合的验证规则
db.runCommand({
  collMod: "ai_analysis",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "type", "results", "created_at"],
      properties: {
        processing_metadata: {
          bsonType: "object",
          properties: {
            processing_time: { bsonType: "number" },
            model_version: { bsonType: "string" },
            confidence_score: { bsonType: "number" }
          }
        }
      }
    }
  }
}),  // 添加逗号

// 1. 添加视觉分析任务集合
db.createCollection('vision_tasks', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["task_id", "user_id", "analysis_type", "status", "created_at"],
      properties: {
        task_id: { bsonType: "string" },
        user_id: { bsonType: "objectId" },
        analysis_type: {
          enum: ["rehabilitation", "athletic_performance", "injury_risk"],
          description: "视觉分析类型"
        },
        input_data: {
          bsonType: "object",
          properties: {
            image_url: { bsonType: "string" },
            video_url: { bsonType: "string" },
            metadata: { bsonType: "object" }
          }
        },
        processing_status: {
          bsonType: "object",
          properties: {
            current_stage: { bsonType: "string" },
            progress: { bsonType: "number" },
            error_logs: { bsonType: "array" }
          }
        },
        worker_info: {
          bsonType: "object",
          properties: {
            worker_id: { bsonType: "string" },
            queue_name: { bsonType: "string" },
            priority: { bsonType: "string" }
          }
        },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 2. 添加实时分析结果缓存集合
db.createCollection('realtime_analysis_cache', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["cache_key", "data", "created_at"],
      properties: {
        cache_key: { bsonType: "string" },
        data: { bsonType: "object" },
        ttl: { bsonType: "number" },
        access_count: { bsonType: "number" },
        last_accessed: { bsonType: "date" },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 3. 添加性能监控集合
db.createCollection('performance_metrics', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["service_name", "metric_type", "value", "timestamp"],
      properties: {
        service_name: { bsonType: "string" },
        metric_type: {
          enum: ["cpu_usage", "memory_usage", "response_time", "queue_length"],
          description: "指标类型"
        },
        value: { bsonType: "number" },
        metadata: {
          bsonType: "object",
          properties: {
            host: { bsonType: "string" },
            environment: { bsonType: "string" },
            version: { bsonType: "string" }
          }
        },
        timestamp: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 4. 创建新的索引
db.vision_tasks.createIndex(
  { "task_id": 1 },
  { unique: true }
),  // 添加逗号

db.vision_tasks.createIndex(
  { "user_id": 1, "created_at": -1 }
),  // 添加逗号

db.realtime_analysis_cache.createIndex(
  { "cache_key": 1 },
  { unique: true }
),  // 添加逗号

db.realtime_analysis_cache.createIndex(
  { "created_at": 1 },
  { expireAfterSeconds: 3600 }  // 1小时后过期
),  // 添加逗号

db.performance_metrics.createIndex(
  { "timestamp": 1 },
  { expireAfterSeconds: 604800 }  // 7天后过期
),  // 添加逗号

// 5. 更新现有集合的TTL索引
db.system_metrics.createIndex(
  { "timestamp": 1 },
  {
    expireAfterSeconds: 2592000,  // 30天后过期
    partialFilterExpression: {
      "metric_type": { $in: ["cpu_usage", "memory_usage"] }
    }
  }),  // 添加逗号

// 6. 添加复合索引以优化查询性能
db.vision_tasks.createIndex(
  {
    "analysis_type": 1,
    "status": 1,
    "created_at": -1
  },
  {
    partialFilterExpression: {
      "status": "processing"
    },
    name: "active_tasks_lookup"
  }),  // 添加逗号

// 1. 添加用户界面配置集合
db.createCollection('ui_preferences', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "theme", "layout", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        theme: {
          enum: ["light", "dark", "system", "custom"],
          description: "界面主题"
        },
        layout: {
          bsonType: "object",
          properties: {
            dashboard_widgets: { bsonType: "array" },
            sidebar_items: { bsonType: "array" },
            quick_actions: { bsonType: "array" }
          }
        },
        accessibility: {
          bsonType: "object",
          properties: {
            font_size: { bsonType: "string" },
            contrast: { bsonType: "string" },
            animation_reduced: { bsonType: "bool" }
          }
        },
        notifications: {
          bsonType: "object",
          properties: {
            email: { bsonType: "bool" },
            push: { bsonType: "bool" },
            frequency: { bsonType: "string" }
          }
        },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 2. 添加数据可视化板集合
db.createCollection('visualization_presets', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["preset_name", "chart_type", "config", "created_at"],
      properties: {
        preset_name: { bsonType: "string" },
        chart_type: {
          enum: ["progress", "comparison", "distribution", "timeline"],
          description: "图表类型"
        },
        config: {
          bsonType: "object",
          properties: {
            colors: { bsonType: "array" },
            animations: { bsonType: "object" },
            responsive_config: { bsonType: "object" }
          }
        },
        usage_stats: {
          bsonType: "object",
          properties: {
            times_used: { bsonType: "number" },
            last_used: { bsonType: "date" },
            user_ratings: { bsonType: "array" }
          }
        }
      }
    }
  }
}),  // 添加逗号

// 3. 更新health_records集合添加前端展示相关字段
db.health_records.updateMany({}, {
  $set: {
    "display_config": {
      "chart_type": null,
      "comparison_period": null,
      "highlight_metrics": [],
      "custom_annotations": []
    },
    "interaction_history": {
      "last_viewed": null,
      "view_count": 0,
      "favorite": false,
      "shared_count": 0
    }
  }
}),  // 添加逗号

// 4. 添加用户交互历史索引
db.ui_preferences.createIndex(
  { "user_id": 1 },
  { unique: true }
),  // 添加逗号

db.visualization_presets.createIndex(
  { "preset_name": 1 },
  { unique: true }
),  // 添加逗号

db.visualization_presets.createIndex(
  { "usage_stats.times_used": -1 },
  { name: "popular_presets" }
),  // 添加逗号

// 5. 添加用户界面会话集合
db.createCollection('ui_sessions', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["session_id", "user_id", "start_time", "device_info"],
      properties: {
        session_id: { bsonType: "string" },
        user_id: { bsonType: "objectId" },
        start_time: { bsonType: "date" },
        end_time: { bsonType: "date" },
        device_info: {
          bsonType: "object",
          properties: {
            device_type: { bsonType: "string" },
            browser: { bsonType: "string" },
            screen_resolution: { bsonType: "string" }
          }
        },
        interaction_log: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              action: { bsonType: "string" },
              timestamp: { bsonType: "date" },
              component: { bsonType: "string" },
              details: { bsonType: "object" }
            }
          }
        },
        performance_metrics: {
          bsonType: "object",
          properties: {
            page_load_time: { bsonType: "number" },
            response_times: { bsonType: "array" },
            error_count: { bsonType: "number" }
        }
      }
    }
  }
}),  // 添加逗号

// 6. 创建会话相关索引
db.ui_sessions.createIndex(
  { "session_id": 1 },
  { unique: true }
),  // 添加逗号

db.ui_sessions.createIndex(
  { "user_id": 1, "start_time": -1 }
),  // 添加逗号

db.ui_sessions.createIndex(
  { "start_time": 1 },
  { expireAfterSeconds: 7776000 }  // 90天后过期
),  // 添加逗号

// 1. 添加用户界面交互反馈集合
db.createCollection('ui_feedback', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "page_path", "interaction_type", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        page_path: { bsonType: "string" },
        interaction_type: {
          enum: ["click", "scroll", "hover", "form_submit", "error"],
          description: "交互类型"
        },
        element_info: {
          bsonType: "object",
          properties: {
            element_id: { bsonType: "string" },
            element_type: { bsonType: "string" },
            screen_position: {
              bsonType: "object",
              properties: {
                x: { bsonType: "number" },
                y: { bsonType: "number" }
              }
            }
          }
        },
        performance_data: {
          bsonType: "object",
          properties: {
            response_time: { bsonType: "number" },
            render_time: { bsonType: "number" },
            memory_usage: { bsonType: "number" }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 2. 添加数据可视化缓存集合
db.createCollection('visualization_cache', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["cache_key", "chart_data", "created_at"],
      properties: {
        cache_key: { bsonType: "string" },
        chart_data: { bsonType: "object" },
        chart_config: { bsonType: "object" },
        expiry: { bsonType: "date" },
        access_count: { bsonType: "number" },
        last_accessed: { bsonType: "date" },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 3. 更新ui_preferences集合添加新字段
db.ui_preferences.updateMany({}, {
  $set: {
    "data_visualization": {
      "preferred_charts": [],
      "color_scheme": "default",
      "animation_speed": "normal",
      "data_density": "medium"
    },
    "accessibility_settings": {
      "screen_reader": false,
      "keyboard_shortcuts": true,
      "high_contrast": false,
      "text_to_speech": false
    },
    "mobile_preferences": {
      "enable_gestures": true,
      "compact_view": false,
      "offline_mode": false
    }
  }
}),  // 添加逗号

// 4. 创建新的索引优化查询性能
db.ui_feedback.createIndex(
  { "user_id": 1, "created_at": -1 }
),  // 添加逗号

db.ui_feedback.createIndex(
  { "page_path": 1, "interaction_type": 1 }
),  // 添加逗号

db.visualization_cache.createIndex(
  { "cache_key": 1 },
  { unique: true }
),  // 添加逗号

db.visualization_cache.createIndex(
  { "created_at": 1 },
  { expireAfterSeconds: 3600 }  // 1小时后过期
),  // 添加逗号

// 5. 添加分片配置
sh.shardCollection("health_management_dev.ui_feedback", {
  "user_id": "hashed"
}),  // 添加逗号

sh.shardCollection("health_management_dev.visualization_cache", {
  "cache_key": "hashed"
}),  // 添加逗号

// 6. 更新现有集合的TTL索引
db.ui_sessions.createIndex(
  { "created_at": 1 },
  {
    expireAfterSeconds: 86400,  // 24小时后过期
    partialFilterExpression: {
      "session_status": "completed"
    }
  }),  // 添加逗号

// 更新现有的training_plans集合，添加新字段
db.training_plans.updateMany({}, {
  $set: {
    "training_metrics": {
      "completion_rate": 0,
      "consistency_score": 0,
      "performance_trend": [],
      "injury_prevention_score": 1.0
    },
    "equipment_requirements": {
      "required_items": [],
      "alternative_items": [],
      "space_needed": "minimal"
    },
    "personalization": {
      "difficulty_adjustments": [],
      "preferred_time_slots": [],
      "exercise_preferences": [],
      "avoided_exercises": []
    }
  }
}),  // 添加逗号

// 更新现有的nutrition_tracking集合，添加新字段
db.nutrition_tracking.updateMany({}, {
  $set: {
    "smart_suggestions": {
      "alternative_foods": [],
      "portion_control_tips": [],
      "timing_recommendations": []
    },
    "environmental_factors": {
      "location": null,
      "meal_environment": null,
      "social_context": null
    },
    "compliance_metrics": {
      "plan_adherence": 0,
      "meal_timing_score": 0,
      "hydration_level": 0
    }
  }
}),  // 添加逗号

// 更新现有的sleep_records集合，添加新字段
db.sleep_records.updateMany({}, {
  $set: {
    "environmental_data": {
      "room_temperature": null,
      "humidity": null,
      "noise_level": null,
      "light_level": null
    },
    "lifestyle_factors": {
      "caffeine_intake": null,
      "exercise_time": null,
      "screen_time": null,
      "stress_level": null
    },
    "smart_alarm": {
      "target_wake_time": null,
      "wake_window": null,
      "optimal_wake_time": null
    }
  }
}),  // 添加逗号

// 更新现有的mental_health_assessments集合，添加新字段
db.mental_health_assessments.updateMany({}, {
  $set: {
    "intervention_tracking": {
      "recommended_activities": [],
      "completed_activities": [],
      "effectiveness_ratings": []
    },
    "support_network": {
      "professional_support": [],
      "peer_support": [],
      "community_resources": []
    },
    "progress_indicators": {
      "wellbeing_score": 0,
      "resilience_level": 0,
      "coping_effectiveness": 0
    }
  }
}),  // 添加逗号

// 创建社交互动追踪集合
db.createCollection('social_interactions', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "interaction_type", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        interaction_type: {
          enum: ["support_given", "support_received", "group_activity", "challenge_participation", "milestone_celebration"]
        },
        interaction_details: {
          bsonType: "object",
          properties: {
            participants: { bsonType: "array" },
            context: { bsonType: "string" },
            impact_rating: { bsonType: "number" }
          }
        },
        engagement_metrics: {
          bsonType: "object",
          properties: {
            duration: { bsonType: "number" },
            quality_score: { bsonType: "number" },
            reciprocity_level: { bsonType: "number" }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 创建相关索引
db.social_interactions.createIndex(
  { "user_id": 1, "created_at": -1 }
),  // 添加逗号

db.social_interactions.createIndex(
  { "interaction_type": 1, "created_at": -1 }
),  // 添加逗号

// 添加TTL索引
db.social_interactions.createIndex(
  { "created_at": 1 },
  { expireAfterSeconds: 7776000 }  // 90天后过期
),  // 添加逗号

// 添加分片配置
sh.shardCollection("health_management_dev.social_interactions", {
  "user_id": "hashed"
}),  // 添加逗号

// 创建运动训练评估集合
db.createCollection('exercise_assessments', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "assessment_type", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        assessment_type: {
          enum: ["initial", "progress", "performance", "injury_risk"],
          description: "评估类型"
        },
        physical_metrics: {
          bsonType: "object",
          properties: {
            strength_level: { bsonType: "number" },
            flexibility: { bsonType: "number" },
            endurance: { bsonType: "number" },
            balance: { bsonType: "number" },
            mobility_score: { bsonType: "number" }
          }
        },
        movement_analysis: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              movement_type: { bsonType: "string" },
              quality_score: { bsonType: "number" },
              risk_factors: { bsonType: "array" }
            }
          }
        },
        recommendations: {
          bsonType: "object",
          properties: {
            training_focus: { bsonType: "array" },
            exercise_modifications: { bsonType: "array" },
            progression_plan: { bsonType: "object" }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 创建营养日志详细记录集合
db.createCollection('nutrition_logs', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "meal_date", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        meal_date: { bsonType: "date" },
        meals: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              meal_type: {
                enum: ["breakfast", "lunch", "dinner", "snack"]
              },
              time: { bsonType: "date" },
              foods: [{
                food_id: { bsonType: "objectId" },
                portion: { bsonType: "number" },
                unit: { bsonType: "string" },
                nutrition_facts: { bsonType: "object" }
              }],
              hunger_level: { bsonType: "number" },
              satisfaction_level: { bsonType: "number" }
            }
          }
        },
        daily_metrics: {
          bsonType: "object",
          properties: {
            total_calories: { bsonType: "number" },
            macros_distribution: { bsonType: "object" },
            hydration: { bsonType: "number" },
            fiber_intake: { bsonType: "number" }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 创建睡眠质量分析集
db.createCollection('sleep_quality_analysis', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "analysis_date", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        analysis_date: { bsonType: "date" },
        sleep_stages: {
          bsonType: "object",
          properties: {
            deep_sleep: { bsonType: "number" },
            light_sleep: { bsonType: "number" },
            rem_sleep: { bsonType: "number" },
            awake_time: { bsonType: "number" }
          }
        },
        quality_metrics: {
          bsonType: "object",
          properties: {
            efficiency: { bsonType: "number" },
            latency: { bsonType: "number" },
            disruptions: { bsonType: "number" },
            recovery_score: { bsonType: "number" }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 创建相关索引
db.exercise_assessments.createIndex(
  { "user_id": 1, "created_at": -1 }
),  // 添加逗号

db.nutrition_logs.createIndex(
  { "user_id": 1, "meal_date": -1 }
),  // 添加逗号

db.sleep_quality_analysis.createIndex(
  { "user_id": 1, "analysis_date": -1 }
),  // 添加逗号

// 添加TTL索引
db.nutrition_logs.createIndex(
  { "created_at": 1 },
  { expireAfterSeconds: 15552000 }  // 180天后过期
),  // 添加逗号

// 添加分片配置
sh.shardCollection("health_management_dev.exercise_assessments", {
  "user_id": "hashed"
}),  // 添加逗号

sh.shardCollection("health_management_dev.nutrition_logs", {
  "user_id": "hashed"
}),  // 添加逗号

sh.shardCollection("health_management_dev.sleep_quality_analysis", {
  "user_id": "hashed"
}),  // ���加逗���

// 创建心理健康评估集合
db.createCollection('mental_health_assessments', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "assessment_type", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        assessment_type: {
          enum: ["mood", "stress", "anxiety", "sleep_quality", "life_satisfaction"],
          description: "评估类型"
        },
        assessment_scores: {
          bsonType: "object",
          properties: {
            overall_score: { bsonType: "number" },
            sub_scores: {
              bsonType: "object",
              properties: {
                emotional_state: { bsonType: "number" },
                stress_level: { bsonType: "number" },
                coping_ability: { bsonType: "number" },
                social_support: { bsonType: "number" }
              }
            }
          },
          intervention_plan: {
            bsonType: "object",
            properties: {
              recommended_activities: { bsonType: "array" },
              coping_strategies: { bsonType: "array" },
              support_resources: { bsonType: "array" }
            }
          },
          progress_tracking: {
            bsonType: "array",
            items: {
              bsonType: "object",
              properties: {
                date: { bsonType: "date" },
                improvement_score: { bsonType: "number" },
                notes: { bsonType: "string" }
              }
            }
          },
          created_at: { bsonType: "date" }
        }
      }
    }
  }
}),  // 添加逗号

// 创建运动训练计划详细集合
db.createCollection('training_plan_details', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["plan_id", "user_id", "created_at"],
      properties: {
        plan_id: { bsonType: "objectId" },
        user_id: { bsonType: "objectId" },
        exercise_details: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              exercise_id: { bsonType: "objectId" },
              sets: { bsonType: "number" },
              reps: { bsonType: "number" },
              weight: { bsonType: "number" },
              rest_time: { bsonType: "number" },
              form_notes: { bsonType: "string" }
            }
          }
        },
        progression_metrics: {
          bsonType: "object",
          properties: {
            strength_progress: { bsonType: "number" },
            endurance_improvement: { bsonType: "number" },
            technique_score: { bsonType: "number" }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 创建相关索引
db.mental_health_assessments.createIndex(
  { "user_id": 1, "created_at": -1 }
),  // 添加逗号

db.mental_health_assessments.createIndex(
  { "assessment_type": 1, "created_at": -1 }
),  // 添加逗号

db.training_plan_details.createIndex(
  { "plan_id": 1, "user_id": 1 }
),  // 添加逗号

// 添加TTL索引
db.mental_health_assessments.createIndex(
  { "created_at": 1 },
  { expireAfterSeconds: 31536000 }  // 365天后过期
),  // 添加逗号

// 添加分片配置
sh.shardCollection("health_management_dev.mental_health_assessments", {
  "user_id": "hashed"
}),  // 添加逗号

sh.shardCollection("health_management_dev.training_plan_details", {
  "user_id": "hashed"
}),  // 添加逗号

// 创建运动训练反馈和评估集合
db.createCollection('exercise_feedback', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "exercise_id", "session_id", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        exercise_id: { bsonType: "objectId" },
        session_id: { bsonType: "objectId" },
        performance_metrics: {
          bsonType: "object",
          properties: {
            form_accuracy: { bsonType: "number" },
            movement_stability: { bsonType: "number" },
            range_of_motion: { bsonType: "number" },
            balance_score: { bsonType: "number" }
          }
        },
        biometric_data: {
          bsonType: "object",
          properties: {
            heart_rate: { bsonType: "number" },
            oxygen_level: { bsonType: "number" },
            blood_pressure: {
              systolic: { bsonType: "number" },
              diastolic: { bsonType: "number" }
            }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 创建营养摄入详细记录集合
db.createCollection('nutrition_intake_details', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "meal_id", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        meal_id: { bsonType: "objectId" },
        detailed_nutrients: {
          bsonType: "object",
          properties: {
            vitamins: { bsonType: "object" },
            minerals: { bsonType: "object" },
            amino_acids: { bsonType: "object" },
            fatty_acids: { bsonType: "object" }
          }
        },
        meal_timing: {
          meal_start: { bsonType: "date" },
          meal_duration: { bsonType: "number" }
        },
        hunger_satiety: {
          pre_meal: { bsonType: "number" },
          post_meal: { bsonType: "number" }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 更新现有的sleep_records集合
db.sleep_records.updateMany({}, {
  $set: {
    "sleep_architecture": {
      "sleep_cycles": [],
      "sleep_stages": {
        "light_sleep": { "duration": null, "quality": null },
        "deep_sleep": { "duration": null, "quality": null },
        "rem_sleep": { "duration": null, "quality": null }
      }
    },
    "sleep_disturbances": {
      "movement_events": [],
      "breathing_events": [],
      "heart_rate_events": []
    }
  }
}),  // 添加逗号

// 创建相关索引
db.exercise_feedback.createIndex(
  { "user_id": 1, "created_at": -1 }
),  // 添加逗号

db.exercise_feedback.createIndex(
  { "session_id": 1 }
),  // 添加逗号

db.nutrition_intake_details.createIndex(
  { "user_id": 1, "created_at": -1 }
),  // 添加逗号

// 添加TTL索引
db.exercise_feedback.createIndex(
  { "created_at": 1 },
  { expireAfterSeconds: 15552000 }  // 180天后过期
),  // 添加逗号

// 添加分片配置
sh.shardCollection("health_management_dev.exercise_feedback", {
  "user_id": "hashed"
}),  // 添加逗号

sh.shardCollection("health_management_dev.nutrition_intake_details", {
  "user_id": "hashed"
}),  // 添加逗号

// 创建运动训练计划模板集合
db.createCollection('training_plan_templates', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["template_name", "category", "difficulty_level", "created_at"],
      properties: {
        template_name: { bsonType: "string" },
        category: {
          enum: ["strength", "cardio", "flexibility", "balance", "hybrid"],
          description: "训练类别"
        },
        difficulty_level: {
          enum: ["beginner", "intermediate", "advanced", "expert"],
          description: "难度等级"
        },
        exercise_sequence: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              exercise_type: { bsonType: "string" },
              duration: { bsonType: "number" },
              sets: { bsonType: "number" },
              reps: { bsonType: "number" },
              rest_period: { bsonType: "number" },
              intensity_level: { bsonType: "number" }
            }
          }
        },
        equipment_required: { bsonType: "array" },
        target_muscle_groups: { bsonType: "array" },
        estimated_calories: { bsonType: "number" },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 创建饮食计划推荐集合
db.createCollection('meal_plan_recommendations', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "plan_type", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        plan_type: {
          enum: ["weight_loss", "muscle_gain", "maintenance", "special_diet"],
          description: "计划类型"
        },
        daily_plans: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              day_of_week: { bsonType: "string" },
              meals: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  properties: {
                    meal_time: { bsonType: "string" },
                    suggested_items: { bsonType: "array" },
                    nutrition_targets: {
                      calories: { bsonType: "number" },
                      protein: { bsonType: "number" },
                      carbs: { bsonType: "number" },
                      fats: { bsonType: "number" }
                    }
                  }
                }
              }
            }
          }
        },
        dietary_restrictions: { bsonType: "array" },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 更新现有的mental_health_assessments集合
db.mental_health_assessments.updateMany({}, {
  $set: {
    "cognitive_assessment": {
      "attention_score": null,
      "memory_score": null,
      "processing_speed": null,
      "executive_function": null
    },
    "behavioral_patterns": {
      "sleep_quality": null,
      "activity_level": null,
      "social_engagement": null,
      "stress_indicators": []
    }
  }
}),  // 添加逗号

// 创建相关索引
db.training_plan_templates.createIndex(
  { "category": 1, "difficulty_level": 1 }
),  // 添加逗号

db.training_plan_templates.createIndex(
  { "target_muscle_groups": 1 }
),  // 添加逗号

db.meal_plan_recommendations.createIndex(
  { "user_id": 1, "created_at": -1 }
),  // 添加逗号

// 添加TTL索引
db.meal_plan_recommendations.createIndex(
  { "created_at": 1 },
  { expireAfterSeconds: 7776000 }  // 90天后过期
),  // 添加逗号

// 添加分片配置
sh.shardCollection("health_management_dev.training_plan_templates", {
  "category": "hashed"
}),  // 添加逗号

sh.shardCollection("health_management_dev.meal_plan_recommendations", {
  "user_id": "hashed"
}),  // 添加逗号

// 创建运动训练进度追踪集合
db.createCollection('training_progress', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "training_plan_id", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        training_plan_id: { bsonType: "objectId" },
        progress_metrics: {
          bsonType: "object",
          properties: {
            completion_rate: { bsonType: "number" },
            performance_score: { bsonType: "number" },
            consistency_index: { bsonType: "number" },
            milestone_achievements: { bsonType: "array" }
          }
        },
        adaptation_data: {
          bsonType: "object",
          properties: {
            fatigue_level: { bsonType: "number" },
            recovery_status: { bsonType: "string" },
            adaptation_rate: { bsonType: "number" }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 创建社交互动效果评估集合
db.createCollection('social_interaction_impact', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "interaction_id", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        interaction_id: { bsonType: "objectId" },
        impact_metrics: {
          bsonType: "object",
          properties: {
            motivation_boost: { bsonType: "number" },
            emotional_support: { bsonType: "number" },
            accountability: { bsonType: "number" },
            community_engagement: { bsonType: "number" }
          }
        },
        behavioral_changes: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              aspect: { bsonType: "string" },
              change_level: { bsonType: "number" },
              sustainability: { bsonType: "number" }
            }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 更新现有的training_plans集合
db.training_plans.updateMany({}, {
  $set: {
    "adaptive_adjustments": {
      "intensity_modifications": [],
      "volume_adjustments": [],
      "exercise_substitutions": [],
      "rest_period_changes": []
    },
    "feedback_integration": {
      "user_feedback": [],
      "performance_data": [],
      "recovery_metrics": [],
      "adaptation_indicators": []
    }
  }
}),  // 添加逗号

// 创建相关索引
db.training_progress.createIndex(
  { "user_id": 1, "created_at": -1 }
),  // 添加逗号

db.social_interaction_impact.createIndex(
  { "user_id": 1, "interaction_id": 1 }
),  // 添加逗号

// 添加TTL索引
db.training_progress.createIndex(
  { "created_at": 1 },
  { expireAfterSeconds: 31536000 }  // 365天后过期
),  // 添加逗号

// 添加分片配置
sh.shardCollection("health_management_dev.training_progress", {
  "user_id": "hashed"
}),  // 添加逗号

sh.shardCollection("health_management_dev.social_interaction_impact", {
  "user_id": "hashed"
}),  // 添加逗号

// 创建饮食营养分析集合
db.createCollection('nutrition_analysis', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "analysis_type", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        analysis_type: {
          enum: ["daily", "weekly", "monthly", "custom"],
          description: "分析周期类型"
        },
        nutritional_metrics: {
          bsonType: "object",
          properties: {
            total_calories: { bsonType: "number" },
            macro_distribution: {
              protein_percentage: { bsonType: "number" },
              carbs_percentage: { bsonType: "number" },
              fats_percentage: { bsonType: "number" }
            },
            micronutrients_status: {
              vitamins: { bsonType: "object" },
              minerals: { bsonType: "object" }
            }
          }
        },
        dietary_compliance: {
          bsonType: "object",
          properties: {
            meal_timing_adherence: { bsonType: "number" },
            plan_following_rate: { bsonType: "number" },
            hydration_level: { bsonType: "number" }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 创建睡眠质量分析集合
db.createCollection('sleep_quality_analysis', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "sleep_record_id", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        sleep_record_id: { bsonType: "objectId" },
        sleep_architecture: {
          bsonType: "object",
          properties: {
            deep_sleep_percentage: { bsonType: "number" },
            rem_sleep_percentage: { bsonType: "number" },
            light_sleep_percentage: { bsonType: "number" },
            sleep_cycle_count: { bsonType: "number" }
          }
        },
        sleep_quality_indicators: {
          bsonType: "object",
          properties: {
            sleep_efficiency: { bsonType: "number" },
            sleep_latency: { bsonType: "number" },
            wake_episodes: { bsonType: "number" },
            movement_index: { bsonType: "number" }
          }
        },
        circadian_rhythm_analysis: {
          bsonType: "object",
          properties: {
            sleep_schedule_regularity: { bsonType: "number" },
            optimal_bedtime_window: {
              start: { bsonType: "date" },
              end: { bsonType: "date" }
            }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 创建相关索引
db.nutrition_analysis.createIndex(
  { "user_id": 1, "created_at": -1 }
),  // 添加逗号

db.sleep_quality_analysis.createIndex(
  { "user_id": 1, "sleep_record_id": 1 }
),  // 添加逗号

// 添加TTL索引
db.nutrition_analysis.createIndex(
  { "created_at": 1 },
  { expireAfterSeconds: 15552000 }  // 180天后过期
),  // 添加逗号

db.sleep_quality_analysis.createIndex(
  { "created_at": 1 },
  { expireAfterSeconds: 15552000 }  // 180天后过期
),  // 添加逗号

// 添加分片配置
sh.shardCollection("health_management_dev.nutrition_analysis", {
  "user_id": "hashed"
}),  // 添加逗号

sh.shardCollection("health_management_dev.sleep_quality_analysis", {
  "user_id": "hashed"
}),  // 添加逗号

// 更新现有的mental_health_assessments集合
db.mental_health_assessments.updateMany({}, {
  $set: {
    "emotional_regulation": {
      "stress_management_score": null,
      "emotional_awareness": null,
      "coping_strategies": [],
      "resilience_indicators": []
    },
    "social_connection_metrics": {
      "support_network_strength": null,
      "relationship_quality": null,
      "community_engagement": null,
      "isolation_risk_score": null
    }
  }
}),  // 添加逗号

// 创建社交支持网分析集合
db.createCollection('social_support_network', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "network_type", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        network_type: {
          enum: ["family", "friends", "professional", "community"],
          description: "社交网络类型"
        },
        support_metrics: {
          bsonType: "object",
          properties: {
            emotional_support: { bsonType: "number" },
            instrumental_support: { bsonType: "number" },
            informational_support: { bsonType: "number" },
            companionship: { bsonType: "number" }
          }
        },
        interaction_patterns: {
          bsonType: "object",
          properties: {
            frequency: { bsonType: "number" },
            quality: { bsonType: "number" },
            reciprocity: { bsonType: "number" }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 创建心理健康干预记录集合
db.createCollection('mental_health_interventions', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "intervention_type", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        intervention_type: {
          enum: ["counseling", "meditation", "stress_management", "cognitive_behavioral"],
          description: "干预类型"
        },
        intervention_details: {
          bsonType: "object",
          properties: {
            duration_minutes: { bsonType: "number" },
            technique_used: { bsonType: "string" },
            practitioner_notes: { bsonType: "string" }
          }
        },
        effectiveness_metrics: {
          bsonType: "object",
          properties: {
            mood_improvement: { bsonType: "number" },
            anxiety_reduction: { bsonType: "number" },
            coping_skills_enhancement: { bsonType: "number" }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 更新现有的training_progress集合
db.training_progress.updateMany({}, {
  $set: {
    "training_environment": {
      "location_type": null,
      "equipment_availability": [],
      "weather_conditions": null
    },
    "training_feedback": {
      "perceived_difficulty": null,
      "enjoyment_level": null,
      "motivation_score": null,
      "suggested_adjustments": []
    }
  }
}),  // 添加逗号

// 创建相关索引
db.social_support_network.createIndex(
  { "user_id": 1, "network_type": 1 }
),  // 添加逗号

db.mental_health_interventions.createIndex(
  { "user_id": 1, "created_at": -1 }
),  // 添加逗号

// 添加TTL��引
db.social_support_network.createIndex(
  { "created_at": 1 },
  { expireAfterSeconds: 31536000 }  // 365天后过期
),  // 添加逗号

db.mental_health_interventions.createIndex(
  { "created_at": 1 },
  { expireAfterSeconds: 15552000 }  // 180天后过期
),  // 添加逗号

// 添加分片配置
sh.shardCollection("health_management_dev.social_support_network", {
  "user_id": "hashed"
}),  // 添加逗号

sh.shardCollection("health_management_dev.mental_health_interventions", {
  "user_id": "hashed"
}),  // 添加逗号

// 创建运动训练计划定制化集合
db.createCollection('training_plan_customization', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "template_id", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        template_id: { bsonType: "objectId" },
        customization_factors: {
          bsonType: "object",
          properties: {
            fitness_level: { bsonType: "number" },
            injury_history: { bsonType: "array" },
            equipment_access: { bsonType: "array" },
            time_availability: { bsonType: "object" }
          }
        },
        adaptation_history: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              date: { bsonType: "date" },
              adjustment_type: { bsonType: "string" },
              reason: { bsonType: "string" }
            }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 创建饮食习惯追踪集合
db.createCollection('dietary_habits_tracking', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "tracking_date", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        tracking_date: { bsonType: "date" },
        meal_patterns: {
          bsonType: "object",
          properties: {
            meal_timing: { bsonType: "array" },
            portion_control: { bsonType: "object" },
            eating_speed: { bsonType: "string" }
          }
        },
        behavioral_factors: {
          bsonType: "object",
          properties: {
            emotional_eating: { bsonType: "boolean" },
            social_influences: { bsonType: "array" },
            stress_related_eating: { bsonType: "boolean" }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 更新现有的sleep_records集合
db.sleep_records.updateMany({}, {
  $set: {
    "sleep_hygiene": {
      "bedtime_routine": [],
      "bedroom_environment": {
        "temperature_optimal": null,
        "noise_level_optimal": null,
        "light_level_optimal": null
      },
      "daytime_habits": {
        "exercise_timing": null,
        "caffeine_cutoff": null,
        "screen_time_before_bed": null
      }
    },
    "recovery_metrics": {
      "heart_rate_variability": null,
      "resting_heart_rate": null,
      "respiratory_rate": null,
      "recovery_score": null
    }
  }
}),  // 添加逗号

// 创建相关索引
db.training_plan_customization.createIndex(
  { "user_id": 1, "created_at": -1 }
),  // 添加逗号

db.dietary_habits_tracking.createIndex(
  { "user_id": 1, "tracking_date": -1 }
),  // 添加逗号

// 添加TTL索引
db.training_plan_customization.createIndex(
  { "created_at": 1 },
  { expireAfterSeconds: 31536000 }  // 365天后过期
),  // 添加逗号

db.dietary_habits_tracking.createIndex(
  { "created_at": 1 },
  { expireAfterSeconds: 15552000 }  // 180天后过期
),  // 添加逗号

// 添加分片配置
sh.shardCollection("health_management_dev.training_plan_customization", {
  "user_id": "hashed"
}),  // 添加逗号

sh.shardCollection("health_management_dev.dietary_habits_tracking", {
  "user_id": "hashed"
}),  // 添加逗号

// 1. 创建营养管理集合
db.createCollection('nutrition_management', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "record_date", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        record_date: { bsonType: "date" },
        dietary_records: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              meal_type: {
                enum: ["breakfast", "lunch", "dinner", "snack"],
                description: "餐食类型"
              },
              food_items: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  properties: {
                    name: { bsonType: "string" },
                    portion: { bsonType: "number" },
                    unit: { bsonType: "string" },
                    nutrients: { bsonType: "object" }
                  }
                }
              }
            }
          }
        },
        nutrition_goals: {
          bsonType: "object",
          properties: {
            calorie_target: { bsonType: "number" },
            macro_targets: {
              bsonType: "object",
              properties: {
                protein: { bsonType: "number" },
                carbs: { bsonType: "number" },
                fats: { bsonType: "number" }
              }
            }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 2. 创建训练计划集合
db.createCollection('training_plans', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "plan_type", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        plan_type: {
          enum: ["strength", "cardio", "flexibility", "rehabilitation"],
          description: "训练类型"
        },
        exercises: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              name: { bsonType: "string" },
              sets: { bsonType: "number" },
              reps: { bsonType: "number" },
              intensity: { bsonType: "number" },
              rest_period: { bsonType: "number" }
            }
          }
        },
        schedule: {
          bsonType: "object",
          properties: {
            frequency: { bsonType: "number" },
            duration_weeks: { bsonType: "number" },
            sessions_per_week: { bsonType: "number" }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 3. 更新现有的sleep_records集合
db.sleep_records.updateMany({}, {
  $set: {
    "sleep_quality_metrics": {
      "deep_sleep_percentage": null,
      "rem_sleep_percentage": null,
      "sleep_efficiency": null,
      "interruption_count": null
    },
    "sleep_habits": {
      "bedtime_consistency": null,
      "wake_time_consistency": null,
      "pre_sleep_routine": [],
      "post_sleep_energy": null
    }
  }
}),  // 添加逗号

// 创建相关索引
db.nutrition_management.createIndex(
  { "user_id": 1, "record_date": -1 }
),  // 添加逗号

db.training_plans.createIndex(
  { "user_id": 1, "plan_type": 1, "created_at": -1 }
),  // 添加逗号

// 添加TTL索引
db.nutrition_management.createIndex(
  { "created_at": 1 },
  { expireAfterSeconds: 31536000 }  // 365天后过期
),  // 添加逗号

// 1. 用户设备关联集合
db.createCollection('user_devices', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "device_id", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        device_id: { bsonType: "string" },
        device_type: {
          enum: ["smartphone", "smartwatch", "fitness_tracker", "medical_device"],
          description: "设备类型"
        },
        device_info: {
          bsonType: "object",
          properties: {
            model: { bsonType: "string" },
            os_version: { bsonType: "string" },
            app_version: { bsonType: "string" }
          }
        },
        sync_settings: {
          bsonType: "object",
          properties: {
            auto_sync: { bsonType: "bool" },
            sync_frequency: { bsonType: "number" },
            last_sync: { bsonType: "date" }
          }
        },
        status: {
          enum: ["active", "inactive", "disconnected"],
          description: "设备状态"
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 2. 数据采集配置����合
db.createCollection('data_collection_config', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "collection_type", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        collection_type: {
          enum: ["health_metrics", "activity_data", "environmental_data"],
          description: "采集类型"
        },
        sampling_config: {
          bsonType: "object",
          properties: {
            frequency: { bsonType: "number" },
            precision: { bsonType: "number" },
            batch_size: { bsonType: "number" }
          }
        },
        processing_rules: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              metric: { bsonType: "string" },
              aggregation_method: { bsonType: "string" },
              validation_rules: { bsonType: "array" }
            }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 3. 系统性能监控集合
db.createCollection('system_performance_metrics', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["metric_type", "timestamp", "value"],
      properties: {
        metric_type: {
          enum: ["cpu_usage", "memory_usage", "disk_io", "network_latency", "api_response_time"],
          description: "指标类型"
        },
        value: { bsonType: "number" },
        context: {
          bsonType: "object",
          properties: {
            server_id: { bsonType: "string" },
            service_name: { bsonType: "string" },
            environment: { bsonType: "string" }
          }
        },
        thresholds: {
          bsonType: "object",
          properties: {
            warning: { bsonType: "number" },
            critical: { bsonType: "number" }
          }
        },
        timestamp: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 创建相关索引
db.user_devices.createIndex(
  { "user_id": 1, "device_id": 1 },
  { unique: true }
),  // 添加逗号

db.user_devices.createIndex(
  { "last_sync": 1 },
  { expireAfterSeconds: 7776000 }  // 90天后过期
),  // 添加逗号

db.data_collection_config.createIndex(
  { "user_id": 1, "collection_type": 1 }
),  // 添加逗号

db.system_performance_metrics.createIndex(
  { "timestamp": 1, "metric_type": 1 }
),  // 添加逗号

// 添加分片配置
sh.shardCollection("health_management_dev.user_devices", {
  "user_id": "hashed"
}),  // 添加逗号

sh.shardCollection("health_management_dev.system_performance_metrics", {
  "timestamp": "hashed"
}),  // 添加逗号

// 7. 用户行为追踪集合
db.createCollection('user_activity_tracking', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "activity_type", "timestamp"],
      properties: {
        user_id: { bsonType: "objectId" },
        activity_type: {
          enum: ["login", "feature_usage", "data_sync", "settings_change", "social_interaction"],
          description: "活动类型"
        },
        activity_details: {
          bsonType: "object",
          properties: {
            feature_id: { bsonType: "string" },
            action: { bsonType: "string" },
            duration: { bsonType: "number" },
            result: { bsonType: "string" }
          }
        },
        device_info: {
          bsonType: "object",
          properties: {
            device_id: { bsonType: "string" },
            platform: { bsonType: "string" },
            app_version: { bsonType: "string" }
          }
        },
        timestamp: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 8. 数据同步状态集合
db.createCollection('data_sync_status', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "sync_type", "status", "timestamp"],
      properties: {
        user_id: { bsonType: "objectId" },
        sync_type: {
          enum: ["health_data", "training_plan", "nutrition_data", "sleep_data"],
          description: "同步类型"
        },
        status: {
          enum: ["pending", "in_progress", "completed", "failed"],
          description: "同步状态"
        },
        sync_details: {
          bsonType: "object",
          properties: {
            records_count: { bsonType: "number" },
            start_time: { bsonType: "date" },
            end_time: { bsonType: "date" },
            error_message: { bsonType: "string" }
          }
        },
        timestamp: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 9. 系统告警配置集合
db.createCollection('system_alert_config', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["alert_type", "threshold_config", "notification_config"],
      properties: {
        alert_type: {
          enum: ["performance", "security", "data_quality", "user_activity"],
          description: "告警类型"
        },
        threshold_config: {
          bsonType: "object",
          properties: {
            metric: { bsonType: "string" },
            warning_threshold: { bsonType: "number" },
            critical_threshold: { bsonType: "number" },
            evaluation_period: { bsonType: "number" }
          }
        },
        notification_config: {
          bsonType: "object",
          properties: {
            channels: { bsonType: "array" },
            recipients: { bsonType: "array" },
            message_template: { bsonType: "string" }
          }
        },
        enabled: { bsonType: "bool" }
      }
    }
  }
}),  // 添加逗号

// 创建相关索引
db.user_activity_tracking.createIndex(
  { "user_id": 1, "activity_type": 1, "timestamp": -1 }
),  // 添加逗号

db.user_activity_tracking.createIndex(
  { "timestamp": 1 },
  { expireAfterSeconds: 7776000 }  // 90天后过期
),  // 添加逗号

db.data_sync_status.createIndex(
  { "user_id": 1, "sync_type": 1, "timestamp": -1 }
),  // 添加逗号

db.data_sync_status.createIndex(
  { "status": 1, "timestamp": 1 }
),  // 添加逗号

db.system_alert_config.createIndex(
  { "alert_type": 1, "enabled": 1 }
),  // 添加逗号

// 添加分片配置
sh.shardCollection("health_management_dev.user_activity_tracking", {
  "user_id": "hashed"
}),  // 添加逗号

sh.shardCollection("health_management_dev.data_sync_status", {
  "user_id": "hashed"
}),  // 添加逗号

// 10. 用户权限和访问控制集合
db.createCollection('access_control', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "resource_type", "permissions", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        resource_type: {
          enum: ["health_data", "training_plan", "analysis_report", "system_config"],
          description: "资源类型"
        },
        permissions: {
          bsonType: "object",
          properties: {
            read: { bsonType: "bool" },
            write: { bsonType: "bool" },
            delete: { bsonType: "bool" },
            share: { bsonType: "bool" }
          }
        },
        access_level: {
          enum: ["user", "trainer", "doctor", "admin"],
          description: "访问级别"
        },
        valid_period: {
          bsonType: "object",
          properties: {
            start_date: { bsonType: "date" },
            end_date: { bsonType: "date" }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 11. 数据质量监控集合
db.createCollection('data_quality_monitoring', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["data_source", "check_type", "check_result", "timestamp"],
      properties: {
        data_source: {
          bsonType: "string",
          description: "数据源"
        },
        check_type: {
          enum: ["completeness", "accuracy", "consistency", "timeliness"],
          description: "检查类型"
        },
        check_result: {
          bsonType: "object",
          properties: {
            status: {
              enum: ["passed", "warning", "failed"],
              description: "检查状态"
            },
            score: { bsonType: "number" },
            issues_found: { bsonType: "array" },
            affected_records: { bsonType: "number" }
          }
        },
        remediation_status: {
          bsonType: "object",
          properties: {
            action_required: { bsonType: "bool" },
            action_type: { bsonType: "string" },
            priority_level: { bsonType: "string" }
          }
        },
        timestamp: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 12. 系统运行状态监控集合
db.createCollection('system_health_monitoring', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["service_name", "status", "metrics", "timestamp"],
      properties: {
        service_name: { bsonType: "string" },
        status: {
          enum: ["healthy", "degraded", "down"],
          description: "服务状态"
        },
        metrics: {
          bsonType: "object",
          properties: {
            response_time: { bsonType: "number" },
            error_rate: { bsonType: "number" },
            resource_usage: {
              bsonType: "object",
              properties: {
                cpu: { bsonType: "number" },
                memory: { bsonType: "number" },
                disk: { bsonType: "number" }
              }
            }
          }
        },
        dependencies_status: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              name: { bsonType: "string" },
              status: { bsonType: "string" },
              latency: { bsonType: "number" }
            }
          }
        },
        timestamp: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 创建相关索引
db.access_control.createIndex(
  { "user_id": 1, "resource_type": 1 }
),  // 添加逗号

db.access_control.createIndex(
  { "valid_period.end_date": 1 },
  { expireAfterSeconds: 0 }
),  // 添加逗号

db.data_quality_monitoring.createIndex(
  { "data_source": 1, "check_type": 1, "timestamp": -1 }
),  // 添加逗号

db.system_health_monitoring.createIndex(
  { "service_name": 1, "timestamp": -1 }
),  // 添加逗号

// 添加TTL索引
db.data_quality_monitoring.createIndex(
  { "timestamp": 1 },
  { expireAfterSeconds: 2592000 }  // 30天后过期
),  // 添加逗号

db.system_health_monitoring.createIndex(
  { "timestamp": 1 },
  { expireAfterSeconds: 604800 }  // 7天后过期
),  // 添加逗号

// 添加分片配置
sh.shardCollection("health_management_dev.data_quality_monitoring", {
  "data_source": "hashed"
}),  // 添加逗号

sh.shardCollection("health_management_dev.system_health_monitoring", {
  "service_name": "hashed"
}),  // 添加逗号

// 最后一个语句不需要逗号
db.final_operation.createIndex(
  { field: 1 }
);  // 最后一个语句不加逗号

// 更新��限管理逻辑
db.access_control.updateMany({}, { $set: { permissions: { read: false, write: false, delete: false, share: false } } });

// 更新检查结果结构
db.data_quality_monitoring.updateMany({}, { $set: { check_result: {} } });

// 更新服务状态和指标
db.system_health_monitoring.updateMany({}, { $set: { metrics: {}, dependencies_status: [] } });

// 1. 商品管理集合
db.createCollection('products', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "category", "price", "status", "created_at"],
      properties: {
        name: {
          bsonType: "string",
          description: "商品名称"
        },
        category: {
          enum: ["health_device", "nutrition", "sports_equipment", "service"],
          description: "商品类别"
        },
        price: {
          bsonType: "object",
          properties: {
            original: { bsonType: "number" },
            current: { bsonType: "number" },
            currency: { bsonType: "string" }
          }
        },
        inventory: {
          bsonType: "object",
          properties: {
            total: { bsonType: "number" },
            available: { bsonType: "number" },
            reserved: { bsonType: "number" }
          }
        },
        attributes: {
          bsonType: "object",
          properties: {
            brand: { bsonType: "string" },
            model: { bsonType: "string" },
            specifications: { bsonType: "array" }
          }
        },
        status: {
          enum: ["active", "inactive", "out_of_stock"],
          description: "商品状态"
        },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 2. 订单管理集合
db.createCollection('orders', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "order_no", "items", "total_amount", "status", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        order_no: { bsonType: "string" },
        items: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              product_id: { bsonType: "objectId" },
              quantity: { bsonType: "number" },
              price: { bsonType: "number" },
              discount: { bsonType: "number" }
            }
          }
        },
        payment: {
          bsonType: "object",
          properties: {
            method: { bsonType: "string" },
            status: { bsonType: "string" },
            paid_amount: { bsonType: "number" },
            paid_at: { bsonType: "date" }
          }
        },
        shipping: {
          bsonType: "object",
          properties: {
            address: { bsonType: "object" },
            tracking_no: { bsonType: "string" },
            status: { bsonType: "string" }
          }
        },
        total_amount: { bsonType: "number" },
        discount_amount: { bsonType: "number" },
        status: {
          enum: ["pending", "paid", "shipped", "completed", "cancelled"],
          description: "订单状态"
        },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 3. 支付记录集合
db.createCollection('payments', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "order_id", "amount", "status", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        order_id: { bsonType: "objectId" },
        transaction_no: { bsonType: "string" },
        payment_method: {
          enum: ["alipay", "wechat", "credit_card", "points"],
          description: "支付方式"
        },
        amount: { bsonType: "number" },
        currency: { bsonType: "string" },
        status: {
          enum: ["pending", "processing", "success", "failed", "refunded"],
          description: "支付状态"
        },
        callback_data: { bsonType: "object" },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 4. 分销管理集合
db.createCollection('distribution', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "level", "status", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        parent_id: { bsonType: "objectId" },
        level: {
          enum: ["distributor", "agent", "partner"],
          description: "分销等级"
        },
        team: {
          bsonType: "object",
          properties: {
            direct_members: { bsonType: "array" },
            total_members: { bsonType: "number" }
          }
        },
        commission_config: {
          bsonType: "object",
          properties: {
            direct_rate: { bsonType: "number" },
            team_rate: { bsonType: "number" },
            bonus_rate: { bsonType: "number" }
          }
        },
        status: {
          enum: ["active", "inactive", "suspended"],
          description: "分销状态"
        },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 5. 营销活动集合
db.createCollection('marketing_campaigns', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "type", "status", "start_time", "end_time"],
      properties: {
        name: { bsonType: "string" },
        type: {
          enum: ["discount", "coupon", "flash_sale", "group_buy"],
          description: "活动类型"
        },
        rules: {
          bsonType: "object",
          properties: {
            discount_type: { bsonType: "string" },
            discount_value: { bsonType: "number" },
            minimum_amount: { bsonType: "number" },
            product_scope: { bsonType: "array" }
          }
        },
        target_users: {
          bsonType: "object",
          properties: {
            user_tags: { bsonType: "array" },
            user_levels: { bsonType: "array" }
          }
        },
        status: {
          enum: ["draft", "active", "ended", "cancelled"],
          description: "活动状态"
        },
        start_time: { bsonType: "date" },
        end_time: { bsonType: "date" },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 6. 积分奖励集合
db.createCollection('points_rewards', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "type", "points", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        type: {
          enum: ["purchase", "activity", "sign_in", "referral"],
          description: "奖励类型"
        },
        points: { bsonType: "number" },
        source: {
          bsonType: "object",
          properties: {
            reference_id: { bsonType: "string" },
            description: { bsonType: "string" }
          }
        },
        expiry_date: { bsonType: "date" },
        status: {
          enum: ["active", "used", "expired"],
          description: "积分状态"
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 创建索引
db.products.createIndex({ "name": 1, "category": 1 }),  // 添加逗号
db.products.createIndex({ "status": 1 }),  // 添加逗号

db.orders.createIndex({ "user_id": 1, "created_at": -1 }),  // 添加逗号
db.orders.createIndex({ "order_no": 1 }, { unique: true }),  // 添加逗号
db.orders.createIndex({ "status": 1 }),  // 添加逗号

db.payments.createIndex({ "user_id": 1, "order_id": 1 }),  // 添加逗号
db.payments.createIndex({ "transaction_no": 1 }, { unique: true }),  // 添加逗号

db.distribution.createIndex({ "user_id": 1 }, { unique: true }),  // 添加逗号
db.distribution.createIndex({ "parent_id": 1 }),  // 添加逗号

db.marketing_campaigns.createIndex({ "status": 1, "start_time": 1, "end_time": 1 }),  // 添加逗号
db.marketing_campaigns.createIndex({ "type": 1 }),  // 添加逗号

db.points_rewards.createIndex({ "user_id": 1, "created_at": -1 }),  // 添加逗号
db.points_rewards.createIndex({ "type": 1, "status": 1 }),  // 添加逗号

// 添加TTL索引
db.marketing_campaigns.createIndex(
  { "end_time": 1 },
  { expireAfterSeconds: 7776000 } // 90天后过期
),  // 添加逗号

// 添加分片配置
sh.shardCollection("health_management_dev.orders", {
  "user_id": "hashed"
}),  // 添加逗号

sh.shardCollection("health_management_dev.payments", {
  "user_id": "hashed"
}),  // 添加逗号

// 1. 购物车集合
db.createCollection('shopping_carts', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "items", "updated_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        items: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["product_id", "quantity", "selected"],
            properties: {
              product_id: { bsonType: "objectId" },
              quantity: { bsonType: "number" },
              selected: { bsonType: "bool" },
              price_snapshot: { bsonType: "number" },
              product_snapshot: { bsonType: "object" }
            }
          }
        },
        total_amount: { bsonType: "number" },
        updated_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 2. 优惠券集合
db.createCollection('coupons', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["code", "type", "value", "status", "valid_period"],
      properties: {
        code: { bsonType: "string" },
        type: {
          enum: ["percentage", "fixed_amount", "free_shipping"],
          description: "优惠券类型"
        },
        value: { bsonType: "number" },
        min_purchase: { bsonType: "number" },
        usage_limit: { bsonType: "number" },
        used_count: { bsonType: "number" },
        product_restrictions: {
          bsonType: "array",
          items: { bsonType: "objectId" }
        },
        category_restrictions: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        valid_period: {
          bsonType: "object",
          required: ["start_date", "end_date"],
          properties: {
            start_date: { bsonType: "date" },
            end_date: { bsonType: "date" }
          }
        },
        status: {
          enum: ["active", "expired", "depleted"],
          description: "优惠券状态"
        }
      }
    }
  }
}),  // 添加逗号

// 3. 用户优惠券关联集合
db.createCollection('user_coupons', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "coupon_id", "status", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        coupon_id: { bsonType: "objectId" },
        status: {
          enum: ["unused", "used", "expired"],
          description: "使用状态"
        },
        used_time: { bsonType: "date" },
        order_id: { bsonType: "objectId" },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 4. 商品评价集合
db.createCollection('product_reviews', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "product_id", "order_id", "rating", "content", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        product_id: { bsonType: "objectId" },
        order_id: { bsonType: "objectId" },
        rating: { bsonType: "number" },
        content: { bsonType: "string" },
        images: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        tags: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        likes_count: { bsonType: "number" },
        reply: {
          bsonType: "object",
          properties: {
            content: { bsonType: "string" },
            reply_time: { bsonType: "date" }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 5. 商品分类集合
db.createCollection('product_categories', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "status", "created_at"],
      properties: {
        name: { bsonType: "string" },
        parent_id: { bsonType: "objectId" },
        level: { bsonType: "number" },
        sort_order: { bsonType: "number" },
        icon: { bsonType: "string" },
        description: { bsonType: "string" },
        status: {
          enum: ["active", "inactive"],
          description: "分类状态"
        },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
}),  // 添加逗号

// 创建相关索引
db.shopping_carts.createIndex({ "user_id": 1 }, { unique: true }),  // 添加逗号
db.shopping_carts.createIndex({ "updated_at": 1 }),  // 添加逗号

db.coupons.createIndex({ "code": 1 }, { unique: true }),  // 添加逗号
db.coupons.createIndex({ "status": 1, "valid_period.end_date": 1 }),  // 添加逗号

db.user_coupons.createIndex({ "user_id": 1, "status": 1 }),  // 添加逗号
db.user_coupons.createIndex({ "coupon_id": 1 }),  // 添加逗号

db.product_reviews.createIndex({ "product_id": 1, "created_at": -1 }),  // 添加逗号
db.product_reviews.createIndex({ "user_id": 1, "created_at": -1 }),  // 添加逗号
db.product_reviews.createIndex({ "order_id": 1 }),  // 添加逗号

db.product_categories.createIndex({ "parent_id": 1, "sort_order": 1 }),  // 添加逗号
db.product_categories.createIndex({ "level": 1, "status": 1 }),  // 添加逗号

// 添加TTL索引
db.shopping_carts.createIndex(
  { "updated_at": 1 },
  { expireAfterSeconds: 604800 }  // 7天后过期
),  // 添加逗号

// 更新现有集合的字段
db.products.updateMany({}, {
  $set: {
    "category_id": null,
    "sales_count": 0,
    "review_score": 0,
    "review_count": 0
  }
}),  // 添加逗号

db.orders.updateMany({}, {
  $set: {
    "coupon_info": {},
    "review_status": "pending"
  }
}),  // 添加逗号

// 1. 家庭健康管理集合
db.createCollection('family_groups', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "creator_id", "members", "created_at"],
      properties: {
        name: { bsonType: "string" },
        creator_id: { bsonType: "objectId" },
        description: { bsonType: "string" },
        members: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["user_id", "role", "join_time"],
            properties: {
              user_id: { bsonType: "objectId" },
              role: {
                enum: ["admin", "guardian", "member"],
                description: "成员角色"
              },
              nickname: { bsonType: "string" },
              relationship: { bsonType: "string" },
              join_time: { bsonType: "date" }
            }
          }
        },
        settings: {
          bsonType: "object",
          properties: {
            data_sharing: {
              bsonType: "object",
              properties: {
                vital_signs: { bsonType: "bool" },
                medication: { bsonType: "bool" },
                exercise: { bsonType: "bool" },
                diet: { bsonType: "bool" }
              }
            },
            notification_rules: { bsonType: "array" }
          }
        },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
}),

// 2. 健康目标与成就集合
db.createCollection('health_goals', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "type", "target", "period", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        type: {
          enum: ["steps", "exercise_duration", "weight_control", "sleep_quality", "diet_control"],
          description: "目标类型"
        },
        target: {
          bsonType: "object",
          properties: {
            value: { bsonType: "number" },
            unit: { bsonType: "string" }
          }
        },
        period: {
          bsonType: "object",
          properties: {
            start_date: { bsonType: "date" },
            end_date: { bsonType: "date" },
            frequency: { bsonType: "string" }
          }
        },
        progress: {
          bsonType: "object",
          properties: {
            current_value: { bsonType: "number" },
            completion_rate: { bsonType: "number" },
            last_updated: { bsonType: "date" }
          }
        },
        status: {
          enum: ["active", "completed", "failed", "abandoned"],
          description: "目标状态"
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),

// 3. 成就系统集合
db.createCollection('achievements', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "type", "level", "unlocked_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        type: {
          enum: ["continuous_tracking", "goal_completion", "healthy_lifestyle", "social_interaction"],
          description: "成就类型"
        },
        level: { bsonType: "number" },
        progress: {
          bsonType: "object",
          properties: {
            current: { bsonType: "number" },
            required: { bsonType: "number" }
          }
        },
        rewards: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              type: { bsonType: "string" },
              value: { bsonType: "number" }
            }
          }
        },
        unlocked_at: { bsonType: "date" }
      }
    }
  }
}),

// 4. 系统设置集合
db.createCollection('user_preferences', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        notification_settings: {
          bsonType: "object",
          properties: {
            health_reminders: { bsonType: "bool" },
            achievement_alerts: { bsonType: "bool" },
            social_updates: { bsonType: "bool" },
            reminder_time: {
              bsonType: "object",
              properties: {
                medication: { bsonType: "array" },
                exercise: { bsonType: "array" },
                measurement: { bsonType: "array" }
              }
            }
          }
        },
        privacy_settings: {
          bsonType: "object",
          properties: {
            data_sharing: { bsonType: "string" },
            profile_visibility: { bsonType: "string" },
            activity_sharing: { bsonType: "string" }
          }
        },
        theme_settings: {
          bsonType: "object",
          properties: {
            theme_mode: { bsonType: "string" },
            font_size: { bsonType: "string" },
            color_scheme: { bsonType: "string" }
          }
        },
        language_preference: { bsonType: "string" },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
}),

// 5. 健康工具集合
db.createCollection('health_tools', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "type", "status", "created_at"],
      properties: {
        name: { bsonType: "string" },
        type: {
          enum: ["calculator", "converter", "tracker", "analyzer"],
          description: "工具类型"
        },
        description: { bsonType: "string" },
        configuration: {
          bsonType: "object",
          properties: {
            input_fields: { bsonType: "array" },
            calculation_rules: { bsonType: "object" },
            output_format: { bsonType: "object" }
          }
        },
        usage_stats: {
          bsonType: "object",
          properties: {
            total_uses: { bsonType: "number" },
            last_used: { bsonType: "date" },
            average_rating: { bsonType: "number" }
          }
        },
        status: {
          enum: ["active", "maintenance", "deprecated"],
          description: "工具状态"
        },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
}),

// 创建相关索引
db.family_groups.createIndex({ "creator_id": 1 }),
db.family_groups.createIndex({ "members.user_id": 1 }),

db.health_goals.createIndex({ "user_id": 1, "type": 1 }),
db.health_goals.createIndex({ "status": 1, "period.end_date": 1 }),

db.achievements.createIndex({ "user_id": 1, "type": 1 }),
db.achievements.createIndex({ "unlocked_at": -1 }),

db.user_preferences.createIndex({ "user_id": 1 }, { unique: true }),

db.health_tools.createIndex({ "type": 1, "status": 1 }),
db.health_tools.createIndex({ "usage_stats.total_uses": -1 }),

// 添加关联更新
db.users.updateMany({}, {
  $set: {
    "achievement_stats": {
      total_achievements: 0,
      current_streak: 0,
      highest_streak: 0
    },
    "tool_preferences": []
  }
});

// 1. 用户行为分��集合
db.createCollection('user_behavior_analytics', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "event_type", "timestamp"],
      properties: {
        user_id: { bsonType: "objectId" },
        event_type: {
          enum: ["app_launch", "feature_usage", "goal_interaction", "tool_usage", "social_interaction"],
          description: "行为类型"
        },
        context: {
          bsonType: "object",
          properties: {
            session_id: { bsonType: "string" },
            platform: { bsonType: "string" },
            device_info: { bsonType: "object" },
            location: { bsonType: "object" }
          }
        },
        event_details: {
          bsonType: "object",
          properties: {
            feature_id: { bsonType: "string" },
            action: { bsonType: "string" },
            duration: { bsonType: "number" },
            result: { bsonType: "string" }
          }
        },
        timestamp: { bsonType: "date" }
      }
    }
  }
}),

// 2. 健康趋势分析集合
db.createCollection('health_trends', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "analysis_type", "period", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        analysis_type: {
          enum: ["vital_signs", "exercise_patterns", "sleep_quality", "nutrition_habits", "mental_health"],
          description: "分析类型"
        },
        period: {
          bsonType: "object",
          properties: {
            start_date: { bsonType: "date" },
            end_date: { bsonType: "date" },
            interval: { bsonType: "string" }
          }
        },
        metrics: {
          bsonType: "object",
          properties: {
            average_values: { bsonType: "object" },
            trends: { bsonType: "array" },
            anomalies: { bsonType: "array" },
            correlations: { bsonType: "array" }
          }
        },
        insights: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              type: { bsonType: "string" },
              description: { bsonType: "string" },
              confidence: { bsonType: "number" },
              recommendations: { bsonType: "array" }
            }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),

// 3. 健康预测模型集合
db.createCollection('health_predictions', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "prediction_type", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        prediction_type: {
          enum: ["health_risk", "goal_achievement", "behavior_change"],
          description: "预测类型"
        },
        model_inputs: {
          bsonType: "object",
          properties: {
            historical_data: { bsonType: "array" },
            user_characteristics: { bsonType: "object" },
            environmental_factors: { bsonType: "object" }
          }
        },
        predictions: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              outcome: { bsonType: "string" },
              probability: { bsonType: "number" },
              confidence_interval: { bsonType: "object" },
              contributing_factors: { bsonType: "array" }
            }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
}),

// 创建相关索引
db.user_behavior_analytics.createIndex({ "user_id": 1, "timestamp": -1 }),
db.user_behavior_analytics.createIndex({ "event_type": 1, "timestamp": -1 }),
db.user_behavior_analytics.createIndex({
  "context.session_id": 1,
  "timestamp": 1
}),

db.health_trends.createIndex({
  "user_id": 1,
  "analysis_type": 1,
  "period.start_date": -1
}),
db.health_trends.createIndex({
  "metrics.anomalies": 1
}, {
  sparse: true
}),

db.health_predictions.createIndex({
  "user_id": 1,
  "prediction_type": 1,
  "created_at": -1
}),

// 添加TTL索引用于数据清理
db.user_behavior_analytics.createIndex(
  { "timestamp": 1 },
  { expireAfterSeconds: 7776000 }  // 90天后过期
),

// 更新用户集合以支持分析
db.users.updateMany({}, {
  $set: {
    "analytics_preferences": {
      "data_collection_consent": true,
      "analysis_frequency": "daily",
      "notification_preferences": {
        "insights": true,
        "predictions": true,
        "recommendations": true
      }
    }
  }
});

// 用户集合索引
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "phone": 1 }, { sparse: true });
db.users.createIndex({ "createdAt": -1 });
db.users.createIndex({ "lastLoginAt": -1 });

// 健康数据索引
db.health_records.createIndex({ "userId": 1, "type": 1, "timestamp": -1 });
db.health_records.createIndex({ "userId": 1, "timestamp": -1 });
db.health_records.createIndex({
  "userId": 1,
  "type": 1,
  "timestamp": -1,
  "metrics.value": 1
}, {
  partialFilterExpression: {
    "type": { $in: ["heart_rate", "blood_pressure", "blood_sugar"] }
  }
});

// 运动数据索引
db.exercise_records.createIndex({ "userId": 1, "timestamp": -1 });
db.exercise_records.createIndex({
  "userId": 1,
  "type": 1,
  "timestamp": -1
});
db.exercise_records.createIndex({
  "location": "2dsphere"
}, {
  sparse: true
});

// 饮食数据索引
db.diet_records.createIndex({ "userId": 1, "timestamp": -1 });
db.diet_records.createIndex({
  "userId": 1,
  "category": 1,
  "timestamp": -1
});
db.diet_records.createIndex({
  "nutrients.type": 1,
  "nutrients.value": 1
}, {
  sparse: true
});

// 睡眠数据索引
db.sleep_records.createIndex({ "userId": 1, "timestamp": -1 });
db.sleep_records.createIndex({
  "userId": 1,
  "quality": 1,
  "timestamp": -1
});

// 中医体质数据索引
db.tcm_records.createIndex({ "userId": 1, "timestamp": -1 });
db.tcm_records.createIndex({
  "userId": 1,
  "constitution": 1,
  "timestamp": -1
});

// 社区内容索引
db.contents.createIndex({ "authorId": 1, "createdAt": -1 });
db.contents.createIndex({ "type": 1, "status": 1, "createdAt": -1 });
db.contents.createIndex({ "tags": 1, "status": 1, "createdAt": -1 });
db.contents.createIndex({
  "title": "text",
  "content": "text",
  "tags": "text"
}, {
  weights: {
    title: 10,
    content: 5,
    tags: 3
  },
  default_language: "chinese"
});

// 评论索引
db.comments.createIndex({ "contentId": 1, "createdAt": -1 });
db.comments.createIndex({ "authorId": 1, "createdAt": -1 });
db.comments.createIndex({ "parentId": 1, "createdAt": -1 });

// 支付记录索引
db.payment_transactions.createIndex({ "userId": 1, "createdAt": -1 });
db.payment_transactions.createIndex({ "status": 1, "createdAt": -1 });
db.payment_transactions.createIndex({
  "orderId": 1
}, {
  unique: true,
  sparse: true
});

// 钱包记录索引
db.wallet_records.createIndex({ "userId": 1, "timestamp": -1 });
db.wallet_records.createIndex({ "type": 1, "timestamp": -1 });
db.wallet_records.createIndex({
  "transactionId": 1
}, {
  unique: true,
  sparse: true
});

// 通知索引
db.notifications.createIndex({ "userId": 1, "createdAt": -1 });
db.notifications.createIndex({ "type": 1, "status": 1, "createdAt": -1 });
db.notifications.createIndex({ "priority": -1, "createdAt": -1 });

// 系统日志索引
db.system_logs.createIndex({ "timestamp": -1 });
db.system_logs.createIndex({ "level": 1, "timestamp": -1 });
db.system_logs.createIndex({ "service": 1, "timestamp": -1 });

// 性能监控索引
db.performance_metrics.createIndex({ "timestamp": -1 });
db.performance_metrics.createIndex({ "type": 1, "timestamp": -1 });
db.performance_metrics.createIndex({
  "service": 1,
  "type": 1,
  "timestamp": -1
});

// 用户会话索引
db.sessions.createIndex({ "userId": 1, "createdAt": -1 });
db.sessions.createIndex({ "token": 1 }, { unique: true });
db.sessions.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

// 数据统计视图
db.createView(
  "user_activity_stats",
  "users",
  [
    {
      $lookup: {
        from: "health_records",
        localField: "_id",
        foreignField: "userId",
        as: "healthRecords"
      }
    },
    {
      $lookup: {
        from: "exercise_records",
        localField: "_id",
        foreignField: "userId",
        as: "exerciseRecords"
      }
    },
    {
      $project: {
        _id: 1,
        username: 1,
        healthRecordCount: { $size: "$healthRecords" },
        exerciseRecordCount: { $size: "$exerciseRecords" },
        lastHealthRecord: { $max: "$healthRecords.timestamp" },
        lastExerciseRecord: { $max: "$exerciseRecords.timestamp" }
      }
    }
  ]
);

// 健康趋势视图
db.createView(
  "health_trends",
  "health_records",
  [
    {
      $match: {
        type: { $in: ["heart_rate", "blood_pressure", "blood_sugar"] }
      }
    },
    {
      $group: {
        _id: {
          userId: "$userId",
          type: "$type",
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$timestamp"
            }
          }
        },
        avgValue: { $avg: "$metrics.value" },
        minValue: { $min: "$metrics.value" },
        maxValue: { $max: "$metrics.value" },
        count: { $sum: 1 }
      }
    },
    {
      $sort: {
        "_id.userId": 1,
        "_id.type": 1,
        "_id.date": -1
      }
    }
  ]
);

// 运动统计视图
db.createView(
  "exercise_stats",
  "exercise_records",
  [
    {
      $group: {
        _id: {
          userId: "$userId",
          type: "$type",
          year: { $year: "$timestamp" },
          month: { $month: "$timestamp" }
        },
        totalDuration: { $sum: "$duration" },
        totalCalories: { $sum: "$calories" },
        avgIntensity: { $avg: "$intensity" },
        count: { $sum: 1 }
      }
    },
    {
      $sort: {
        "_id.userId": 1,
        "_id.year": -1,
        "_id.month": -1
      }
    }
  ]
);

// 内容热度视图
db.createView(
  "content_popularity",
  "contents",
  [
    {
      $match: {
        status: "published"
      }
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "contentId",
        as: "comments"
      }
    },
    {
      $project: {
        _id: 1,
        title: 1,
        type: 1,
        authorId: 1,
        createdAt: 1,
        commentCount: { $size: "$comments" },
        likeCount: "$stats.likes",
        shareCount: "$stats.shares",
        score: {
          $add: [
            { $multiply: [{ $size: "$comments" }, 2] },
            "$stats.likes",
            { $multiply: ["$stats.shares", 3] }
          ]
        }
      }
    },
    {
      $sort: {
        score: -1
      }
    }
  ]
);
