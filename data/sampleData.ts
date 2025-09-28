
import { OwnershipStructure, Shareholder, Instrument, FinancingRound } from '../types/ownership';

export const sampleOwnershipData: OwnershipStructure = {
  companyName: "TechCorp Inc.",
  totalShares: 10000000,
  lastUpdated: new Date().toISOString(),
  shareholders: [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@techcorp.com",
      type: "founder",
      totalShares: 4000000,
      totalPercentage: 40,
      instruments: [
        {
          id: "1-1",
          type: "common_stock",
          shares: 4000000,
          percentage: 40,
          issueDate: "2023-01-01",
          vestingSchedule: {
            totalShares: 4000000,
            cliffMonths: 12,
            vestingMonths: 48,
            startDate: "2023-01-01",
            vestedShares: 1000000
          }
        }
      ]
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@techcorp.com",
      type: "founder",
      totalShares: 3000000,
      totalPercentage: 30,
      instruments: [
        {
          id: "2-1",
          type: "common_stock",
          shares: 3000000,
          percentage: 30,
          issueDate: "2023-01-01",
          vestingSchedule: {
            totalShares: 3000000,
            cliffMonths: 12,
            vestingMonths: 48,
            startDate: "2023-01-01",
            vestedShares: 750000
          }
        }
      ]
    },
    {
      id: "3",
      name: "Venture Capital Fund",
      email: "contact@vcfund.com",
      type: "investor",
      totalShares: 2000000,
      totalPercentage: 20,
      instruments: [
        {
          id: "3-1",
          type: "preferred_stock",
          shares: 2000000,
          percentage: 20,
          issueDate: "2023-06-01",
          notes: "Series A Preferred"
        }
      ]
    },
    {
      id: "4",
      name: "Employee Option Pool",
      type: "employee",
      totalShares: 1000000,
      totalPercentage: 10,
      instruments: [
        {
          id: "4-1",
          type: "option",
          shares: 1000000,
          percentage: 10,
          strikePrice: 0.10,
          issueDate: "2023-01-01",
          notes: "Employee Stock Option Pool"
        }
      ]
    }
  ],
  financingRounds: [
    {
      id: "round-1",
      name: "Series A",
      type: "series_a",
      amount: 2000000,
      preMoney: 8000000,
      postMoney: 10000000,
      date: "2023-06-01",
      investors: ["3"],
      newShares: 2000000
    }
  ]
};

export const chartColors = [
  '#4F46E5', // Indigo
  '#8B5CF6', // Purple  
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#6366F1', // Light Indigo
  '#EC4899', // Pink
];

export const getShareholderColor = (index: number): string => {
  return chartColors[index % chartColors.length];
};
