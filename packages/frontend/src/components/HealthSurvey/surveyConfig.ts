export const surveyJson = {
  title: "健康生活方式评估问卷",
  description: "通过AI分析您的健康状况,为您提供个性化的健康建议",
  showProgressBar: "top",
  pages: [
    {
      name: "基础健康信息",
      elements: [
        // 基础信息部分
        {
          type: "panel",
          name: "basicInfo",
          title: "基本信息",
          elements: [
            {
              type: "text",
              name: "age",
              title: "年龄",
              isRequired: true,
              inputType: "number",
              validators: [
                {
                  type: "numeric",
                  minValue: 1,
                  maxValue: 120
                }
              ]
            },
            {
              type: "text",
              name: "height",
              title: "身高(cm)",
              isRequired: true,
              inputType: "number"
            },
            {
              type: "text",
              name: "weight", 
              title: "体重(kg)",
              isRequired: true,
              inputType: "number"
            }
          ]
        },
        // 健康状况部分
        {
          type: "panel",
          name: "healthStatus",
          title: "健康状况",
          elements: [
            {
              type: "checkbox",
              name: "chronicDiseases",
              title: "是否有以下慢性病史",
              choices: [
                "高血压",
                "糖尿病",
                "心脏病",
                "高血脂",
                "其他"
              ]
            },
            {
              type: "checkbox",
              name: "allergies",
              title: "是否有过敏史",
              choices: [
                "花粉",
                "食物",
                "药物",
                "其他"
              ]
            }
          ]
        }
      ]
    },
    {
      name: "生活习惯评估",
      elements: [
        // 作息时间
        {
          type: "panel",
          name: "sleepHabits",
          title: "作息习惯",
          elements: [
            {
              type: "matrix",
              name: "sleepSchedule",
              title: "请评估您的睡眠情况",
              columns: ["从不", "偶尔", "经常", "总是"],
              rows: [
                "按时作息",
                "容易入睡",
                "睡眠质量好",
                "醒后精神好"
              ]
            },
            {
              type: "text",
              name: "averageSleepHours",
              title: "平均每天睡眠时间(小时)",
              inputType: "number"
            }
          ]
        },
        // 饮食习惯
        {
          type: "panel",
          name: "dietHabits",
          title: "饮食习惯",
          elements: [
            {
              type: "matrix",
              name: "mealHabits",
              title: "用餐习惯评估",
              columns: ["从不", "偶尔", "经常", "总是"],
              rows: [
                "按时用餐",
                "食量适中",
                "细嚼慢咽",
                "注意营养均衡"
              ]
            },
            {
              type: "checkbox",
              name: "dietaryPreferences",
              title: "饮食偏好",
              choices: [
                "清淡饮食",
                "重口味",
                "素食为主",
                "荤素均衡",
                "其他"
              ]
            }
          ]
        }
      ]
    },
    {
      name: "运动健身习惯",
      elements: [
        {
          type: "panel",
          name: "exerciseHabits",
          title: "运动情况",
          elements: [
            {
              type: "radiogroup",
              name: "exerciseFrequency",
              title: "运动频率",
              choices: [
                "每天",
                "每周3-5次",
                "每周1-2次",
                "偶尔运动",
                "几乎不运动"
              ]
            },
            {
              type: "checkbox",
              name: "exerciseTypes",
              title: "常做的运动类型",
              choices: [
                "步行/跑步",
                "游泳",
                "球类运动",
                "力量训练",
                "瑜伽/舞蹈",
                "其他"
              ]
            },
            {
              type: "text",
              name: "exerciseDuration",
              title: "每次运动时长(分钟)",
              inputType: "number"
            }
          ]
        },
        {
          name: "运动健身详细评估",
          elements: [
            {
              type: "panel",
              name: "exercisePreferences",
              title: "运动偏好详细评估",
              elements: [
                {
                  type: "matrix",
                  name: "exerciseMotivation",
                  title: "运动动机评估",
                  columns: ["完全不符合", "不太符合", "一般", "比较符合", "非常符合"],
                  rows: [
                    "为了保持健康",
                    "为了减重/增重",
                    "为了缓解压力",
                    "为了提高体能",
                    "为了社交需求",
                    "为了培养兴趣爱好"
                  ]
                },
                {
                  type: "checkbox",
                  name: "preferredExerciseTime",
                  title: "偏好的运动时间段",
                  choices: [
                    "清晨(6:00-9:00)",
                    "上午(9:00-12:00)",
                    "午后(12:00-15:00)",
                    "下午(15:00-18:00)",
                    "傍晚(18:00-21:00)",
                    "夜间(21:00以后)"
                  ]
                },
                {
                  type: "radiogroup",
                  name: "exerciseEnvironment",
                  title: "偏好的运动环境",
                  choices: [
                    "室内健身房",
                    "户外场地",
                    "家庭环境",
                    "专业运动场所",
                    "社区活动中心"
                  ]
                },
                {
                  type: "matrix",
                  name: "exerciseIntensity",
                  title: "不同运动强度的接受程度",
                  columns: ["非常排斥", "有点排斥", "可以接受", "比较喜欢", "非常喜欢"],
                  rows: [
                    "低强度(如散步、瑜伽)",
                    "中等强度(如快走、游泳)",
                    "中高强度(如跑步、球类)",
                    "高强度(如HIIT、力量训练)"
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "健康目标设定",
      elements: [
        {
          type: "panel",
          name: "healthGoals",
          title: "健康目标",
          elements: [
            {
              type: "checkbox",
              name: "primaryGoals",
              title: "主要健康目标(可多选)",
              isRequired: true,
              choices: [
                "减重",
                "增肌",
                "改善体质",
                "预防疾病",
                "缓解压力",
                "提高睡眠质量"
              ]
            },
            {
              type: "comment",
              name: "specificGoals",
              title: "请描述您的具体目标"
            },
            {
              type: "rating",
              name: "commitment",
              title: "实现目标的决心程度",
              rateMin: 1,
              rateMax: 5,
              minRateDescription: "一般",
              maxRateDescription: "非常坚定"
            }
          ]
        }
      ]
    },
    {
      name: "心理健康评估",
      elements: [
        {
          type: "panel",
          name: "mentalHealth",
          title: "心理健康状况",
          elements: [
            {
              type: "matrix",
              name: "emotionalState",
              title: "过去一个月内的情绪状态",
              columns: ["从不", "偶尔", "经常", "总是"],
              rows: [
                "感到心情愉快",
                "容易感到焦虑",
                "睡眠质量良好",
                "对事物有兴趣",
                "感到压力大"
              ]
            },
            {
              type: "checkbox",
              name: "stressSource",
              title: "主要压力来源(可多选)",
              choices: [
                "工作压力",
                "家庭关系",
                "经济状况",
                "健康问题",
                "人际关系",
                "其他"
              ]
            },
            {
              type: "comment",
              name: "stressRelief",
              title: "您通常如何缓解压力?"
            }
          ]
        }
      ]
    },
    {
      name: "生活方式详细评估",
      elements: [
        {
          type: "panel",
          name: "workLifeBalance",
          title: "工作生活平衡",
          elements: [
            {
              type: "radiogroup",
              name: "workHours",
              title: "每天工作时长",
              choices: [
                "少于6小时",
                "6-8小时",
                "8-10小时",
                "10-12小时",
                "超过12小时"
              ]
            },
            {
              type: "matrix",
              name: "workStyle",
              title: "工作方式评估",
              columns: ["从不", "偶尔", "经常", "总是"],
              rows: [
                "久坐工作",
                "注意工间休息",
                "加班工作",
                "带工作回家"
              ]
            }
          ]
        },
        {
          type: "panel",
          name: "socialLife",
          title: "社交生活",
          elements: [
            {
              type: "radiogroup",
              name: "socialFrequency",
              title: "参与社交活动的频率",
              choices: [
                "每天都有",
                "每周几次",
                "每月几次",
                "很少参与",
                "基本不参与"
              ]
            },
            {
              type: "checkbox",
              name: "socialActivities",
              title: "常参与的社交活动类型",
              choices: [
                "朋友聚会",
                "家庭聚会",
                "兴趣小组活动",
                "志愿服务",
                "运动团体活动",
                "其他"
              ]
            }
          ]
        }
      ]
    },
    {
      name: "健康知识和意识",
      elements: [
        {
          type: "panel",
          name: "healthKnowledge",
          title: "健康知识评估",
          elements: [
            {
              type: "matrix",
              name: "healthAwareness",
              title: "健康意识评估",
              columns: ["完全不了解", "了解一点", "比较了解", "非常了解"],
              rows: [
                "营养知识",
                "运动科学",
                "疾病预防",
                "心理健康",
                "急救知识"
              ]
            },
            {
              type: "checkbox",
              name: "healthInfoSource",
              title: "获取健康信息的途径",
              choices: [
                "专业医生咨询",
                "健康类APP",
                "医疗健康网站",
                "专业书籍",
                "朋友推荐",
                "社交媒体"
              ]
            }
          ]
        }
      ]
    },
    {
      name: "AI个性化服务偏好",
      elements: [
        {
          type: "panel",
          name: "aiPreferences",
          title: "AI健康服务偏好设置",
          elements: [
            {
              type: "checkbox",
              name: "aiServiceTypes",
              title: "希望获得的AI健康服务(可多选)",
              choices: [
                "饮食建议",
                "运动计划",
                "心理健康建议",
                "睡眠改善建议",
                "工作压力管理",
                "社交活动推荐"
              ]
            },
            {
              type: "radiogroup",
              name: "reportFrequency",
              title: "期望收到健康报告的频率",
              choices: [
                "每天",
                "每周",
                "每月",
                "根据需要"
              ]
            },
            {
              type: "checkbox",
              name: "reminderSettings",
              title: "需要的提醒服务",
              choices: [
                "运动提醒",
                "作息提醒",
                "喝水提醒",
                "用药提醒",
                "体检提醒"
              ]
            }
          ]
        }
      ]
    },
    {
      name: "饮食习惯详细评估",
      elements: [
        {
          type: "panel",
          name: "dietaryPreferencesDetail",
          title: "饮食偏好详细评估",
          elements: [
            {
              type: "matrix",
              name: "mealTimingPreference",
              title: "用餐时间偏好",
              columns: ["从不", "偶尔", "经常", "总是"],
              rows: [
                "早餐(7:00-9:00)",
                "上午加餐(9:00-11:00)",
                "午餐(11:30-13:30)",
                "下午加餐(14:00-16:00)",
                "晚餐(17:30-19:30)",
                "夜宵(20:00以后)"
              ]
            },
            {
              type: "checkbox",
              name: "foodPreferences",
              title: "食物偏好(可多选)",
              choices: [
                "主食类(米饭、面食等)",
                "肉类(禽肉、红肉等)",
                "海鲜类",
                "蛋奶类",
                "豆制品",
                "新鲜蔬菜",
                "水果",
                "坚果类"
              ]
            },
            {
              type: "checkbox",
              name: "cookingMethods",
              title: "烹饪方式偏好",
              choices: [
                "清蒸",
                "煮汤",
                "炒菜",
                "烤制",
                "凉拌",
                "油炸",
                "炖煮",
                "其他"
              ]
            },
            {
              type: "matrix",
              name: "dietaryHabits",
              title: "饮食习惯评估",
              columns: ["从不", "偶尔", "经常", "总是"],
              rows: [
                "外出就餐",
                "自己烹饪",
                "叫外卖",
                "食用加工食品",
                "注意营养搭配",
                "控制饮食量"
              ]
            },
            {
              type: "checkbox",
              name: "dietaryConcerns",
              title: "饮食注意事项",
              choices: [
                "无特殊禁忌",
                "需要控制盐分",
                "需要控制糖分",
                "需要控制油脂",
                "乳糖不耐受",
                "过敏原注意",
                "宗教信仰限制",
                "其他"
              ]
            },
            {
              type: "comment",
              name: "specialDietaryNeeds",
              title: "特殊饮食需求说明"
            }
          ]
        },
        {
          type: "panel",
          name: "nutritionKnowledge",
          title: "营养知识评估",
          elements: [
            {
              type: "matrix",
              name: "nutritionAwareness",
              title: "营养认知水平",
              columns: ["完全不了解", "了解一点", "比较了解", "非常了解"],
              rows: [
                "基础营养素知识",
                "食物卡路里",
                "膳食均衡",
                "营养补充剂",
                "特殊人群饮食"
              ]
            },
            {
              type: "checkbox",
              name: "nutritionGoals",
              title: "营养目标(可多选)",
              choices: [
                "控制体重",
                "增加蛋白质摄入",
                "补充维生素矿物质",
                "改善肠道健康",
                "提高免疫力",
                "其他"
              ]
            }
          ]
        }
      ]
    }
  ],
  completedHtml: "<h4>感谢您完成问卷!</h4><p>我们的AI系统将基于您的回答,为您生成个性化的健康评估报告和改善建议。</p><p>您可以在个人中心查看AI分析结果。</p>"
}; 