
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { sampleOwnershipData, getShareholderColor } from '@/data/sampleData';
import { Shareholder, Instrument } from '@/types/ownership';
import { IconSymbol } from '@/components/IconSymbol';

export default function CapTableScreen() {
  const [expandedShareholder, setExpandedShareholder] = useState<string | null>(null);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatShares = (shares: number): string => {
    return new Intl.NumberFormat('en-US').format(shares);
  };

  const getInstrumentTypeLabel = (type: Instrument['type']): string => {
    switch (type) {
      case 'common_stock': return 'Common Stock';
      case 'preferred_stock': return 'Preferred Stock';
      case 'option': return 'Stock Option';
      case 'warrant': return 'Warrant';
      case 'convertible_note': return 'Convertible Note';
      case 'safe': return 'SAFE';
      default: return 'Other';
    }
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

  const toggleExpanded = (shareholderId: string) => {
    setExpandedShareholder(
      expandedShareholder === shareholderId ? null : shareholderId
    );
  };

  return (
    <ScrollView style={[commonStyles.wrapper]} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>Capitalization Table</Text>
        <Text style={commonStyles.textSecondary}>
          {sampleOwnershipData.companyName} • {formatShares(sampleOwnershipData.totalShares)} total shares
        </Text>
      </View>

      <View style={[commonStyles.card, styles.tableCard]}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Shareholder</Text>
          <Text style={styles.headerText}>Shares</Text>
          <Text style={styles.headerText}>%</Text>
        </View>

        {sampleOwnershipData.shareholders
          .sort((a, b) => b.totalPercentage - a.totalPercentage)
          .map((shareholder, index) => (
            <View key={shareholder.id}>
              <Pressable
                style={styles.shareholderRow}
                onPress={() => toggleExpanded(shareholder.id)}
              >
                <View style={styles.shareholderInfo}>
                  <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(shareholder.type) }]} />
                  <View style={styles.shareholderDetails}>
                    <Text style={styles.shareholderName}>{shareholder.name}</Text>
                    <Text style={styles.shareholderType}>
                      {shareholder.type.charAt(0).toUpperCase() + shareholder.type.slice(1)}
                    </Text>
                  </View>
                </View>
                <View style={styles.sharesColumn}>
                  <Text style={styles.sharesText}>{formatShares(shareholder.totalShares)}</Text>
                </View>
                <View style={styles.percentageColumn}>
                  <Text style={styles.percentageText}>{shareholder.totalPercentage.toFixed(1)}%</Text>
                  <IconSymbol 
                    name={expandedShareholder === shareholder.id ? "chevron.up" : "chevron.down"} 
                    size={16} 
                    color={colors.textSecondary} 
                  />
                </View>
              </Pressable>

              {expandedShareholder === shareholder.id && (
                <View style={styles.instrumentsContainer}>
                  {shareholder.instruments.map((instrument) => (
                    <View key={instrument.id} style={styles.instrumentRow}>
                      <View style={styles.instrumentInfo}>
                        <Text style={styles.instrumentType}>
                          {getInstrumentTypeLabel(instrument.type)}
                        </Text>
                        <Text style={styles.instrumentDate}>
                          Issued: {new Date(instrument.issueDate).toLocaleDateString()}
                        </Text>
                        {instrument.strikePrice && (
                          <Text style={styles.instrumentStrike}>
                            Strike: {formatCurrency(instrument.strikePrice)}
                          </Text>
                        )}
                        {instrument.vestingSchedule && (
                          <Text style={styles.instrumentVesting}>
                            Vested: {formatShares(instrument.vestingSchedule.vestedShares)} / {formatShares(instrument.vestingSchedule.totalShares)}
                          </Text>
                        )}
                      </View>
                      <View style={styles.instrumentShares}>
                        <Text style={styles.instrumentSharesText}>
                          {formatShares(instrument.shares)}
                        </Text>
                        <Text style={styles.instrumentPercentageText}>
                          {instrument.percentage.toFixed(1)}%
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Outstanding</Text>
          <Text style={styles.totalShares}>{formatShares(sampleOwnershipData.totalShares)}</Text>
          <Text style={styles.totalPercentage}>100.0%</Text>
        </View>
      </View>

      <View style={[commonStyles.card, styles.legendCard]}>
        <Text style={styles.cardTitle}>Legend</Text>
        <View style={styles.legendGrid}>
          <View style={styles.legendItem}>
            <View style={[styles.legendIndicator, { backgroundColor: colors.chart1 }]} />
            <Text style={styles.legendText}>Founders</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendIndicator, { backgroundColor: colors.chart2 }]} />
            <Text style={styles.legendText}>Investors</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendIndicator, { backgroundColor: colors.chart3 }]} />
            <Text style={styles.legendText}>Employees</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendIndicator, { backgroundColor: colors.chart4 }]} />
            <Text style={styles.legendText}>Advisors</Text>
          </View>
        </View>
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
  tableCard: {
    padding: 0,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.backgroundAlt,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    flex: 1,
  },
  shareholderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  sharesColumn: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 20,
  },
  sharesText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  percentageColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 80,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  instrumentsContainer: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 20,
  },
  instrumentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  instrumentInfo: {
    flex: 1,
  },
  instrumentType: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  instrumentDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 1,
  },
  instrumentStrike: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 1,
  },
  instrumentVesting: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  instrumentShares: {
    alignItems: 'flex-end',
  },
  instrumentSharesText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  instrumentPercentageText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.backgroundAlt,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  totalShares: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'right',
    marginRight: 20,
  },
  totalPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    width: 80,
    textAlign: 'right',
  },
  legendCard: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  legendIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: colors.text,
  },
});
