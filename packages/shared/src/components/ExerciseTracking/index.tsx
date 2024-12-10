import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../Card';
import { Loading } from '../Loading';
import {
  ExerciseType,
  ExerciseData,
  exerciseService
} from '../../services/exercise';
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  RefreshIcon,
  FlagIcon
} from '@heroicons/react/outline';

interface Props {
  /** 运动类型 */
  exerciseType: ExerciseType;
  /** 运动数据回调 */
  onDataUpdate?: (data: ExerciseData) => void;
  /** 运动结束回调 */
  onComplete?: (data: ExerciseData) => void;
  /** 错误回调 */
  onError?: (error: Error) => void;
}

/** 运动状态 */
type TrackingStatus = 'notStarted' | 'inProgress' | 'paused' | 'completed';

/** 运动数据采集组件 */
export const ExerciseTrackingComponent: React.FC<Props> = ({
  exerciseType,
  onDataUpdate,
  onComplete,
  onError
}) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<TrackingStatus>('notStarted');
  const [exerciseData, setExerciseData] = useState<ExerciseData>();
  const [error, setError] = useState<string>();
  const [startTime, setStartTime] = useState<Date>();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);

  /** 更新运动时间 */
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'inProgress' && startTime) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [status, startTime]);

  /** 开始运动 */
  const handleStart = async () => {
    try {
      setStatus('inProgress');
      setStartTime(new Date());
      setElapsedTime(0);
      setLaps([]);
      setError(undefined);

      // 开始采集数据
      const deviceData = await startDataCollection();
      const data = await exerciseService.collectExerciseData(exerciseType, deviceData);
      setExerciseData(data);
      onDataUpdate?.(data);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError?.(error);
    }
  };

  /** 暂停运动 */
  const handlePause = () => {
    setStatus('paused');
  };

  /** 继续运动 */
  const handleResume = () => {
    setStatus('inProgress');
  };

  /** 结束运动 */
  const handleStop = async () => {
    try {
      setStatus('completed');
      
      // 停止数据采集
      const deviceData = await stopDataCollection();
      if (exerciseData) {
        const finalData = {
          ...exerciseData,
          endTime: new Date(),
          duration: Math.floor(elapsedTime / 60) // 转换为分钟
        };
        setExerciseData(finalData);
        onComplete?.(finalData);
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError?.(error);
    }
  };

  /** 计圈 */
  const handleLap = () => {
    setLaps(prev => [...prev, elapsedTime]);
  };

  /** 重置 */
  const handleReset = () => {
    setStatus('notStarted');
    setExerciseData(undefined);
    setError(undefined);
    setStartTime(undefined);
    setElapsedTime(0);
    setLaps([]);
  };

  /** 开始数据采集 */
  const startDataCollection = async (): Promise<any> => {
    // 这里需要实现与设备的通信逻辑
    return {};
  };

  /** 停止数据采集 */
  const stopDataCollection = async (): Promise<any> => {
    // 这里需要实现与设备的通信逻辑
    return {};
  };

  /** 格式化时间 */
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /** 格式化配速 */
  const formatPace = (pace: number): string => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}'${seconds.toString().padStart(2, '0')}"`;
  };

  return (
    <Card className="p-6">
      {/* 错误提示 */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-lg">
          {error}
        </div>
      )}

      {/* 运动类型 */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">
          {t(`exercise.types.${exerciseType}`)}
        </h3>
        <div className="text-sm text-gray-500">
          {t('exercise.tips.beforeExercise')}
        </div>
      </div>

      {/* 计时器 */}
      <div className="mb-8 text-center">
        <div className="text-4xl font-bold font-mono">
          {formatTime(elapsedTime)}
        </div>
      </div>

      {/* 实时数据 */}
      {exerciseData && (
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* 心率 */}
            {exerciseData.heartRate && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">
                  {t('exercise.metrics.heartRate')}
                </div>
                <div className="text-2xl font-bold">
                  {exerciseData.heartRate.average}
                  <span className="text-sm font-normal ml-1">
                    {t('exercise.units.bpm')}
                  </span>
                </div>
              </div>
            )}

            {/* 配速 */}
            {exerciseData.pace && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">
                  {t('exercise.metrics.pace')}
                </div>
                <div className="text-2xl font-bold">
                  {formatPace(exerciseData.pace.average)}
                  <span className="text-sm font-normal ml-1">
                    {t('exercise.units.minKm')}
                  </span>
                </div>
              </div>
            )}

            {/* 距离 */}
            {exerciseData.distance && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">
                  {t('exercise.metrics.distance')}
                </div>
                <div className="text-2xl font-bold">
                  {(exerciseData.distance / 1000).toFixed(2)}
                  <span className="text-sm font-normal ml-1">
                    {t('exercise.units.kilometers')}
                  </span>
                </div>
              </div>
            )}

            {/* 卡路里 */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">
                {t('exercise.metrics.caloriesBurned')}
              </div>
              <div className="text-2xl font-bold">
                {exerciseData.caloriesBurned}
                <span className="text-sm font-normal ml-1">
                  {t('exercise.units.kcal')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 计圈记录 */}
      {laps.length > 0 && (
        <div className="mb-8">
          <h4 className="text-sm font-medium text-gray-500 mb-2">
            {t('exercise.tracking.lap')}
          </h4>
          <div className="space-y-2">
            {laps.map((lapTime, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div>Lap {index + 1}</div>
                <div className="font-mono">{formatTime(lapTime)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 控制按钮 */}
      <div className="flex justify-center gap-4">
        {status === 'notStarted' && (
          <button
            className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors flex items-center"
            onClick={handleStart}
          >
            <PlayIcon className="w-5 h-5 mr-2" />
            {t('exercise.tracking.start')}
          </button>
        )}

        {status === 'inProgress' && (
          <>
            <button
              className="px-6 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors flex items-center"
              onClick={handlePause}
            >
              <PauseIcon className="w-5 h-5 mr-2" />
              {t('exercise.tracking.pause')}
            </button>
            <button
              className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors flex items-center"
              onClick={handleLap}
            >
              <FlagIcon className="w-5 h-5 mr-2" />
              {t('exercise.tracking.lap')}
            </button>
            <button
              className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center"
              onClick={handleStop}
            >
              <StopIcon className="w-5 h-5 mr-2" />
              {t('exercise.tracking.stop')}
            </button>
          </>
        )}

        {status === 'paused' && (
          <>
            <button
              className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors flex items-center"
              onClick={handleResume}
            >
              <PlayIcon className="w-5 h-5 mr-2" />
              {t('exercise.tracking.resume')}
            </button>
            <button
              className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center"
              onClick={handleStop}
            >
              <StopIcon className="w-5 h-5 mr-2" />
              {t('exercise.tracking.stop')}
            </button>
          </>
        )}

        {status === 'completed' && (
          <button
            className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors flex items-center"
            onClick={handleReset}
          >
            <RefreshIcon className="w-5 h-5 mr-2" />
            {t('exercise.tracking.reset')}
          </button>
        )}
      </div>

      {/* 运动提示 */}
      <div className="mt-6 text-sm text-gray-500 text-center">
        {status === 'notStarted' && t('exercise.tips.beforeExercise')}
        {status === 'inProgress' && t('exercise.tips.duringExercise')}
        {status === 'completed' && t('exercise.tips.afterExercise')}
      </div>
    </Card>
  );
};

export default ExerciseTrackingComponent; 