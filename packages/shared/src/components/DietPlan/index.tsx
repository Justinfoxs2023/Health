import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../Card';
import { Loading } from '../Loading';
import { DietPlan } from '../../services/food';
import { foodService } from '../../services/food';

interface Props {
  /** 初始饮食计划 */
  initialPlan?: DietPlan;
  /** 加载状态 */
  loading?: boolean;
  /** 错误信息 */
  error?: string;
  /** 计划更新回调 */
  onPlanUpdate?: (plan: DietPlan) => void;
}

/** 饮食计划组件 */
export const DietPlanComponent: React.FC<Props> = ({
  initialPlan,
  loading,
  error,
  onPlanUpdate
}) => {
  const { t } = useTranslation();
  const [plan, setPlan] = useState<DietPlan | undefined>(initialPlan);
  const [preferences, setPreferences] = useState({
    goal: 'maintenance' as DietPlan['goal'],
    restrictions: [] as string[],
    currentWeight: undefined as number | undefined,
    targetWeight: undefined as number | undefined,
    activityLevel: 'moderate' as 'low' | 'moderate' | 'high'
  });

  /** 生成新计划 */
  const generatePlan = async () => {
    try {
      const newPlan = await foodService.generateDietPlan(preferences);
      setPlan(newPlan);
      onPlanUpdate?.(newPlan);
    } catch (error) {
      console.error('Failed to generate diet plan:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="text-red-500">{error}</div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {/* 计划设置 */}
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4">{t('dietPlan.preferences')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 目标选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('dietPlan.goal')}
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={preferences.goal}
              onChange={e => setPreferences(prev => ({
                ...prev,
                goal: e.target.value as DietPlan['goal']
              }))}
            >
              <option value="weight_loss">{t('dietPlan.goals.weightLoss')}</option>
              <option value="weight_gain">{t('dietPlan.goals.weightGain')}</option>
              <option value="maintenance">{t('dietPlan.goals.maintenance')}</option>
              <option value="muscle_gain">{t('dietPlan.goals.muscleGain')}</option>
              <option value="health">{t('dietPlan.goals.health')}</option>
            </select>
          </div>

          {/* 活动水平 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('dietPlan.activityLevel')}
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={preferences.activityLevel}
              onChange={e => setPreferences(prev => ({
                ...prev,
                activityLevel: e.target.value as 'low' | 'moderate' | 'high'
              }))}
            >
              <option value="low">{t('dietPlan.activity.low')}</option>
              <option value="moderate">{t('dietPlan.activity.moderate')}</option>
              <option value="high">{t('dietPlan.activity.high')}</option>
            </select>
          </div>

          {/* 当前体重 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('dietPlan.currentWeight')}
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={preferences.currentWeight || ''}
              onChange={e => setPreferences(prev => ({
                ...prev,
                currentWeight: e.target.value ? Number(e.target.value) : undefined
              }))}
              placeholder={t('dietPlan.weightPlaceholder')}
            />
          </div>

          {/* 目标体重 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('dietPlan.targetWeight')}
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={preferences.targetWeight || ''}
              onChange={e => setPreferences(prev => ({
                ...prev,
                targetWeight: e.target.value ? Number(e.target.value) : undefined
              }))}
              placeholder={t('dietPlan.weightPlaceholder')}
            />
          </div>
        </div>

        {/* 饮食限制 */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('dietPlan.restrictions')}
          </label>
          <div className="flex flex-wrap gap-2">
            {['dairy', 'gluten', 'nuts', 'seafood', 'eggs'].map(restriction => (
              <label
                key={restriction}
                className="inline-flex items-center px-3 py-2 border rounded-md cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={preferences.restrictions.includes(restriction)}
                  onChange={e => {
                    setPreferences(prev => ({
                      ...prev,
                      restrictions: e.target.checked
                        ? [...prev.restrictions, restriction]
                        : prev.restrictions.filter(r => r !== restriction)
                    }));
                  }}
                />
                {t(`dietPlan.restrictions.${restriction}`)}
              </label>
            ))}
          </div>
        </div>

        {/* 生成按钮 */}
        <button
          className="mt-6 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
          onClick={generatePlan}
        >
          {t('dietPlan.generate')}
        </button>
      </div>

      {/* 计划显示 */}
      {plan && (
        <div>
          {/* 计划概览 */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4">{plan.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">{t('dietPlan.dailyCalories')}</div>
                <div className="text-2xl font-bold">
                  {plan.dailyCalorieTarget} {t('nutrition.units.kcal')}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">{t('dietPlan.meals')}</div>
                <div className="text-2xl font-bold">{plan.meals.length}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">{t('dietPlan.goal')}</div>
                <div className="text-2xl font-bold">
                  {t(`dietPlan.goals.${plan.goal}`)}
                </div>
              </div>
            </div>
          </div>

          {/* 营养目标 */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4">{t('dietPlan.nutrientTargets')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plan.nutrientTargets.map((target, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="font-medium mb-2">
                    {t(`nutrition.nutrients.${target.type}`)}
                  </div>
                  <div className="text-2xl font-bold">
                    {target.min} - {target.max}
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      {target.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 餐次安排 */}
          <div>
            <h3 className="text-xl font-medium mb-4">{t('dietPlan.mealSchedule')}</h3>
            <div className="space-y-6">
              {plan.meals.map((meal, index) => (
                <div
                  key={index}
                  className="p-6 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium">
                        {t(`dietPlan.mealTypes.${meal.type}`)}
                      </div>
                      <div className="text-sm text-gray-500">{meal.time}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {meal.calories} {t('nutrition.units.kcal')}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {meal.foods.map((food, foodIndex) => (
                      <div
                        key={foodIndex}
                        className="flex items-center justify-between"
                      >
                        <div>{food.name}</div>
                        <div className="text-gray-500">
                          {food.amount} {food.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 食物推荐 */}
          {plan.recommendations && plan.recommendations.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-medium mb-4">
                {t('dietPlan.recommendations')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {plan.recommendations.map((food, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {food}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 饮食限制 */}
          {plan.restrictions && plan.restrictions.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-medium mb-4">
                {t('dietPlan.restrictions')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {plan.restrictions.map((restriction, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                  >
                    {t(`dietPlan.restrictions.${restriction}`)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default DietPlanComponent; 