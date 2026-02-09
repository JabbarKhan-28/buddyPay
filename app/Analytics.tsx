import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTransactions } from '../context/TransactionContext';

export default function Analytics() {
     const router = useRouter();
     const { filteredTransactions, income, expenses, formatCurrency } = useTransactions();

     // Calculate category breakdown
     const categoryData = filteredTransactions.reduce((acc: any, tx) => {
          if (tx.type === 'expense') {
               acc[tx.category] = (acc[tx.category] || 0) + Math.abs(parseFloat(tx.amount.replace(/[,+]/g, '')));
          }
          return acc;
     }, {});

     const categories = Object.keys(categoryData).sort((a, b) => categoryData[b] - categoryData[a]);

     return (
          <SafeAreaView style={styles.container}>
               <StatusBar barStyle={'light-content'} />
               <Stack.Screen options={{ headerShown: false }} />

               {/* Header */}
               <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                         <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Spending Insights</Text>
                    <View style={{ width: 40 }} />
               </View>

               {/* @ts-ignore */}
               <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                         {/* Overview Cards */}
                         <View style={styles.row}>
                              <View style={[styles.statCard, { backgroundColor: '#1A1A1A' }]}>
                                   <Text style={styles.statLabel}>Avg. Monthly</Text>
                                   <Text style={styles.statValue}>{formatCurrency(Math.round(expenses / 1))}</Text>
                              </View>
                              <View style={[styles.statCard, { backgroundColor: '#1A1A1A' }]}>
                                   <Text style={styles.statLabel}>Savings Rate</Text>
                                   <Text style={[styles.statValue, { color: '#8ac751' }]}>
                                        {income > 0 ? Math.round(((income - expenses) / income) * 100) : 0}%
                                   </Text>
                              </View>
                         </View>

                         {/* Category Breakdown (New Logic) */}
                         <View style={styles.section}>
                              <Text style={styles.sectionTitle}>Spending Analysis</Text>
                              {categories.length === 0 ? (
                                   <Text style={styles.emptyText}>No expense data yet</Text>
                              ) : (
                                   <View style={styles.chartContainer}>
                                        {categories.map(cat => {
                                             const maxVal = Math.max(...Object.values(categoryData) as number[]);
                                             const percentage = (categoryData[cat] / maxVal) * 100;
                                             return (
                                                  <View key={cat} style={styles.barWrapper}>
                                                       <View style={styles.barLabelRow}>
                                                            <Text style={styles.barLabel}>{cat}</Text>
                                                            <Text style={styles.barValue}>{formatCurrency(categoryData[cat])}</Text>
                                                       </View>
                                                       <View style={styles.barBg}>
                                                            <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: '#8ac751' }]} />
                                                       </View>
                                                  </View>
                                             );
                                        })}
                                   </View>
                              )}
                         </View>

                         {/* Insight Card */}
                         <View style={styles.insightCard}>
                              <View style={styles.insightIcon}>
                                   <Ionicons name="bulb-outline" size={24} color="#8ac751" />
                              </View>
                              <View style={styles.insightContent}>
                                   <Text style={styles.insightTitle}>Monthly Insight</Text>
                                   <Text style={styles.insightText}>
                                        {expenses > income * 0.7
                                             ? "Your spending is high compared to income. Try to reduce leisure expenses."
                                             : "You're on track! Good job keeping your expenses under 70% of income."}
                                   </Text>
                              </View>
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
          padding: 20,
     },
     row: {
          flexDirection: 'row',
          gap: 15,
          marginBottom: 30,
     },
     statCard: {
          flex: 1,
          padding: 20,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: '#222',
     },
     statLabel: {
          color: '#666',
          fontSize: 12,
          fontWeight: '700',
          textTransform: 'uppercase',
          marginBottom: 8,
     },
     statValue: {
          color: '#FFF',
          fontSize: 16,
          fontWeight: '800',
     },
     section: {
          backgroundColor: '#121212',
          borderRadius: 24,
          padding: 24,
          marginBottom: 25,
          borderWidth: 1,
          borderColor: '#1E1E1E',
     },
     sectionTitle: {
          color: '#FFF',
          fontSize: 18,
          fontWeight: '800',
          marginBottom: 20,
     },
     chartContainer: {
          gap: 20,
     },
     barWrapper: {
          gap: 8,
     },
     barLabelRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
     },
     barLabel: {
          color: '#AAA',
          fontSize: 14,
          fontWeight: '600',
     },
     barValue: {
          color: '#FFF',
          fontSize: 14,
          fontWeight: '700',
     },
     barBg: {
          height: 8,
          backgroundColor: '#1A1A1A',
          borderRadius: 4,
          overflow: 'hidden',
     },
     barFill: {
          height: '100%',
          borderRadius: 4,
     },
     insightCard: {
          flexDirection: 'row',
          backgroundColor: '#121212',
          borderRadius: 24,
          padding: 20,
          borderWidth: 1,
          borderColor: '#1E1E1E',
          gap: 15,
     },
     insightIcon: {
          width: 48,
          height: 48,
          backgroundColor: '#8ac75110',
          borderRadius: 14,
          justifyContent: 'center',
          alignItems: 'center',
     },
     insightContent: {
          flex: 1,
     },
     insightTitle: {
          color: '#FFF',
          fontSize: 16,
          fontWeight: '800',
          marginBottom: 4,
     },
     insightText: {
          color: '#666',
          fontSize: 13,
          lineHeight: 18,
          fontWeight: '500',
     },
     emptyText: {
          color: '#444',
          textAlign: 'center',
          paddingVertical: 20,
     }
});

