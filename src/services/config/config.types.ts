import { IsString, IsDate, IsBoolean, IsNumber, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class SecurityConfig {
  @IsString()
  algorithm: string;

  @IsNumber()
  keySize: number;
}

export class AuditConfig {
  @IsBoolean()
  enabled: boolean;

  @IsNumber()
  retention: number;
}

export class MetricsConfig {
  @IsBoolean()
  enabled: boolean;

  @IsNumber()
  interval: number;
}

export class AlertsConfig {
  @IsBoolean()
  enabled: boolean;

  @ValidateNested()
  @Type() => Object)
  thresholds: Record<string, number>;
}

export class CacheConfig {
  @IsBoolean()
  enabled: boolean;

  @IsNumber()
  ttl: number;
}

export class BatchConfig {
  @IsNumber()
  size: number;

  @IsNumber()
  timeout: number;
}

export class ServiceConfig {
  @IsBoolean()
  enabled: boolean;

  @ValidateNested()
  @Type() => Object)
  settings: Record<string, any>;

  @IsOptional()
  @IsString()
  dependencies?: string[];
}

export class ConfigSchema {
  @IsString()
  version: string;

  @IsDate()
  @Type() => Date)
  lastModified: Date;

  @IsString()
  environment: string;

  @ValidateNested()
  @Type() => ServiceConfig)
  services: Record<string, ServiceConfig>;

  @ValidateNested()
  security: {
    @ValidateNested()
    @Type() => SecurityConfig)
    encryption: SecurityConfig;

    @ValidateNested()
    @Type() => AuditConfig)
    audit: AuditConfig;
  };

  @ValidateNested()
  monitoring: {
    @ValidateNested()
    @Type() => MetricsConfig)
    metrics: MetricsConfig;

    @ValidateNested()
    @Type() => AlertsConfig)
    alerts: AlertsConfig;
  };

  @ValidateNested()
  performance: {
    @ValidateNested()
    @Type() => CacheConfig)
    cache: CacheConfig;

    @ValidateNested()
    @Type() => BatchConfig)
    batch: BatchConfig;
  };
}

export class ConfigurationDto {
  @ValidateNested()
  @Type() => MetricsConfig)
  metrics!: MetricsConfig;

  @ValidateNested()
  @Type() => AlertsConfig)
  alerts!: AlertsConfig;

  @ValidateNested()
  @Type() => CacheConfig)
  cache!: CacheConfig;

  @ValidateNested()
  @Type() => BatchConfig)
  batch!: BatchConfig;
}
