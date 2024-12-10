import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: '评论内容' })
  @IsString()
  content: string;

  @ApiProperty({ description: '父评论ID' })
  @IsString()
  @IsOptional()
  parent_id?: string;

  @ApiProperty({ description: '提及的用户ID列表' })
  @IsString({ each: true })
  @IsOptional()
  mentions?: string[];
}

export class UpdateCommentDto {
  @ApiProperty({ description: '评论内容' })
  @IsString()
  content: string;

  @ApiProperty({ description: '提及的用户ID列表' })
  @IsString({ each: true })
  @IsOptional()
  mentions?: string[];
} 