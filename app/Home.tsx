import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';
import Card from './FInanceCard';

export default function Home() {
     const router = useRouter();
     const { user } = useAuth();
     const {
          filteredTransactions,
          balance,
          expenses,
          income,
          viewMode,
          setViewMode,
          monthlyEstimate,
          currentUser,
          formatCurrency,
          formatDate
     } = useTransactions();
     const [summaryType, setSummaryType] = React.useState<'daily' | 'monthly'>('daily');
     const [sidebarVisible, setSidebarVisible] = useState(false);

     React.useEffect(() => {
          if (!user) {
               router.replace("/Frontscreen");
          }
     }, [user]);

     if (!user) return null;

     const showAlert = (feat: string) => {
          Alert.alert("Coming Soon", `${feat} functionality will be added in the next update!`);
     };

     // Group transactions by date
     const groupedTransactions = React.useMemo(() => {
          const groups: { [key: string]: typeof filteredTransactions } = {};
          filteredTransactions.slice(0, 5).forEach(tx => {
               const date = formatDate(tx.date);
               if (!groups[date]) groups[date] = [];
               groups[date].push(tx);
          });
          return groups;
     }, [filteredTransactions, formatDate]);

     const displayData = summaryType === 'daily' ? { balance, expenses, income } : monthlyEstimate;

     return (
          <>
               <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

               <SafeAreaView style={styles.container}>
                    <StatusBar barStyle={'light-content'} />
                    <Stack.Screen options={{ headerShown: false }} />

                    {/* Header */}
                    <View style={styles.header}>
                         <View>
                              <Text style={styles.headerTitle}>BuddyPay<Text style={{ color: '#8ac751' }}>.</Text></Text>
                              <Text style={styles.viewModeLabel}>{viewMode === 'personal' ? 'My Wallet' : 'Shared Wallet'}</Text>
                         </View>
                         <View style={styles.headerRight}>
                              <TouchableOpacity
                                   style={[styles.iconButton, { backgroundColor: '#8ac75120' }]}
                                   onPress={() => setViewMode(viewMode === 'personal' ? 'shared' : 'personal')}
                              >
                                   <Ionicons name={viewMode === 'personal' ? "person-outline" : "people-outline"} size={20} color="#8ac751" />
                              </TouchableOpacity>
                              <TouchableOpacity
                                   style={styles.iconButton}
                                   onPress={() => router.push('/AddTransaction')}
                                   activeOpacity={0.7}
                              >
                                   <Ionicons name="add-outline" size={26} color="#8ac751" />
                              </TouchableOpacity>
                              <TouchableOpacity activeOpacity={0.7} onPress={() => setSidebarVisible(true)}>
                                   <View style={styles.avatar}>
                                        <Text style={styles.avatarText}>{currentUser.avatar}</Text>
                                   </View>
                              </TouchableOpacity>
                         </View>
                    </View>

                    {/* Body */}
                    {/* @ts-ignore - ScrollView children type issue in React 19/RN 0.81 */}
                    <ScrollView
                         style={styles.body}
                         showsVerticalScrollIndicator={false}
                         contentContainerStyle={styles.scrollContent}
                    >
                         <View>
                              {/* Summary Toggle */}
                              <View style={styles.summaryToggleRow}>
                                   <Text style={styles.sectionTitle}>{summaryType === 'daily' ? 'Today' : 'This Month'}</Text>
                                   <TouchableOpacity
                                        onPress={() => setSummaryType(summaryType === 'daily' ? 'monthly' : 'daily')}
                                        style={styles.summaryTypeButton}
                                   >
                                        <Text style={styles.summaryTypeText}>Switch to {summaryType === 'daily' ? 'Monthly' : 'Daily'}</Text>
                                   </TouchableOpacity>
                              </View>

                              {/* Financial Summary */}
                              <View style={styles.summaryContainer}>
                                   <View style={styles.summaryBox}>
                                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 82, 82, 0.12)' }]}>
                                             <Ionicons name="arrow-up-circle" size={24} color="#ff5252" />
                                        </View>
                                        <Text style={styles.summaryAmount}>{formatCurrency(displayData.expenses)}</Text>
                                        <Text style={styles.summaryLabel}>Spent</Text>
                                   </View>

                                   <View style={styles.summaryBox}>
                                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(7, 236, 110, 0.12)' }]}>
                                             <Ionicons name="wallet-outline" size={24} color="#07ec6e" />
                                        </View>
                                        <Text style={[styles.summaryAmount, { color: '#07ec6e' }]}>{formatCurrency(displayData.balance)}</Text>
                                        <Text style={styles.summaryLabel}>Balance</Text>
                                   </View>

                                   <View style={styles.summaryBox}>
                                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(68, 138, 255, 0.12)' }]}>
                                             <Ionicons name="arrow-down-circle" size={24} color="#448aff" />
                                        </View>
                                        <Text style={styles.summaryAmount}>{formatCurrency(displayData.income)}</Text>
                                        <Text style={styles.summaryLabel}>Income</Text>
                                   </View>
                              </View>

                              <View style={styles.sectionHeader}>
                                   <Text style={styles.sectionTitle}>Transactions</Text>
                                   <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/AllTransactions')}>
                                        <Text style={styles.seeAllText}>See all</Text>
                                   </TouchableOpacity>
                              </View>

                              {Object.keys(groupedTransactions).map(date => (
                                   <Card key={date} title={date} transactions={groupedTransactions[date]} />
                              ))}

                              {filteredTransactions.length === 0 && (
                                   <View style={styles.emptyContainer}>
                                        <Ionicons name="receipt-outline" size={48} color="#333" />
                                        <Text style={styles.emptyText}>No transactions in {viewMode} view</Text>
                                   </View>
                              )}
                         </View>
                    </ScrollView>
               </SafeAreaView>
          </>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: "#080808",
     },
     header: {
          height: 80,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: "center",
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#1A1A1A',
     },
     headerTitle: {
          fontSize: 22,
          fontWeight: '800',
          color: '#fff',
          letterSpacing: -0.8,
     },
     viewModeLabel: {
          fontSize: 12,
          color: '#8ac751',
          fontWeight: '600',
          textTransform: 'uppercase',
          marginTop: 2,
     },
     headerRight: {
          flexDirection: 'row',
          alignItems: 'center',
     },
     iconButton: {
          marginRight: 10,
          padding: 8,
          borderRadius: 14,
          backgroundColor: '#161616',
     },
     avatar: {
          width: 38,
          height: 38,
          backgroundColor: '#8ac751',
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
     },
     avatarText: {
          fontSize: 13,
          fontWeight: '800',
          color: '#000',
     },
     body: {
          flex: 1,
     },
     scrollContent: {
          padding: 20,
          paddingBottom: 40,
     },
     summaryToggleRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
     },
     summaryTypeButton: {
          backgroundColor: '#161616',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#1E1E1E',
     },
     summaryTypeText: {
          fontSize: 12,
          color: '#8ac751',
          fontWeight: '700',
     },
     summaryContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 32,
          gap: 12,
     },
     summaryBox: {
          flex: 1,
          alignItems: 'center',
          backgroundColor: '#121212',
          paddingVertical: 20,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: '#1E1E1E',
     },
     iconContainer: {
          width: 44,
          height: 44,
          borderRadius: 14,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 12,
     },
     summaryAmount: {
          fontSize: 15,
          fontWeight: '800',
          color: '#fff',
     },
     summaryLabel: {
          fontSize: 10,
          color: '#666',
          marginTop: 4,
          fontWeight: '600',
          textTransform: 'uppercase',
     },
     sectionHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
     },
     sectionTitle: {
          fontSize: 18,
          fontWeight: '700',
          color: '#fff',
     },
     seeAllText: {
          fontSize: 14,
          color: '#8ac751',
          fontWeight: '600',
     },
     emptyContainer: {
          alignItems: 'center',
          paddingTop: 60,
     },
     emptyText: {
          color: '#444',
          fontSize: 14,
          marginTop: 12,
          fontWeight: '600',
     }
});
