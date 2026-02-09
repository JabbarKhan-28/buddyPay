import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Privacy() {
     const router = useRouter();

     return (
          <SafeAreaView style={styles.container}>
               <StatusBar barStyle={'light-content'} />
               <Stack.Screen options={{ headerShown: false }} />

               {/* Header */}
               <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                         <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Privacy Policy</Text>
                    <View style={{ width: 40 }} />
               </View>

               {/* @ts-ignore */}
               <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                         <Text style={styles.lastUpdated}>Last Updated: February 9, 2026</Text>

                         <View style={styles.section}>
                              <Text style={styles.sectionTitle}>1. Data We Collect</Text>
                              <View style={styles.bulletPoint}>
                                   <Text style={styles.bullet}>•</Text>
                                   <Text style={styles.bulletText}>Financial Data: Transaction titles, categories, amounts, and dates.</Text>
                              </View>
                              <View style={styles.bulletPoint}>
                                   <Text style={styles.bullet}>•</Text>
                                   <Text style={styles.bulletText}>Profile Data: Your custom initials or emoji avatar.</Text>
                              </View>
                              <View style={styles.bulletPoint}>
                                   <Text style={styles.bullet}>•</Text>
                                   <Text style={styles.bulletText}>Budget Preferences: Your monthly spending limits and financial goals.</Text>
                              </View>
                         </View>

                         <View style={styles.section}>
                              <Text style={styles.sectionTitle}>2. How We Use Data</Text>
                              <Text style={styles.sectionText}>
                                   Your data is used solely to provide financial tracking services, generate spending insights, and visualize your budget progress. We do not sell your data to third parties.
                              </Text>
                         </View>

                         <View style={styles.section}>
                              <Text style={styles.sectionTitle}>3. Local Storage & Security</Text>
                              <Text style={styles.sectionText}>
                                   BuddyPay prioritizes your privacy by keeping your transaction history on your device. We use industry-standard encryption for any synchronized data to ensure your financial life remains private and secure.
                              </Text>
                         </View>

                         <View style={styles.section}>
                              <Text style={styles.sectionTitle}>4. Shared Wallets</Text>
                              <Text style={styles.sectionText}>
                                   When using the 'Shared' view mode, only specified transactions are visible to other members of your shared group. Your personal wallet remains private and inaccessible to others.
                              </Text>
                         </View>

                         <View style={styles.section}>
                              <Text style={styles.sectionTitle}>5. Your Rights</Text>
                              <Text style={styles.sectionText}>
                                   You have full control over your data. You can edit or delete transactions, clear your budget history, and update your profile at any time. If you delete your account, all associated data is permanently removed.
                              </Text>
                         </View>

                         <View style={styles.section}>
                              <Text style={styles.sectionTitle}>6. Third-Party Services</Text>
                              <Text style={styles.sectionText}>
                                   The app does not integrate with external bank accounts or trackers, ensuring your bank credentials never touch our platform.
                              </Text>
                         </View>

                         <View style={styles.footer}>
                              <Text style={styles.footerText}>We are committed to protecting your financial privacy.</Text>
                              <Text style={styles.footerSubText}>Questions? Contact us at privacy@buddypay.app</Text>
                         </View>
                    </View>
               </ScrollView>
          </SafeAreaView>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: "#080808",
     },
     header: {
          height: 70,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#1A1A1A',
     },
     backButton: {
          padding: 8,
          borderRadius: 14,
          backgroundColor: '#161616',
     },
     headerTitle: {
          fontSize: 20,
          fontWeight: '800',
          color: '#FFF',
          letterSpacing: -0.5,
     },
     body: {
          flex: 1,
     },
     content: {
          padding: 24,
     },
     lastUpdated: {
          color: '#444',
          fontSize: 12,
          fontWeight: '700',
          marginBottom: 30,
     },
     section: {
          marginBottom: 30,
     },
     sectionTitle: {
          color: '#448aff',
          fontSize: 16,
          fontWeight: '800',
          marginBottom: 12,
     },
     sectionText: {
          color: '#AAA',
          fontSize: 14,
          lineHeight: 22,
          fontWeight: '500',
     },
     bulletPoint: {
          flexDirection: 'row',
          marginBottom: 8,
          paddingRight: 10,
     },
     bullet: {
          color: '#448aff',
          fontSize: 18,
          marginRight: 10,
          lineHeight: 20,
     },
     bulletText: {
          color: '#AAA',
          fontSize: 14,
          lineHeight: 20,
          fontWeight: '500',
          flex: 1,
     },
     footer: {
          marginTop: 20,
          paddingBottom: 40,
          borderTopWidth: 1,
          borderTopColor: '#1A1A1A',
          paddingTop: 30,
          alignItems: 'center',
     },
     footerText: {
          color: '#444',
          fontSize: 13,
          fontWeight: '600',
          marginBottom: 6,
     },
     footerSubText: {
          color: '#222',
          fontSize: 11,
          fontWeight: '700',
     }
});
