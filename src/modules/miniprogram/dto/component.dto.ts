import { IsString, IsOptional, IsObject, IsEnum } from 'class-validator';

export class CreateComponentDto {
  @IsString()
  name: string;

  @IsString()
  version: string;

  @IsObject()
  @IsOptional()
  config?: {
    props?: Record<string, any>;
    styles?: Record<string, any>;
    events?: string[];
    platform?: 'miniprogram' | 'web' | 'all';
    dependencies?: string[];
    permissions?: string[];
    cacheStrategy?: 'memory' | 'storage' | 'none';
  };

  @IsObject()
  @IsOptional()
  lifecycle?: {
    onLoad?: string;
    onShow?: string;
    onHide?: string;
    onUnload?: string;
  };
}

export class UpdateComponentDto {
  @IsString()
  @IsOptional()
  version?: string;

  @IsObject()
  @IsOptional()
  config?: Partial<CreateComponentDto['config']>;

  @IsObject()
  @IsOptional()
  lifecycle?: Partial<CreateComponentDto['lifecycle']>;

  @IsEnum()
  @IsOptional()
  status?: string;
}
