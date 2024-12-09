import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommunityService } from '../../services/social/community.service';
import { InteractionService } from '../../services/social/interaction.service';
import { ContentManagementService } from '../../services/social/content-management.service';
import { CommunityContent, CommunityMember } from '../../services/social/community.types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-community-feed',
  template: `
    <div class="community-feed" [class]="theme">
      <!-- 内容发布区 -->
      <section class="content-creation">
        <div class="create-post">
          <textarea 
            [(ngModel)]="newPostContent"
            placeholder="分享你的健康心得..."
            [maxLength]="2000"
          ></textarea>
          <div class="post-actions">
            <button (click)="attachMedia()">
              <i class="icon-media"></i>添加图片/视频
            </button>
            <button (click)="addTopic()">
              <i class="icon-topic"></i>添加话题
            </button>
            <button 
              class="publish"
              [disabled]="!canPublish"
              (click)="publishPost()"
            >发布</button>
          </div>
        </div>
      </section>

      <!-- 内容流 -->
      <section class="content-stream">
        <div class="filter-bar">
          <div class="sort-options">
            <button 
              *ngFor="let option of sortOptions"
              [class.active]="currentSort === option.value"
              (click)="setSort(option.value)"
            >
              {{ option.label }}
            </button>
          </div>
          <div class="filter-options">
            <button (click)="showFilters()">
              <i class="icon-filter"></i>筛选
            </button>
          </div>
        </div>

        <div class="content-list">
          <div *ngFor="let content of contentList"
               class="content-card"
               [class]="content.type">
            <div class="content-header">
              <div class="author-info">
                <img [src]="content.author.avatar" alt="avatar">
                <div class="author-meta">
                  <span class="author-name">{{ content.author.name }}</span>
                  <span class="post-time">{{ formatTime(content.createdAt) }}</span>
                </div>
              </div>
              <div class="content-actions">
                <button (click)="showContentMenu(content)">
                  <i class="icon-more"></i>
                </button>
              </div>
            </div>

            <div class="content-body">
              <h3 *ngIf="content.content.title">{{ content.content.title }}</h3>
              <p>{{ content.content.body }}</p>
              <div *ngIf="content.content.media?.length" class="media-grid">
                <div *ngFor="let media of content.content.media"
                     class="media-item"
                     [class]="media.type"
                     (click)="showMediaPreview(media)">
                  <img *ngIf="media.type === 'image'"
                       [src]="media.url"
                       [alt]="media.type">
                  <video *ngIf="media.type === 'video'"
                         [poster]="media.thumbnail">
                    <source [src]="media.url" type="video/mp4">
                  </video>
                </div>
              </div>
              <div class="content-tags">
                <span *ngFor="let tag of content.content.tags"
                      class="tag"
                      (click)="navigateToTag(tag)">
                  #{{ tag }}
                </span>
              </div>
            </div>

            <div class="content-footer">
              <div class="engagement-metrics">
                <button (click)="toggleLike(content)"
                        [class.liked]="isLiked(content)">
                  <i class="icon-like"></i>
                  <span>{{ content.engagement.likes }}</span>
                </button>
                <button (click)="showComments(content)">
                  <i class="icon-comment"></i>
                  <span>{{ content.engagement.comments }}</span>
                </button>
                <button (click)="shareContent(content)">
                  <i class="icon-share"></i>
                  <span>{{ content.engagement.shares }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="load-more" *ngIf="hasMoreContent">
          <button (click)="loadMoreContent()"
                  [disabled]="loadingMore">
            {{ loadingMore ? '加载中...' : '加载更多' }}
          </button>
        </div>
      </section>

      <!-- 实时互动区 -->
      <section class="real-time-interaction" *ngIf="showInteraction">
        <div class="active-users">
          <div *ngFor="let user of activeUsers" 
               class="user-avatar"
               [class.online]="user.online"
               [title]="user.name">
            <img [src]="user.avatar" [alt]="user.name">
          </div>
        </div>

        <div class="live-comments" *ngIf="selectedContent">
          <div class="comments-container">
            <div *ngFor="let comment of comments"
                 class="comment-item"
                 [class.new]="comment.isNew">
              <div class="comment-author">
                <img [src]="comment.author.avatar" [alt]="comment.author.name">
                <span>{{ comment.author.name }}</span>
              </div>
              <div class="comment-content">{{ comment.content }}</div>
              <div class="comment-actions">
                <button (click)="replyToComment(comment)">回复</button>
                <button (click)="likeComment(comment)">
                  <i class="icon-like"></i>
                  {{ comment.likes }}
                </button>
              </div>
            </div>
          </div>

          <div class="comment-input">
            <textarea 
              [(ngModel)]="newComment"
              placeholder="发表评论..."
              (keyup.enter)="submitComment()"
            ></textarea>
            <button (click)="submitComment()">发送</button>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./community-feed.component.scss']
})
export class CommunityFeedComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  theme: string;
  newPostContent = '';
  contentList: CommunityContent[] = [];
  activeUsers: CommunityMember[] = [];
  comments: any[] = [];
  selectedContent: CommunityContent | null = null;
  
  sortOptions = [
    { label: '最新', value: 'latest' },
    { label: '热门', value: 'trending' },
    { label: '推荐', value: 'recommended' }
  ];
  currentSort = 'latest';
  
  loading = false;
  loadingMore = false;
  hasMoreContent = true;
  showInteraction = false;
  
  constructor(
    private communityService: CommunityService,
    private interactionService: InteractionService,
    private contentService: ContentManagementService
  ) {}

  ngOnInit() {
    this.initializeRealTimeConnection();
    this.loadContent();
    this.subscribeToUpdates();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeRealTimeConnection() {
    // 实现实时连接初始化
  }

  private loadContent() {
    // 实现内容加载逻辑
  }

  private subscribeToUpdates() {
    // 实现更新订阅逻辑
  }

  // UI交互方法
  async publishPost() {
    // 实现发布逻辑
  }

  async toggleLike(content: CommunityContent) {
    // 实现点赞逻辑
  }

  async submitComment() {
    // 实现评论提交逻辑
  }

  // 辅助方法
  formatTime(date: Date): string {
    // 实现时间格式化逻辑
    return '';
  }

  isLiked(content: CommunityContent): boolean {
    // 实现点赞状态检查逻辑
    return false;
  }
} 