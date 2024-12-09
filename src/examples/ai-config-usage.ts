// 检查AI功能是否可用
const canUse = await aiConfigService.canUseFeature(AIFeatureType.FOOD_RECOGNITION);
if (!canUse) {
  throw new Error('AI功能当前不可用或已达到使用限制');
}

// 使用AI功能并记录使用情况
const startTime = Date.now();
try {
  const result = await foodRecognitionService.recognize(image);
  const latency = Date.now() - startTime;
  
  await aiConfigService.recordUsage(
    AIFeatureType.FOOD_RECOGNITION,
    latency,
    true,
    0.1 // 成本
  );
  
  return result;
} catch (error) {
  const latency = Date.now() - startTime;
  await aiConfigService.recordUsage(
    AIFeatureType.FOOD_RECOGNITION,
    latency,
    false,
    0 // 失败不计费
  );
  throw error;
} 