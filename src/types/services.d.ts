declare namespace Services {
  interface TCMKnowledgeBaseService {
    getConstitutionInfo(type: string): Promise<any>;
    getSuggestions(type: string): Promise<string[]>;
  }

  interface HealthDataService {
    getUserHealthData(userId: string): Promise<any>;
    saveHealthData(userId: string, data: any): Promise<void>;
  }

  interface SeasonalService {
    getCurrentSeasonalFactors(): Promise<any>;
    getSeasonalFactors(season: string): Promise<any>;
  }
}

export = Services; 