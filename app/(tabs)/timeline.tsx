
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { sampleOwnershipData } from '@/data/sampleData';
import { Shareholder, VestingSchedule } from '@/types/ownership';

const screenWidth = Dimensions.get('window').width;

export default function TimelineScreen() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1y' | '2y' | '4y'>('4y');

  const formatShares = (shares: number): string => {
    return new Intl.NumberFormat('en-US').format(shares);
  };

  const calculateVestedShares = (vesting: VestingSchedule, monthsElapsed: number): number => {
    if (monthsElapsed < vesting.cliffMonths) {
      return 0;
    }
    
    const vestingProgress = Math.min(monthsElapsed / vesting.vestingMonths, 1);
    return Math.floor(vesting.totalShares * vestingProgress);
  };

  const getVestingProgress = (vesting: VestingSchedule): number => {
    const startDate = new Date(vesting.startDate);
    const now = new Date();
    const monthsElapsed = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
    
    if (monthsElapsed < vesting.cliffMonths) {
      return 0;
    }
    
    return Math.min(monthsElapsed / vesting.vestingMonths, 1);
  };

  const getTimelineData = () => {
    const months = selectedTimeframe === '1y' ? 12 : selectedTimeframe === '2y' ? 24 : 48;
    const timelineData = [];
    
    for (let i = 0; i <= months; i += 6) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      
      const shareholdersData = sampleOwnershipData.shareholders
        .filter(s => s.instruments.some(inst => inst.vestingSchedule))
        .map(shareholder => {
          const vestingInstrument = shareholder.instruments.find(inst => inst.vestingSchedule);
          if (!vestingInstrument?.vestingSchedule) return null;
          
          const vestedShares = calculateVestedShares(vestingInstrument.vestingSchedule, i);
          return {
            shareholderId: shareholder.id,
            shareholderName: shareholder.name,
            vestedShares,
            totalShares: vestingInstrument.vestingSchedule.totalShares,
            percentage: (vestedShares / vestingInstrument.vestingSchedule.totalShares) * 100
          };
        })
        .filter(Boolean);
      
      timelineData.push({
        month: i,
        date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        shareholders: shareholdersData
      });
    }
    
    return timelineData;
  };

  const timelineData = getTimelineData();
  const vestingShareholders = sampleOwnershipData.shareholders.filter(s => 
    s.instruments.some(inst => inst.vestingSchedule)
  );

  return (
    <ScrollView style={[commonStyles.wrapper]} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>Vesting Timeline</Text>
        <Text style={commonStyles.textSecondary}>
          Track equity vesting schedules over time
        </Text>
      </View>

      <View style={[commonStyles.card, styles.currentStatusCard]}>
        <Text style={styles.cardTitle}>Current Vesting Status</Text>
        
        {vestingShareholders.map((shareholder) => {
          const vestingInstrument = shareholder.instruments.find(inst => inst.vestingSchedule);
          if (!vestingInstrument?.vestingSchedule) return null;
          
          const progress = getVestingProgress(vestingInstrument.vestingSchedule);
          const vestedShares = vestingInstrument.vestingSchedule.vestedShares;
          const totalShares = vestingInstrument.vestingSchedule.totalShares;
          
          return (
            <View key={shareholder.id} style={styles.vestingItem}>
              <View style={styles.vestingHeader}>
                <Text style={styles.shareholderName}>{shareholder.name}</Text>
                <Text style={styles.vestingPercentage}>
                  {(progress * 100).toFixed(1)}% vested
                </Text>
              </View>
              
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { width: `${progress * 100}%` }
                    ]} 
                  />
                </View>
              </View>
              
              <View style={styles.vestingDetails}>
                <Text style={styles.vestingText}>
                  {formatShares(vestedShares)} / {formatShares(totalShares)} shares
                </Text>
                <Text style={styles.vestingScheduleText}>
                  {vestingInstrument.vestingSchedule.cliffMonths}m cliff, {vestingInstrument.vestingSchedule.vestingMonths}m total
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={[commonStyles.card, styles.timelineCard]}>
        <Text style={styles.cardTitle}>Vesting Projection</Text>
        
        <View style={styles.timeframeSelector}>
          {(['1y', '2y', '4y'] as const).map((timeframe) => (
            <Text
              key={timeframe}
              style={[
                styles.timeframeButton,
                selectedTimeframe === timeframe && styles.timeframeButtonActive
              ]}
              onPress={() => setSelectedTimeframe(timeframe)}
            >
              {timeframe === '1y' ? '1 Year' : timeframe === '2y' ? '2 Years' : '4 Years'}
            </Text>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timelineScroll}>
          <View style={styles.timelineContainer}>
            {timelineData.map((dataPoint, index) => (
              <View key={index} style={styles.timelinePoint}>
                <Text style={styles.timelineDate}>{dataPoint.date}</Text>
                
                {dataPoint.shareholders.map((shareholderData: any) => (
                  <View key={shareholderData.shareholderId} style={styles.timelineShareholderData}>
                    <Text style={styles.timelineShareholderName}>
                      {shareholderData.shareholderName}
                    </Text>
                    <Text style={styles.timelineVestedShares}>
                      {formatShares(shareholderData.vestedShares)}
                    </Text>
                    <Text style={styles.timelinePercentage}>
                      {shareholderData.percentage.toFixed(0)}%
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={[commonStyles.card, styles.milestonesCard]}>
        <Text style={styles.cardTitle}>Upcoming Milestones</Text>
        
        {vestingShareholders.map((shareholder) => {
          const vestingInstrument = shareholder.instruments.find(inst => inst.vestingSchedule);
          if (!vestingInstrument?.vestingSchedule) return null;
          
          const startDate = new Date(vestingInstrument.vestingSchedule.startDate);
          const cliffDate = new Date(startDate);
          cliffDate.setMonth(cliffDate.getMonth() + vestingInstrument.vestingSchedule.cliffMonths);
          
          const fullVestDate = new Date(startDate);
          fullVestDate.setMonth(fullVestDate.getMonth() + vestingInstrument.vestingSchedule.vestingMonths);
          
          const now = new Date();
          const isCliffPassed = now > cliffDate;
          const isFullyVested = now > fullVestDate;
          
          return (
            <View key={shareholder.id} style={styles.milestoneItem}>
              <Text style={styles.milestoneShareholderName}>{shareholder.name}</Text>
              
              {!isCliffPassed && (
                <View style={styles.milestoneEvent}>
                  <Text style={styles.milestoneEventType}>Cliff Date</Text>
                  <Text style={styles.milestoneEventDate}>
                    {cliffDate.toLocaleDateString()}
                  </Text>
                </View>
              )}
              
              {!isFullyVested && (
                <View style={styles.milestoneEvent}>
                  <Text style={styles.milestoneEventType}>Full Vesting</Text>
                  <Text style={styles.milestoneEventDate}>
                    {fullVestDate.toLocaleDateString()}
                  </Text>
                </View>
              )}
              
              {isFullyVested && (
                <View style={styles.milestoneEvent}>
                  <Text style={[styles.milestoneEventType, { color: colors.success }]}>
                    Fully Vested
                  </Text>
                </View>
              )}
            </View>
          );
        })}
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
  currentStatusCard: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  vestingItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  vestingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  shareholderName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  vestingPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  vestingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vestingText: {
    fontSize: 14,
    color: colors.text,
  },
  vestingScheduleText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  timelineCard: {
    marginBottom: 20,
  },
  timeframeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    padding: 4,
  },
  timeframeButton: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    borderRadius: 6,
  },
  timeframeButtonActive: {
    backgroundColor: colors.background,
    color: colors.primary,
    fontWeight: '600',
  },
  timelineScroll: {
    marginHorizontal: -20,
  },
  timelineContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  timelinePoint: {
    width: 120,
    marginRight: 16,
    alignItems: 'center',
  },
  timelineDate: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  timelineShareholderData: {
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 6,
    width: '100%',
  },
  timelineShareholderName: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  timelineVestedShares: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  timelinePercentage: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  milestonesCard: {
    marginBottom: 20,
  },
  milestoneItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  milestoneShareholderName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  milestoneEvent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  milestoneEventType: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  milestoneEventDate: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
});
