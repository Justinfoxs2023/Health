/**
 * @fileoverview TS 文件 services.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare namespace Services {
  interface TCMKnowledgeBaseService {
    getConstitutionInfotype: string: Promiseany;
    getSuggestionstype: string: Promisestring;
  }

  interface HealthDataService {
    getUserHealthDatauserId: string: Promiseany;
    saveHealthDatauserId: string, data: any: Promisevoid;
  }

  interface SeasonalService {
    getCurrentSeasonalFactors: Promiseany;
    getSeasonalFactorsseason: string: Promiseany;
  }
}

export = Services;
