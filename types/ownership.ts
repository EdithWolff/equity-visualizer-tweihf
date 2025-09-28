
export interface Shareholder {
  id: string;
  name: string;
  email?: string;
  type: 'founder' | 'employee' | 'investor' | 'advisor';
  instruments: Instrument[];
  totalShares: number;
  totalPercentage: number;
}

export interface Instrument {
  id: string;
  type: 'common_stock' | 'preferred_stock' | 'option' | 'warrant' | 'convertible_note' | 'safe';
  shares: number;
  percentage: number;
  strikePrice?: number;
  vestingSchedule?: VestingSchedule;
  issueDate: string;
  notes?: string;
}

export interface VestingSchedule {
  totalShares: number;
  cliffMonths: number;
  vestingMonths: number;
  startDate: string;
  vestedShares: number;
}

export interface FinancingRound {
  id: string;
  name: string;
  type: 'seed' | 'series_a' | 'series_b' | 'series_c' | 'bridge';
  amount: number;
  preMoney: number;
  postMoney: number;
  date: string;
  investors: string[]; // shareholder IDs
  newShares: number;
}

export interface OwnershipStructure {
  companyName: string;
  totalShares: number;
  shareholders: Shareholder[];
  financingRounds: FinancingRound[];
  lastUpdated: string;
}

export interface ScenarioInput {
  roundName: string;
  raiseAmount: number;
  preMoney: number;
  newInvestors: Array<{
    name: string;
    investment: number;
  }>;
}

export interface DilutionResult {
  originalStructure: OwnershipStructure;
  newStructure: OwnershipStructure;
  dilutionPercentages: Record<string, number>;
}
