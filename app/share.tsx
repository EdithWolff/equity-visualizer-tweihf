
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Alert, Share } from 'react-native';
import { Stack, router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { sampleOwnershipData } from '@/data/sampleData';
import { Button } from '@/components/button';
import { IconSymbol } from '@/components/IconSymbol';

export default function ShareScreen() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('Hi! I wanted to share our company\'s ownership structure with you. Please take a look and let me know if you have any questions.');
  const [accessLevel, setAccessLevel] = useState<'view' | 'comment'>('view');

  const handleShare = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    // In a real app, this would generate a secure sharing link
    const shareUrl = `https://ownership-app.com/shared/${sampleOwnershipData.companyName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    
    try {
      await Share.share({
        message: `${message}\n\nView ownership structure: ${shareUrl}`,
        title: `${sampleOwnershipData.companyName} - Ownership Structure`,
      });
      
      Alert.alert(
        'Shared Successfully',
        `A read-only link has been shared. The recipient will be able to ${accessLevel === 'view' ? 'view' : 'view and comment on'} the ownership structure.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.log('Share error:', error);
      Alert.alert('Error', 'Failed to share. Please try again.');
    }
  };

  const generateReadOnlyLink = () => {
    const shareUrl = `https://ownership-app.com/shared/${sampleOwnershipData.companyName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    
    Alert.alert(
      'Read-Only Link Generated',
      `Link: ${shareUrl}\n\nThis link provides read-only access to your ownership structure. Share it with investors, advisors, or team members.`,
      [
        { text: 'Copy Link', onPress: () => console.log('Link copied to clipboard') },
        { text: 'OK' }
      ]
    );
  };

  return (
    <ScrollView style={[commonStyles.wrapper]} contentContainerStyle={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Share Ownership Data',
          headerBackTitle: 'Back',
        }} 
      />
      
      <View style={styles.header}>
        <IconSymbol name="square.and.arrow.up" size={48} color={colors.primary} />
        <Text style={commonStyles.title}>Share with Team</Text>
        <Text style={commonStyles.textSecondary}>
          Collaborate with investors and team members
        </Text>
      </View>

      <View style={[commonStyles.card, styles.shareCard]}>
        <Text style={styles.cardTitle}>Send Invitation</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            placeholder="investor@example.com"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Access Level</Text>
          <View style={styles.accessLevelContainer}>
            <Text
              style={[
                styles.accessLevelButton,
                accessLevel === 'view' && styles.accessLevelButtonActive
              ]}
              onPress={() => setAccessLevel('view')}
            >
              View Only
            </Text>
            <Text
              style={[
                styles.accessLevelButton,
                accessLevel === 'comment' && styles.accessLevelButtonActive
              ]}
              onPress={() => setAccessLevel('comment')}
            >
              View & Comment
            </Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Message (Optional)</Text>
          <TextInput
            style={[styles.textInput, styles.messageInput]}
            value={message}
            onChangeText={setMessage}
            placeholder="Add a personal message..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
          />
        </View>

        <Button onPress={handleShare} style={styles.shareButton}>
          <Text style={styles.buttonText}>Send Invitation</Text>
        </Button>
      </View>

      <View style={[commonStyles.card, styles.linkCard]}>
        <Text style={styles.cardTitle}>Quick Share</Text>
        <Text style={styles.linkDescription}>
          Generate a read-only link that you can share via email, Slack, or any other platform.
        </Text>
        
        <Button onPress={generateReadOnlyLink} variant="secondary" style={styles.linkButton}>
          <Text style={styles.buttonTextSecondary}>Generate Read-Only Link</Text>
        </Button>
      </View>

      <View style={[commonStyles.card, styles.featuresCard]}>
        <Text style={styles.cardTitle}>Sharing Features</Text>
        
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <IconSymbol name="eye" size={20} color={colors.primary} />
            <Text style={styles.featureText}>Real-time view of ownership structure</Text>
          </View>
          
          <View style={styles.featureItem}>
            <IconSymbol name="lock.shield" size={20} color={colors.primary} />
            <Text style={styles.featureText}>Secure, encrypted sharing links</Text>
          </View>
          
          <View style={styles.featureItem}>
            <IconSymbol name="clock" size={20} color={colors.primary} />
            <Text style={styles.featureText}>Access expires automatically</Text>
          </View>
          
          <View style={styles.featureItem}>
            <IconSymbol name="person.2" size={20} color={colors.primary} />
            <Text style={styles.featureText}>Track who viewed your data</Text>
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
    marginBottom: 32,
  },
  shareCard: {
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
    marginBottom: 20,
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
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  accessLevelContainer: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    padding: 4,
  },
  accessLevelButton: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    borderRadius: 6,
  },
  accessLevelButtonActive: {
    backgroundColor: colors.background,
    color: colors.primary,
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: colors.primary,
    marginTop: 10,
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
  linkCard: {
    marginBottom: 20,
  },
  linkDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  linkButton: {
    backgroundColor: colors.backgroundAlt,
  },
  featuresCard: {
    marginBottom: 20,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
});
