import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../Card';
import { Loading } from '../Loading';
import {
  PostureAnalysis,
  PostureData,
  KeyPointType,
  postureService
} from '../../services/posture';
import {
  CameraIcon,
  RefreshIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/outline';

interface Props {
  /** 运动类型 */
  exerciseType: string;
  /** 分析结果回调 */
  onAnalysis?: (analysis: PostureAnalysis) => void;
  /** 错误回调 */
  onError?: (error: Error) => void;
}

/** 姿态分析组件 */
export const PostureAnalysisComponent: React.FC<Props> = ({
  exerciseType,
  onAnalysis,
  onError
}) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [analysis, setAnalysis] = useState<PostureAnalysis>();
  const [error, setError] = useState<string>();
  const [stream, setStream] = useState<MediaStream>();

  /** 初��化摄像头 */
  const initCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError?.(error);
    }
  };

  /** 停止摄像头 */
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(undefined);
    }
  };

  /** 清理资源 */
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  /** 开始分析 */
  const startAnalysis = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsRecording(true);
    setError(undefined);

    try {
      await initCamera();
      analyzeFrame();
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError?.(error);
      setIsRecording(false);
    }
  };

  /** 停止分析 */
  const stopAnalysis = () => {
    setIsRecording(false);
    stopCamera();
  };

  /** 分析视频帧 */
  const analyzeFrame = async () => {
    if (!videoRef.current || !canvasRef.current || !isRecording) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    // 绘制视频帧
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    try {
      // 获取图像数据
      const imageData = context.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      // 分析姿态
      const result = await postureService.analyzePosture(imageData, exerciseType);
      setAnalysis(result);
      onAnalysis?.(result);

      // 绘制关键点和骨架
      drawKeyPoints(context, result.data);
      drawSkeleton(context, result.data);

      // 继续分析下一帧
      if (isRecording) {
        requestAnimationFrame(analyzeFrame);
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError?.(error);
      setIsRecording(false);
    }
  };

  /** 绘制关键点 */
  const drawKeyPoints = (
    context: CanvasRenderingContext2D,
    data: PostureData
  ) => {
    context.fillStyle = '#00ff00';
    data.keyPoints.forEach(point => {
      if (point.confidence > 0.5) {
        context.beginPath();
        context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        context.fill();
      }
    });
  };

  /** ��制骨架 */
  const drawSkeleton = (
    context: CanvasRenderingContext2D,
    data: PostureData
  ) => {
    const pairs = [
      [KeyPointType.LEFT_SHOULDER, KeyPointType.RIGHT_SHOULDER],
      [KeyPointType.LEFT_SHOULDER, KeyPointType.LEFT_ELBOW],
      [KeyPointType.RIGHT_SHOULDER, KeyPointType.RIGHT_ELBOW],
      [KeyPointType.LEFT_ELBOW, KeyPointType.LEFT_WRIST],
      [KeyPointType.RIGHT_ELBOW, KeyPointType.RIGHT_WRIST],
      [KeyPointType.LEFT_SHOULDER, KeyPointType.LEFT_HIP],
      [KeyPointType.RIGHT_SHOULDER, KeyPointType.RIGHT_HIP],
      [KeyPointType.LEFT_HIP, KeyPointType.RIGHT_HIP],
      [KeyPointType.LEFT_HIP, KeyPointType.LEFT_KNEE],
      [KeyPointType.RIGHT_HIP, KeyPointType.RIGHT_KNEE],
      [KeyPointType.LEFT_KNEE, KeyPointType.LEFT_ANKLE],
      [KeyPointType.RIGHT_KNEE, KeyPointType.RIGHT_ANKLE]
    ];

    context.strokeStyle = '#00ff00';
    context.lineWidth = 2;

    pairs.forEach(([start, end]) => {
      const startPoint = data.keyPoints.find(p => p.type === start);
      const endPoint = data.keyPoints.find(p => p.type === end);

      if (
        startPoint &&
        endPoint &&
        startPoint.confidence > 0.5 &&
        endPoint.confidence > 0.5
      ) {
        context.beginPath();
        context.moveTo(startPoint.x, startPoint.y);
        context.lineTo(endPoint.x, endPoint.y);
        context.stroke();
      }
    });
  };

  /** 获取评分颜色 */
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="p-6">
      {/* 错误提示 */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 视频预览 */}
        <div>
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              width={640}
              height={480}
            />

            {/* 控制按钮 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              {!isRecording ? (
                <button
                  className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors flex items-center"
                  onClick={startAnalysis}
                >
                  <VideoCameraIcon className="w-5 h-5 mr-2" />
                  {t('posture.startAnalysis')}
                </button>
              ) : (
                <button
                  className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center"
                  onClick={stopAnalysis}
                >
                  <RefreshIcon className="w-5 h-5 mr-2" />
                  {t('posture.stopAnalysis')}
                </button>
              )}
            </div>
          </div>

          {/* 运动类型 */}
          <div className="mt-4 text-center">
            <div className="text-lg font-medium">
              {t(`exercise.types.${exerciseType}`)}
            </div>
            <div className="text-sm text-gray-500">
              {t('posture.followInstructions')}
            </div>
          </div>
        </div>

        {/* 分析结果 */}
        {analysis && (
          <div>
            {/* 评分 */}
            <div className="mb-6 text-center">
              <div className="text-4xl font-bold mb-2">
                <span className={getScoreColor(analysis.evaluation.score)}>
                  {analysis.evaluation.score}
                </span>
                <span className="text-sm font-normal text-gray-500 ml-2">
                  {t('posture.score')}
                </span>
              </div>
            </div>

            {/* 问题列表 */}
            {analysis.evaluation.issues.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  {t('posture.issues')}
                </h4>
                <div className="space-y-2">
                  {analysis.evaluation.issues.map((issue, index) => (
                    <div
                      key={index}
                      className="flex items-start p-2 bg-red-50 rounded"
                    >
                      <ExclamationCircleIcon className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
                      <div className="text-red-700">{issue}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 建议列表 */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                {t('posture.suggestions')}
              </h4>
              <div className="space-y-2">
                {analysis.evaluation.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start p-2 bg-green-50 rounded"
                  >
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <div className="text-green-700">{suggestion}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 关键点偏差 */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                {t('posture.deviations')}
              </h4>
              <div className="space-y-2">
                {analysis.deviations.map((deviation, index) => (
                  <div
                    key={index}
                    className="p-2 border border-gray-200 rounded"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium">
                        {t(`posture.keyPoints.${deviation.keyPoint}`)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('posture.deviation')}: {(deviation.deviation * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {deviation.suggestion}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PostureAnalysisComponent; 