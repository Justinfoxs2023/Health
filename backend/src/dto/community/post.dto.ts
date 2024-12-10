import { IsString, IsArray, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ description: '帖子标题' })
  @IsString()
  title: string;

  @ApiProperty({ description: '帖子内容' })
  @IsString()
  content: string;

  @ApiProperty({ description: '分类ID' })
  @IsString()
  category_id: string;

  @ApiProperty({ description: '标签列表' })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: '媒体文件列表' })
  @IsArray()
  @IsOptional()
  media?: Array<{
    type: 'image' | 'video' | 'document';
    url: string;
    thumbnail_url?: string;
  }>;

  @ApiProperty({ description: '可见性设置' })
  @IsEnum(['public', 'private', 'followers'])
  @IsOptional()
  visibility?: 'public' | 'private' | 'followers' = 'public';
}

export class UpdatePostDto {
  @ApiProperty({ description: '帖子标题' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: '帖子内容' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ description: '分类ID' })
  @IsString()
  @IsOptional()
  category_id?: string;

  @ApiProperty({ description: '标签列表' })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: '媒体文件列表' })
  @IsArray()
  @IsOptional()
  media?: Array<{
    type: 'image' | 'video' | 'document';
    url: string;
    thumbnail_url?: string;
  }>;

  @ApiProperty({ description: '可见性设置' })
  @IsEnum(['public', 'private', 'followers'])
  @IsOptional()
  visibility?: 'public' | 'private' | 'followers';

  @ApiProperty({ description: '帖子状态' })
  @IsEnum(['draft', 'published', 'archived'])
  @IsOptional()
  status?: 'draft' | 'published' | 'archived';
} 