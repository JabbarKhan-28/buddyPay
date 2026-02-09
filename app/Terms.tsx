import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Terms() {
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
                    <Text style={styles.headerTitle}>Terms of Service</Text>
                    <View style={{ width: 40 }} />
               </View>

               {/* @ts-ignore */}
               <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                         <Text style={styles.lastUpdated}>Last Updated: February 9, 2026</Text>

                         <View style={styles.section}>
                              <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                              <Text style={styles.sectionText}>
                                   By accessing or using BuddyPay, you agree to be bound by these Terms of Service. If you do not agree, please do not use the application.
                              </Text>
                         </View>

                         <View style={styles.section}>
                              <Text style={styles.sectionTitle}>2. App Description</Text>
                              <Text style={styles.sectionText}>
                                   BuddyPay is a personal and shared expense management tool designed to help you track finances. The application provides analytical insights based on the data you provide.
                              </Text>
                         </View>

                         <View style={styles.section}>
                              <Text style={styles.sectionTitle}>3. User Accounts</Text>
                              <Text style={styles.sectionText}>
                                   You are responsible for maintaining the confidentiality of your account information. BuddyPay currently stores data locally and through secure synchronized channels where applicable. You agree to provide accurate financial information for best results.
                              </Text>
                         </View>

                         <View style={styles.section}>
                              <Text style={styles.sectionTitle}>4. Limitation of Liability</Text>
                              <Text style={styles.sectionText}>
                                   BuddyPay is a tracking tool and does not provide professional financial advice. We are not liable for any financial decisions made based on the data displayed in the app. Use the analytical insights at your own discretion.
                              </Text>
                         </View>

                         <View style={styles.section}>
                              <Text style={styles.sectionTitle}>5. Data Accuracy</Text>
                              <Text style={styles.sectionText}>
                                   While we strive for accuracy in calculations, BuddyPay depends on user-entered data. We recommend periodic manual verification of your balances and totals.
                              </Text>
                         </View>

                         <View style={styles.section}>
                              <Text style={styles.sectionTitle}>6. Intellectual Property</Text>
                              <Text style={styles.sectionText}>
                                   All design elements, logos, and software code are the property of BuddyPay and protected by international copyright laws.
                              </Text>
                         </View>

                         <View style={styles.section}>
                              <Text style={styles.sectionTitle}>7. Changes to Terms</Text>
                              <Text style={styles.sectionText}>
                                   We reserve the right to modify these terms at any time. Continued use of the app after changes constitutes acceptance of the updated terms.
                              </Text>
                         </View>

                         <View style={styles.footer}>
                              <Text style={styles.footerText}>Thank you for choosing BuddyPay for your financial journey.</Text>
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
          color: '#8ac751',
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
     footer: {
          marginTop: 20,
          paddingBottom: 40,
          borderTopWidth: 1,
          borderTopColor: '#1A1A1A',
          paddingTop: 30,
     },
     footerText: {
          color: '#444',
          fontSize: 13,
          textAlign: 'center',
          fontWeight: '600',
          lineHeight: 18,
     }
});
