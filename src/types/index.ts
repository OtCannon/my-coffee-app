export interface Flavor {
  name: string;
  intensity: number; // 1-15 according to WCR standard
}

export interface SensoryScores {
  acidity: number;
  bitterness: number;
  body: number;
}

export interface CoffeeRecord {
  id: number;
  timestamp: string;
  date: string;
  store: string;
  coffeeName: string;
  beanOrigin: string;
  beanProcess: string;
  scores: SensoryScores;
  selectedFlavors: Flavor[];
  score: number; // Overall personal score 0-10
}

export interface AppState {
  records: CoffeeRecord[];
}
