
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { colors, commonStyles } from '@/styles/commonStyles';
import { sampleOwnershipData, getShareholderColor } from '@/data/sampleData';
import { Shareholder } from '@/types/ownership';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const chartData = sampleOwnershipData.shareholders.map((shareholder, index) => ({
    name: shareholder.name,
    population: shareholder.totalPercentage,
    color: getShareholderColor(index),
    legendFontColor: colors.text,
    legendFontSize: 14,
  }));

  const chartConfig = {
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

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

  const getTypeColor = (type: Shareholder['type']): string => {
    switch (type) {
      case 'founder': return colors.chart1;
      case 'investor': return colors.chart2;
      case 'employee': return colors.chart3;
      case 'advisor': return colors.chart4;
      default: return colors.grey;
    }
  };

  const getTypeLabel = (type: Shareholder['type']): string => {
    switch (type) {
      case 'founder': return 'Founder';
      case 'investor': return 'Investor';
      case 'employee': return 'Employee';
      case 'advisor': return 'Advisor';
      default: return 'Other';
    }
  };

  return (
    <ScrollView style={[commonStyles.wrapper]} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>{sampleOwnershipData.companyName}</Text>
        <Text style={commonStyles.textSecondary}>
          Total Shares: {formatShares(sampleOwnershipData.totalShares)}
        </Text>
      </View>

      <View style={[commonStyles.card, styles.chartCard]}>
        <Text style={styles.cardTitle}>Ownership Distribution</Text>
        <PieChart
          data={chartData}
          width={screenWidth - 80}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 0]}
          absolute
        />
      </View>

      <View style={[commonStyles.card, styles.summaryCard]}>
        <Text style={styles.cardTitle}>Quick Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{sampleOwnershipData.shareholders.length}</Text>
            <Text style={styles.statLabel}>Shareholders</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{sampleOwnershipData.financingRounds.length}</Text>
            <Text style={styles.statLabel}>Funding Rounds</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {formatCurrency(sampleOwnershipData.financingRounds.reduce((sum, round) => sum + round.amount, 0))}
            </Text>
            <Text style={styles.statLabel}>Total Raised</Text>
          </View>
        </View>
      </View>

      <View style={[commonStyles.card, styles.shareholdersCard]}>
        <Text style={styles.cardTitle}>Top Shareholders</Text>
        {sampleOwnershipData.shareholders
          .sort((a, b) => b.totalPercentage - a.totalPercentage)
          .slice(0, 4)
          .map((shareholder, index) => (
            <View key={shareholder.id} style={styles.shareholderItem}>
              <View style={styles.shareholderInfo}>
                <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(shareholder.type) }]} />
                <View style={styles.shareholderDetails}>
                  <Text style={styles.shareholderName}>{shareholder.name}</Text>
                  <Text style={styles.shareholderType}>{getTypeLabel(shareholder.type)}</Text>
                </View>
              </View>
              <View style={styles.shareholderStats}>
                <Text style={styles.shareholderPercentage}>{shareholder.totalPercentage.toFixed(1)}%</Text>
                <Text style={styles.shareholderShares}>{formatShares(shareholder.totalShares)} shares</Text>
              </View>
            </View>
          ))}
      </View>
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
  chartCard: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryCard: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  shareholdersCard: {
    marginBottom: 20,
  },
  shareholderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  shareholderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  shareholderDetails: {
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
