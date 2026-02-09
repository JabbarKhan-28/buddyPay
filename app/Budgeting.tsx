import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTransactions } from '../context/TransactionContext';

export default function Budgeting() {
     const router = useRouter();
     const { monthlyBudget, expenses, budgetProgress, goals, addGoal, formatCurrency } = useTransactions();
     const [modalVisible, setModalVisible] = useState(false);
     const [newGoal, setNewGoal] = useState({ name: '', target: '', icon: 'star-outline', color: '#8ac751' });

     const remaining = monthlyBudget - expenses;

     const handleAddGoal = () => {
          if (!newGoal.name || !newGoal.target) {
               Alert.alert("Error", "Please fill in all fields");
               return;
          }
          addGoal({
               name: newGoal.name,
               target: parseFloat(newGoal.target),
               icon: newGoal.icon,
               color: newGoal.color
          });
          setModalVisible(false);
          setNewGoal({ name: '', target: '', icon: 'star-outline', color: '#8ac751' });
     };

     return (
          <SafeAreaView style={styles.container}>
               <StatusBar barStyle={'light-content'} />
               <Stack.Screen options={{ headerShown: false }} />

               {/* Header */}
               <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                         <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Budget & Goals</Text>
                    <TouchableOpacity onPress={() => router.push('/Profile')}>
                         <Ionicons name="pencil" size={20} color="#8ac751" />
                    </TouchableOpacity>
               </View>

               {/* @ts-ignore */}
               <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                         {/* Main Progress Card */}
                         <View style={styles.progressCard}>
                              <Text style={styles.cardLabel}>Monthly Spending Limit</Text>
                              <Text style={styles.budgetAmount}>{formatCurrency(monthlyBudget)}</Text>

                              <View style={styles.progressBarBg}>
                                   <View style={[styles.progressBarFill, { width: `${Math.min(budgetProgress * 100, 100)}%` }]} />
                              </View>

                              <View style={styles.cardFooter}>
                                   <View>
                                        <Text style={styles.footerLabel}>Spent</Text>
                                        <Text style={styles.footerValue}>{formatCurrency(expenses)}</Text>
                                   </View>
                                   <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={styles.footerLabel}>Remaining</Text>
                                        <Text style={[styles.footerValue, { color: remaining < 0 ? '#ff4444' : '#8ac751' }]}>
                                             {formatCurrency(remaining)}
                                        </Text>
                                   </View>
                              </View>
                         </View>

                         {/* Goals Section */}
                         <View style={styles.section}>
                              <Text style={styles.sectionTitle}>Financial Goals</Text>
                              {goals.map(goal => {
                                   const progress = Math.min((goal.current / goal.target) * 100, 100);
                                   return (
                                        <View key={goal.id} style={styles.goalItem}>
                                             <View style={styles.goalIcon}>
                                                  <Ionicons name={goal.icon as any} size={24} color={goal.color} />
                                             </View>
                                             <View style={styles.goalInfo}>
                                                  <Text style={styles.goalName}>{goal.name}</Text>
                                                  <Text style={styles.goalTarget}>Target: {formatCurrency(goal.target)}</Text>
                                                  <View style={styles.miniProgressBg}>
                                                       <View style={[styles.miniProgressFill, { width: `${progress}%`, backgroundColor: goal.color }]} />
                                                  </View>
                                             </View>
                                             <Text style={styles.goalPercent}>{Math.round(progress)}%</Text>
                                        </View>
                                   );
                              })}
                         </View>

                         <TouchableOpacity style={styles.addGoalBtn} onPress={() => setModalVisible(true)}>
                              <Ionicons name="add" size={20} color="#000" />
                              <Text style={styles.addGoalText}>Create New Goal</Text>
                         </TouchableOpacity>
                    </View>
               </ScrollView>

               {/* New Goal Modal */}
               <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
               >
                    <View style={styles.modalOverlay}>
                         <View style={styles.modalContent}>
                              <View style={styles.modalHeader}>
                                   <Text style={styles.modalTitle}>New Financial Goal</Text>
                                   <TouchableOpacity onPress={() => setModalVisible(false)}>
                                        <Ionicons name="close" size={24} color="#FFF" />
                                   </TouchableOpacity>
                              </View>

                              <View style={styles.form}>
                                   <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Goal Name</Text>
                                        <TextInput
                                             style={styles.input}
                                             value={newGoal.name}
                                             onChangeText={(t) => setNewGoal(p => ({ ...p, name: t }))}
                                             placeholder="e.g. Dream House"
                                             placeholderTextColor="#555"
                                        />
                                   </View>

                                   <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Target Amount (PKR)</Text>
                                        <TextInput
                                             style={styles.input}
                                             value={newGoal.target}
                                             onChangeText={(t) => setNewGoal(p => ({ ...p, target: t }))}
                                             placeholder="0.00"
                                             placeholderTextColor="#555"
                                             keyboardType="numeric"
                                        />
                                   </View>

                                   <TouchableOpacity style={styles.submitBtn} onPress={handleAddGoal}>
                                        <Text style={styles.submitBtnText}>Create Goal</Text>
                                   </TouchableOpacity>
                              </View>
                         </View>
                    </View>
               </Modal>
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
     progressCard: {
          backgroundColor: '#161616',
          borderRadius: 28,
          padding: 24,
          marginBottom: 30,
          borderWidth: 1,
          borderColor: '#1E1E1E',
     },
     cardLabel: {
          color: '#666',
          fontSize: 12,
          fontWeight: '700',
          textTransform: 'uppercase',
          marginBottom: 8,
     },
     budgetAmount: {
          color: '#FFF',
          fontSize: 28,
          fontWeight: '900',
          marginBottom: 20,
     },
     progressBarBg: {
          height: 12,
          backgroundColor: '#111',
          borderRadius: 6,
          marginBottom: 20,
          overflow: 'hidden',
     },
     progressBarFill: {
          height: '100%',
          backgroundColor: '#8ac751',
          borderRadius: 6,
     },
     cardFooter: {
          flexDirection: 'row',
          justifyContent: 'space-between',
     },
     footerLabel: {
          color: '#444',
          fontSize: 11,
          fontWeight: '700',
          textTransform: 'uppercase',
          marginBottom: 4,
     },
     footerValue: {
          color: '#FFF',
          fontSize: 15,
          fontWeight: '700',
     },
     section: {
          marginBottom: 30,
     },
     sectionTitle: {
          color: '#FFF',
          fontSize: 18,
          fontWeight: '800',
          marginBottom: 20,
     },
     goalItem: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#121212',
          padding: 16,
          borderRadius: 20,
          marginBottom: 15,
          borderWidth: 1,
          borderColor: '#1E1E1E',
     },
     goalIcon: {
          width: 48,
          height: 48,
          backgroundColor: '#1A1A1A',
          borderRadius: 14,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 15,
     },
     goalInfo: {
          flex: 1,
     },
     goalName: {
          color: '#FFF',
          fontSize: 15,
          fontWeight: '700',
          marginBottom: 4,
     },
     goalTarget: {
          color: '#555',
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 8,
     },
     miniProgressBg: {
          height: 4,
          backgroundColor: '#111',
          borderRadius: 2,
     },
     miniProgressFill: {
          height: '100%',
          backgroundColor: '#8ac751',
          borderRadius: 2,
     },
     goalPercent: {
          color: '#666',
          fontSize: 13,
          fontWeight: '800',
          marginLeft: 15,
     },
     addGoalBtn: {
          backgroundColor: '#8ac751',
          borderRadius: 18,
          padding: 18,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
     },
     addGoalText: {
          color: '#000',
          fontSize: 16,
          fontWeight: '800',
     },
     modalOverlay: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.85)',
          justifyContent: 'flex-end',
     },
     modalContent: {
          backgroundColor: '#121212',
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          padding: 24,
          paddingBottom: 40,
          borderTopWidth: 1,
          borderTopColor: '#222',
     },
     modalHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 30,
     },
     modalTitle: {
          color: '#FFF',
          fontSize: 20,
          fontWeight: '800',
     },
     form: {
          gap: 20,
     },
     inputGroup: {
          gap: 10,
     },
     label: {
          color: '#666',
          fontSize: 12,
          fontWeight: '700',
          textTransform: 'uppercase',
          marginLeft: 4,
     },
     input: {
          backgroundColor: '#1A1A1A',
          borderRadius: 16,
          padding: 16,
          color: '#FFF',
          fontSize: 16,
          fontWeight: '600',
          borderWidth: 1,
          borderColor: '#222',
     },
     submitBtn: {
          backgroundColor: '#8ac751',
          borderRadius: 18,
          padding: 18,
          alignItems: 'center',
          marginTop: 10,
     },
     submitBtnText: {
          color: '#000',
          fontSize: 16,
          fontWeight: '800',
     }
});

