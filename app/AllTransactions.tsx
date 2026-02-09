import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from '../app/FInanceCard';
import { useTransactions } from '../context/TransactionContext';

export default function AllTransactions() {
     const router = useRouter();
     const { filteredTransactions, formatCurrency, formatDate } = useTransactions();

     // Group transactions by month and then by day
     const monthlyGroups = React.useMemo(() => {
          const groups: {
               [key: string]: {
                    income: number;
                    expenses: number;
                    days: { [key: string]: typeof filteredTransactions }
               }
          } = {};

          filteredTransactions.forEach(tx => {
               const dateObj = new Date(tx.date);
               const monthYear = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
               const dayKey = formatDate(tx.date);

               if (!groups[monthYear]) {
                    groups[monthYear] = { income: 0, expenses: 0, days: {} };
               }

               if (!groups[monthYear].days[dayKey]) {
                    groups[monthYear].days[dayKey] = [];
               }

               groups[monthYear].days[dayKey].push(tx);

               const amt = parseFloat(tx.amount.replace(/[,+]/g, ''));
               if (tx.type === 'income') groups[monthYear].income += amt;
               else groups[monthYear].expenses += Math.abs(amt);
          });

          return groups;
     }, [filteredTransactions, formatDate]);

     return (
          <SafeAreaView style={styles.container}>
               <StatusBar barStyle={'light-content'} />
               <Stack.Screen options={{ headerShown: false }} />

               {/* Header */}
               <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                         <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>History</Text>
                    <View style={{ width: 40 }} />
               </View>

               {/* @ts-ignore */}
               <ScrollView style={styles.body} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View>
                         {Object.keys(monthlyGroups).length === 0 ? (
                              <View style={styles.emptyContainer}>
                                   <Ionicons name="receipt-outline" size={64} color="#222" />
                                   <Text style={styles.emptyText}>No transactions found</Text>
                              </View>
                         ) : (
                              Object.keys(monthlyGroups).map(month => (
                                   <View key={month} style={styles.monthSection}>
                                        <View style={styles.monthHeaderRow}>
                                             <Text style={styles.monthTitle}>{month}</Text>
                                             <View style={styles.monthSummary}>
                                                  <Text style={styles.incomeText}>+{formatCurrency(monthlyGroups[month].income)}</Text>
                                                  <Text style={styles.expenseText}>-{formatCurrency(monthlyGroups[month].expenses)}</Text>
                                             </View>
                                        </View>
                                        {Object.keys(monthlyGroups[month].days).map(day => (
                                             <Card key={day} title={day} transactions={monthlyGroups[month].days[day]} />
                                        ))}
                                   </View>
                              ))
                         )}
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
     scrollContent: {
          padding: 20,
          paddingBottom: 40,
     },
     monthSection: {
          marginBottom: 32,
     },
     monthHeaderRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          paddingBottom: 8,
          borderBottomWidth: 1,
          borderBottomColor: '#1A1A1A',
     },
     monthTitle: {
          fontSize: 16,
          fontWeight: '800',
          color: '#FFF',
     },
     monthSummary: {
          alignItems: 'flex-end',
     },
     incomeText: {
          fontSize: 11,
          color: '#4caf50',
          fontWeight: '700',
     },
     expenseText: {
          fontSize: 11,
          color: '#f44336',
          fontWeight: '700',
          marginTop: 2,
     },
     emptyContainer: {
          alignItems: 'center',
          paddingTop: 100,
     },
     emptyText: {
          color: '#444',
          fontSize: 14,
          marginTop: 16,
          fontWeight: '600',
     }
});
