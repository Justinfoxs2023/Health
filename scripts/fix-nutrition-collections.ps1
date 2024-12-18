# 修复营养相关的数据集合

$collectionsFile = "packages/backend/database/mongodb/init/collections.js"
$content = Get-Content $collectionsFile -Raw

# 添加新的集合定义
$nutritionCollections = @"
// 食物数据库集合
db.createCollection('food_database', {
  validator: {
    `$jsonSchema: {
      bsonType: "object",
      required: ["name", "category", "nutrients", "created_at"],
      properties: {
        name: { bsonType: "string" },
        category: { bsonType: "string" },
        nutrients: {
          bsonType: "object",
          required: ["calories", "protein", "fat", "carbs"],
          properties: {
            calories: { bsonType: "number" },
            protein: { bsonType: "number" },
            fat: { bsonType: "number" },
            carbs: { bsonType: "number" },
            fiber: { bsonType: "number" },
            sugar: { bsonType: "number" },
            sodium: { bsonType: "number" },
            cholesterol: { bsonType: "number" },
            vitamins: { bsonType: "object" },
            minerals: { bsonType: "object" }
          }
        },
        serving_size: {
          bsonType: "object",
          required: ["amount", "unit"],
          properties: {
            amount: { bsonType: "number" },
            unit: { bsonType: "string" }
          }
        },
        glycemic_index: { bsonType: "number" },
        allergens: { bsonType: "array" },
        ingredients: { bsonType: "array" },
        source: { bsonType: "string" },
        verification_status: {
          enum: ["verified", "unverified", "pending"]
        },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});

// 用户饮食记录集合
db.createCollection('meal_records', {
  validator: {
    `$jsonSchema: {
      bsonType: "object",
      required: ["user_id", "meal_type", "food_items", "timestamp"],
      properties: {
        user_id: { bsonType: "objectId" },
        meal_type: {
          enum: ["breakfast", "lunch", "dinner", "snack"]
        },
        food_items: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["food_id", "quantity", "unit"],
            properties: {
              food_id: { bsonType: "objectId" },
              quantity: { bsonType: "number" },
              unit: { bsonType: "string" }
            }
          }
        },
        total_nutrients: {
          bsonType: "object",
          properties: {
            calories: { bsonType: "number" },
            protein: { bsonType: "number" },
            fat: { bsonType: "number" },
            carbs: { bsonType: "number" }
          }
        },
        timestamp: { bsonType: "date" },
        location: { bsonType: "string" },
        notes: { bsonType: "string" },
        mood: { bsonType: "string" },
        hunger_level: { bsonType: "number" }
      }
    }
  }
});

// 营养分析历史集合
db.createCollection('nutrition_analysis_history', {
  validator: {
    `$jsonSchema: {
      bsonType: "object",
      required: ["user_id", "period", "analysis_data", "created_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        period: {
          bsonType: "object",
          required: ["start", "end"],
          properties: {
            start: { bsonType: "date" },
            end: { bsonType: "date" }
          }
        },
        analysis_data: {
          bsonType: "object",
          properties: {
            average_daily_calories: { bsonType: "number" },
            macro_distribution: {
              bsonType: "object",
              properties: {
                protein: { bsonType: "number" },
                fat: { bsonType: "number" },
                carbs: { bsonType: "number" }
              }
            },
            nutrient_adequacy: {
              bsonType: "object",
              properties: {
                vitamins: { bsonType: "object" },
                minerals: { bsonType: "object" },
                fiber: { bsonType: "number" }
              }
            },
            meal_patterns: {
              bsonType: "object",
              properties: {
                meal_timing: { bsonType: "array" },
                portion_sizes: { bsonType: "object" },
                food_variety: { bsonType: "number" }
              }
            }
          }
        },
        recommendations: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              type: { bsonType: "string" },
              priority: {
                enum: ["high", "medium", "low"]
              },
              message: { bsonType: "string" },
              action_items: { bsonType: "array" }
            }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
});

// 餐厅菜品数据集合
db.createCollection('restaurant_dishes', {
  validator: {
    `$jsonSchema: {
      bsonType: "object",
      required: ["restaurant_id", "name", "nutrients", "created_at"],
      properties: {
        restaurant_id: { bsonType: "objectId" },
        name: { bsonType: "string" },
        description: { bsonType: "string" },
        category: { bsonType: "string" },
        nutrients: {
          bsonType: "object",
          required: ["calories", "protein", "fat", "carbs"],
          properties: {
            calories: { bsonType: "number" },
            protein: { bsonType: "number" },
            fat: { bsonType: "number" },
            carbs: { bsonType: "number" }
          }
        },
        ingredients: { bsonType: "array" },
        allergens: { bsonType: "array" },
        portion_size: {
          bsonType: "object",
          properties: {
            amount: { bsonType: "number" },
            unit: { bsonType: "string" }
          }
        },
        price: { bsonType: "number" },
        availability: { bsonType: "bool" },
        image_url: { bsonType: "string" },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});

// AI模型分析结果缓存集合
db.createCollection('food_recognition_cache', {
  validator: {
    `$jsonSchema: {
      bsonType: "object",
      required: ["image_hash", "results", "created_at"],
      properties: {
        image_hash: { bsonType: "string" },
        results: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              food_id: { bsonType: "objectId" },
              confidence: { bsonType: "number" },
              bounding_box: {
                bsonType: "object",
                properties: {
                  x: { bsonType: "number" },
                  y: { bsonType: "number" },
                  width: { bsonType: "number" },
                  height: { bsonType: "number" }
                }
              }
            }
          }
        },
        processing_time: { bsonType: "number" },
        model_version: { bsonType: "string" },
        created_at: { bsonType: "date" },
        expires_at: { bsonType: "date" }
      }
    }
  }
});

// 创建索引
db.food_database.createIndex({ name: "text", category: "text" });
db.food_database.createIndex({ "nutrients.calories": 1 });
db.food_database.createIndex({ verification_status: 1 });

db.meal_records.createIndex({ user_id: 1, timestamp: -1 });
db.meal_records.createIndex({ "food_items.food_id": 1 });

db.nutrition_analysis_history.createIndex({ user_id: 1, "period.start": -1 });
db.nutrition_analysis_history.createIndex({ "analysis_data.average_daily_calories": 1 });

db.restaurant_dishes.createIndex({ restaurant_id: 1 });
db.restaurant_dishes.createIndex({ name: "text", description: "text" });

db.food_recognition_cache.createIndex({ image_hash: 1 }, { unique: true });
db.food_recognition_cache.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });
"@

# 添加新的集合定义到文件末尾
Add-Content -Path $collectionsFile -Value "`n$nutritionCollections"

Write-Host "营养相关的数据集合已添加"
