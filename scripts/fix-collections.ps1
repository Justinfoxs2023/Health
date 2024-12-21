# MongoDB集合定义修复脚本

$collectionsFile = "packages/backend/database/mongodb/init/collections.js"
$content = Get-Content $collectionsFile -Raw

# 1. 修复缺失的逗号
$content = $content -replace "}\s*\),\s*//\s*添加逗号", "}),`n"
$content = $content -replace "}\s*\),\s*$", "}),`n"

# 2. 修复视图创建语法
$content = $content -replace "db\.createView\((.*?)\),", "db.createView(`$1),"

# 3. 修复索引创建语法
$content = $content -replace "db\.[a-zA-Z_]+\.createIndex\((.*?)\),", "db.`$1.createIndex(`$2),"

# 4. 添加缺失的分号
$content = $content -replace "(?<!;)\s*$", ";"

# 5. 格式化文档
$content = $content -replace "\n\s*\n\s*\n", "`n`n"

# 保存修改后的文件
Set-Content -Path $collectionsFile -Value $content

Write-Host "MongoDB集合定义文件修复完成"

# 创建新的集合定义
$newCollections = @"
// 健康指标聚合集合
db.createCollection('health_metrics_aggregation', {
  validator: {
    `$jsonSchema: {
      bsonType: "object",
      required: ["user_id", "metric_type", "aggregation_period", "value"],
      properties: {
        user_id: { bsonType: "objectId" },
        metric_type: {
          enum: ["daily", "weekly", "monthly"]
        },
        aggregation_period: { bsonType: "date" },
        value: { bsonType: "object" },
        created_at: { bsonType: "date" }
      }
    }
  }
});

// 数据缓存集合
db.createCollection('data_cache', {
  validator: {
    `$jsonSchema: {
      bsonType: "object",
      required: ["key", "value", "expires_at"],
      properties: {
        key: { bsonType: "string" },
        value: { bsonType: "object" },
        expires_at: { bsonType: "date" },
        created_at: { bsonType: "date" }
      }
    }
  }
});

// 创建索引
db.health_metrics_aggregation.createIndex(
  { user_id: 1, metric_type: 1, aggregation_period: -1 }
);

db.data_cache.createIndex(
  { key: 1 },
  { unique: true }
);

db.data_cache.createIndex(
  { expires_at: 1 },
  { expireAfterSeconds: 0 }
);
"@

# 添加新的集合定义
Add-Content -Path $collectionsFile -Value "`n$newCollections"

Write-Host "新的集合定义添加完成"
