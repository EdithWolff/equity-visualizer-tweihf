
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { sampleOwnershipData } from '@/data/sampleData';
import { ScenarioInput, DilutionResult, OwnershipStructure } from '@/types/ownership';
import { Button } from '@/components/button';

export default function ScenarioScreen() {
  const [scenarioInput, setScenarioInput] = useState<ScenarioInput>({
    roundName: 'Series B',
    raiseAmount: 5000000,
    preMoney: 20000000,
    newInvestors: [
      { name: 'Growth Capital Partners', investment: 5000000 }
    ]
  });

  const [dilutionResult, setDilutionResult] = useState<DilutionResult | null>(null);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatShares = (shares: number): string => {
    return new Intl.NumberFormat('en-US').format(shares);
  };

  const calculateDilution = (): DilutionResult => {
    const originalStructure = { ...sampleOwnershipData };
    const postMoney = scenarioInput.preMoney + scenarioInput.raiseAmount;
    const newShares = Math.round((scenarioInput.raiseAmount / postMoney) * originalStructure.totalShares / (1 - (scenarioInput.raiseAmount / postMoney)));
    const newTotalShares = originalStructure.totalShares + newShares;

    // Calculate new percentages for existing shareholders
    const newStructure: OwnershipStructure = {
      ...originalStructure,
      totalShares: newTotalShares,
      shareholders: originalStructure.shareholders.map(shareholder => ({
        ...shareholder,
        totalPercentage: (shareholder.totalShares / newTotalShares) * 100,
        instruments: shareholder.instruments.map(instrument => ({
          ...instrument,
          percentage: (instrument.shares / newTotalShares) * 100
        }))
      }))
    };

    // Add new investors
    scenarioInput.newInvestors.forEach((investor, index) => {
      const investorShares = Math.round((investor.investment / scenarioInput.raiseAmount) * newShares);
      const investorPercentage = (investorShares / newTotalShares) * 100;

      newStructure.shareholders.push({
        id: `new-investor-${index}`,
        name: investor.name,
        type: 'investor',
        totalShares: investorShares,
        totalPercentage: investorPercentage,
        instruments: [{
          id: `new-instrument-${index}`,
          type: 'preferred_stock',
          shares: investorShares,
          percentage: investorPercentage,
          issueDate: new Date().toISOString(),
          notes: scenarioInput.roundName
        }]
      });
    });

    // Calculate dilution percentages
    const dilutionPercentages: Record<string, number> = {};
    originalStructure.shareholders.forEach(shareholder => {
      const newShareholder = newStructure.shareholders.find(s => s.id === shareholder.id);
      if (newShareholder) {
        dilutionPercentages[shareholder.id] = shareholder.totalPercentage - newShareholder.totalPercentage;
      }
    });

    return {
      originalStructure,
      newStructure,
      dilutionPercentages
    };
  };

  const runScenario = () => {
    if (scenarioInput.raiseAmount <= 0 || scenarioInput.preMoney <= 0) {
      Alert.alert('Invalid Input', 'Please enter valid amounts for raise and pre-money valuation.');
      return;
    }

    const result = calculateDilution();
    setDilutionResult(result);
    console.log('Scenario calculated:', result);
  };

  const resetScenario = () => {
    setDilutionResult(null);
  };

  return (
    <ScrollView style={[commonStyles.wrapper]} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>Scenario Simulator</Text>
        <Text style={commonStyles.textSecondary}>
          Model financing rounds and see dilution impact
        </Text>
      </View>

      <View style={[commonStyles.card, styles.inputCard]}>
        <Text style={styles.cardTitle}>Financing Round Details</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Round Name</Text>
          <TextInput
            style={styles.textInput}
            value={scenarioInput.roundName}
            onChangeText={(text) => setScenarioInput(prev => ({ ...prev, roundName: text }))}
            placeholder="e.g., Series B"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Raise Amount ($)</Text>
          <TextInput
            style={styles.textInput}
            value={scenarioInput.raiseAmount.toString()}
            onChangeText={(text) => {
              const amount = parseInt(text.replace(/[^0-9]/g, '')) || 0;
              setScenarioInput(prev => ({ ...prev, raiseAmount: amount }));
            }}
            placeholder="5,000,000"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Pre-Money Valuation ($)</Text>
          <TextInput
            style={styles.textInput}
            value={scenarioInput.preMoney.toString()}
            onChangeText={(text) => {
              const amount = parseInt(text.replace(/[^0-9]/g, '')) || 0;
              setScenarioInput(prev => ({ ...prev, preMoney: amount }));
            }}
            placeholder="20,000,000"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.calculatedValues}>
          <View style={styles.calculatedItem}>
            <Text style={styles.calculatedLabel}>Post-Money Valuation</Text>
            <Text style={styles.calculatedValue}>
              {formatCurrency(scenarioInput.preMoney + scenarioInput.raiseAmount)}
            </Text>
          </View>
          <View style={styles.calculatedItem}>
            <Text style={styles.calculatedLabel}>New Investor Ownership</Text>
            <Text style={styles.calculatedValue}>
              {((scenarioInput.raiseAmount / (scenarioInput.preMoney + scenarioInput.raiseAmount)) * 100).toFixed(1)}%
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button onPress={runScenario} style={styles.simulateButton}>
            <Text style={styles.buttonText}>Run Simulation</Text>
          </Button>
          {dilutionResult && (
            <Button onPress={resetScenario} variant="secondary" style={styles.resetButton}>
              <Text style={styles.buttonTextSecondary}>Reset</Text>
            </Button>
          )}
        </View>
      </View>

      {dilutionResult && (
        <>
          <View style={[commonStyles.card, styles.resultsCard]}>
            <Text style={styles.cardTitle}>Dilution Impact</Text>
            
            {dilutionResult.originalStructure.shareholders.map((shareholder) => {
              const newShareholder = dilutionResult.newStructure.shareholders.find(s => s.id === shareholder.id);
              const dilution = dilutionResult.dilutionPercentages[shareholder.id] || 0;
              
              return (
                <View key={shareholder.id} style={styles.dilutionItem}>
                  <View style={styles.shareholderInfo}>
                    <Text style={styles.shareholderName}>{shareholder.name}</Text>
                    <Text style={styles.shareholderType}>
                      {shareholder.type.charAt(0).toUpperCase() + shareholder.type.slice(1)}
                    </Text>
                  </View>
                  <View style={styles.dilutionStats}>
                    <View style={styles.beforeAfter}>
                      <Text style={styles.beforeText}>
                        {shareholder.totalPercentage.toFixed(1)}% → {newShareholder?.totalPercentage.toFixed(1)}%
                      </Text>
                      <Text style={[styles.dilutionText, { color: dilution > 0 ? colors.error : colors.success }]}>
                        -{dilution.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={[commonStyles.card, styles.newStructureCard]}>
            <Text style={styles.cardTitle}>New Ownership Structure</Text>
            
            {dilutionResult.newStructure.shareholders
              .sort((a, b) => b.totalPercentage - a.totalPercentage)
              .map((shareholder) => (
                <View key={shareholder.id} style={styles.newShareholderItem}>
                  <View style={styles.shareholderInfo}>
                    <Text style={styles.shareholderName}>{shareholder.name}</Text>
                    <Text style={styles.shareholderType}>
                      {shareholder.type.charAt(0).toUpperCase() + shareholder.type.slice(1)}
                    </Text>
                  </View>
                  <View style={styles.shareholderStats}>
                    <Text style={styles.shareholderPercentage}>
                      {shareholder.totalPercentage.toFixed(1)}%
                    </Text>
                    <Text style={styles.shareholderShares}>
                      {formatShares(shareholder.totalShares)} shares
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  inputCard: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  calculatedValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  calculatedItem: {
    alignItems: 'center',
  },
  calculatedLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  calculatedValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  buttonContainer: {
    marginTop: 20,
  },
  simulateButton: {
    backgroundColor: colors.primary,
    marginBottom: 12,
  },
  resetButton: {
    backgroundColor: colors.backgroundAlt,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  resultsCard: {
    marginBottom: 20,
  },
  dilutionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  shareholderInfo: {
    flex: 1,
  },
  shareholderName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  shareholderType: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dilutionStats: {
    alignItems: 'flex-end',
  },
  beforeAfter: {
    alignItems: 'flex-end',
  },
  beforeText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  dilutionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  newStructureCard: {
    marginBottom: 20,
  },
  newShareholderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  shareholderStats: {
    alignItems: 'flex-end',
  },
  shareholderPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  shareholderShares: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
