import { Injectable } from '@nestjs/common';

@Injectable()
export class ExchangeRateService {
  constructor(
    private readonly rateProviderService: RateProviderService,
    private readonly cacheService: CacheService
  ) {}

  // 获取实时汇率
  async getLiveExchangeRate(
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    const cacheKey = `${fromCurrency}_${toCurrency}`;
    
    // 检查缓存
    const cachedRate = await this.cacheService.get(cacheKey);
    if (cachedRate) return cachedRate;
    
    // 获取实时汇率
    const liveRate = await this.rateProviderService.getRate(
      fromCurrency,
      toCurrency
    );
    
    // 更新缓存
    await this.cacheService.set(cacheKey, liveRate, '5m');
    
    return liveRate;
  }

  // 批量转换货币
  async batchCurrencyConversion(
    conversions: CurrencyConversion[]
  ): Promise<ConversionResult[]> {
    const results = await Promise.all(
      conversions.map(async conversion => {
        const rate = await this.getLiveExchangeRate(
          conversion.from,
          conversion.to
        );
        
        return {
          ...conversion,
          rate,
          result: conversion.amount * rate
        };
      })
    );
    
    return results;
  }
} 