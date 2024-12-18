import {
  ImageRecognitionResult,
  IRealTimeAnalysis,
  IMultiModalAnalysis,
} from '../../services/ai-service/types';
import { AIService } from '../../services/ai-service/ai.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Com
ponent({
  selector: 'app-ai-analysis',
  template: `
    <div class="ai-analysis">
      <!-- 实时分析区域 -->
      <section class="realtime-analysis">
        <h2>AI</h2>

        <!-- 视频捕获 -->
        <div class="video-capture">
          <video videoElement autoplay playsinline></video>
          <canvas canvasElement></canvas>

          <div class="pose-feedback" *ngIf="poseAnalysis">
            <div class="posestatus" class="poseAnalysisisCorrect  correct  incorrect">
              {{ poseAnalysiscurrentPose }}
            </div>
            <div class="corrections" *ngIf="poseAnalysis.corrections.length">
              <ul>
                <li ngFor="let correction of poseAnalysiscorrections">
                  {{ correction }}
                </li>
              </ul>
            </div>
            <div class="risklevel" class="poseAnalysisriskLevel">
               {{ getRiskLevelTextposeAnalysisriskLevel }}
            </div>
          </div>
        </div>

        <!-- 健康指标 -->
        <div class="health-metrics" *ngIf="healthMetrics">
          <div class="metric heart-rate">
            <span class="label"></span>
            <span class="value">{{ healthMetricsheartRate   }} BPM</span>
          </div>
          <div class="metric calories">
            <span class="label"></span>
            <span class="value">{{ healthMetricscaloriesBurned   }} </span>
          </div>
          <div class="metric intensity">
            <span class="label"></span>
            <span class="value" class="healthMetricsintensity">
              {{ getIntensityTexthealthMetricsintensity }}
            </span>
          </div>
        </div>
      </section>

      <!-- 食物识别区域 -->
      <section class="food-recognition">
        <h2></h2>
        <div class="image-upload">
          <input type="file" accept="image/*" (change)="onImageSelected($event)" #fileInput />
          <button click="fileInputclick"></button>
        </div>

        <div class="recognition-result" *ngIf="foodRecognition">
          <div class="food-info">
            <h3>{{ foodRecognitionfoodName }}</h3>
            <div class="confidence">
               {{ foodRecognitionconfidence  100toFixed1 }}
            </div>
          </div>

          <div class="nutrition-info">
            <h4></h4>
            <div class="nutrition-grid">
              <div class="nutrient">
                <span class="label"></span>
                <span class="value">{{ foodRecognitionnutritionInfocalories }}</span>
              </div>
              <div class="nutrient">
                <span class="label"></span>
                <span class="value">{{ foodRecognitionnutritionInfoprotein }}g</span>
              </div>
              <div class="nutrient">
                <span class="label"></span>
                <span class="value">{{ foodRecognitionnutritionInfocarbs }}g</span>
              </div>
              <div class="nutrient">
                <span class="label"></span>
                <span class="value">{{ foodRecognitionnutritionInfofat }}g</span>
              </div>
            </div>
          </div>

          <div class="suggestions">
            <h4></h4>
            <ul>
              <li ngFor="let suggestion of foodRecognitionsuggestions">
                {{ suggestion }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 情绪分析区域 -->
      <section class="emotion-analysis" *ngIf="emotionAnalysis">
        <h2></h2>
        <div class="emotion-info">
          <div class="primary-emotion">
            <span class="emotionlabel"></span>
            <span class="emotionvalue">{{ emotionAnalysisprimary }}</span>
            <div class="intensity-bar">
              <div class="fill" stylewidth="emotionAnalysisintensity  100"></div>
            </div>
          </div>

          <div class="related-emotions">
            <span class="label"></span>
            <div class="emotion-tags">
              <span ngFor="let emotion of emotionAnalysisrelated" class="emotiontag">
                {{ emotion }}
              </span>
            </div>
          </div>

          <div class="emotion-suggestions">
            <h4></h4>
            <ul>
              <li ngFor="let suggestion of emotionAnalysissuggestions">
                {{ suggestion }}
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./ai-analysis.component.scss'],
})
export class AIAnalysisComponent implements OnInit {
  @ViewChild() videoElement: ElementRef<HTMLVideoElement>;
  @ViewChild() canvasElement: ElementRef<HTMLCanvasElement>;

  poseAnalysis: IRealTimeAnalysis['poseAnalysis'];
  healthMetrics: IRealTimeAnalysis['healthMetrics'];
  foodRecognition: ImageRecognitionResult['foodRecognition'];
  emotionAnalysis: IMultiModalAnalysis['emotion'];

  private stream: MediaStream;
  private animationFrame: number;

  constructor(private aiService: AIService) {}

  async ngOnInit() {
    await this.initializeCamera();
    this.startAnalysis();
  }

  ngOnDestroy() {
    this.stopAnalysis();
    this.stopCamera();
  }

  private async initializeCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });
      this.videoElement.nativeElement.srcObject = this.stream;
    } catch (error) {
      console.error('Error in ai-analysis.component.ts:', 'Camera initialization failed:', error);
    }
  }

  private startAnalysis() {
    const analyze = async () => {
      if (this.videoElement.nativeElement.readyState === 4) {
        const context = this.canvasElement.nativeElement.getContext('2d');
        context.drawImage(this.videoElement.nativeElement, 0, 0);
        const imageData = context.getImageData(
          0,
          0,
          this.canvasElement.nativeElement.width,
          this.canvasElement.nativeElement.height,
        );

        // 执行实时分析
        const analysis = await this.aiService.analyzePoseRealTime(imageData);
        this.poseAnalysis = analysis;

        // 分析情绪
        const multiModal = await this.aiService.performMultiModalAnalysis({
          video: imageData,
        });
        this.emotionAnalysis = multiModal.emotion;
      }

      this.animationFrame = requestAnimationFrame(analyze);
    };

    analyze();
  }

  private stopAnalysis() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }

  async onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (file) {
      try {
        const imageData = await this.fileToImageData(file);
        this.foodRecognition = await this.aiService.recognizeFood(imageData);
      } catch (error) {
        console.error('Error in ai-analysis.component.ts:', 'Food recognition failed:', error);
      }
    }
  }

  private async fileToImageData(file: File): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          resolve(ctx.getImageData(0, 0, img.width, img.height));
        };
        img.onerror = reject;
        img.src = e.target.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  getRiskLevelText(level: 'low' | 'medium' | 'high'): string {
    const texts = {
      low: '低风险',
      medium: '中等风险',
      high: '高风险',
    };
    return texts[level];
  }

  getIntensityText(intensity: 'low' | 'medium' | 'high'): string {
    const texts = {
      low: '低强度',
      medium: '中等强度',
      high: '高强度',
    };
    return texts[intensity];
  }
}
