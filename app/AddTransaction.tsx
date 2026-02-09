import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';

const CATEGORIES = [
     { id: '1', name: 'Food', icon: 'fast-food-outline', color: '#FF9500' },
     { id: '2', name: 'Transport', icon: 'bus-outline', color: '#5856D6' },
     { id: '3', name: 'Shopping', icon: 'cart-outline', color: '#FF2D55' },
     { id: '4', name: 'Health', icon: 'medical-outline', color: '#4CD964' },
     { id: '5', name: 'Leisure', icon: 'cafe-outline', color: '#AF52DE' },
     { id: '6', name: 'Others', icon: 'grid-outline', color: '#8E8E93' },
];

export default function AddTransaction() {
     const router = useRouter();
     const { user } = useAuth();
     const { addTransaction, currency } = useTransactions();

     React.useEffect(() => {
          if (!user) {
               router.replace("/Frontscreen");
          }
     }, [user]);

     if (!user) return null;
     const [type, setType] = useState<'expense' | 'income'>('expense');
     const [amount, setAmount] = useState('');
     const [title, setTitle] = useState('');
     const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);

     const handleSave = () => {
          if (!amount || isNaN(parseFloat(amount))) {
               Alert.alert('Error', 'Please enter a valid amount');
               return;
          }
          if (!title.trim()) {
               Alert.alert('Error', 'Please enter a title');
               return;
          }

          const category = CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0];

          addTransaction({
               title: title.trim(),
               amount: amount,
               category: category.name,
               icon: category.icon,
               color: category.color,
               type: type,
          });

          router.back();
     };

     return (
          <SafeAreaView style={styles.container}>
               <StatusBar barStyle="light-content" />

               {/* Header */}
               <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                         <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Add Transaction</Text>
                    <View style={{ width: 40 }} />
               </View>

               {/* @ts-ignore - ScrollView children type issue in React 19/RN 0.81 */}
               <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View>
                         {/* Type Toggle */}
                         <View style={styles.toggleContainer}>
                              <TouchableOpacity
                                   style={[styles.toggleButton, type === 'expense' && styles.activeToggleExpense]}
                                   onPress={() => setType('expense')}
                              >
                                   <Text style={[styles.toggleText, type === 'expense' && styles.activeToggleText]}>Expense</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                   style={[styles.toggleButton, type === 'income' && styles.activeToggleIncome]}
                                   onPress={() => setType('income')}
                              >
                                   <Text style={[styles.toggleText, type === 'income' && styles.activeToggleText]}>Income</Text>
                              </TouchableOpacity>
                         </View>

                         {/* Amount Section */}
                         <View style={styles.amountContainer}>
                              <Text style={styles.label}>Amount</Text>
                              <View style={styles.amountInputRow}>
                                   <Text style={styles.currencySymbol}>{currency.symbol}</Text>
                                   <TextInput
                                        style={styles.amountInput}
                                        value={amount}
                                        onChangeText={setAmount}
                                        placeholder="0"
                                        placeholderTextColor="#333"
                                        keyboardType="numeric"
                                        autoFocus
                                   />
                              </View>
                         </View>

                         {/* Details Section */}
                         <View style={styles.inputSection}>
                              <Text style={styles.label}>Title</Text>
                              <TextInput
                                   style={styles.input}
                                   value={title}
                                   onChangeText={setTitle}
                                   placeholder="What was this for?"
                                   placeholderTextColor="#555"
                              />
                         </View>

                         {/* Category Section */}
                         <View style={styles.categorySection}>
                              <Text style={styles.label}>Category</Text>
                              <View style={styles.categoryGrid}>
                                   {CATEGORIES.map((cat) => (
                                        <TouchableOpacity
                                             key={cat.id}
                                             style={[
                                                  styles.categoryItem,
                                                  selectedCategory === cat.id && { backgroundColor: cat.color + '25', borderColor: cat.color }
                                             ]}
                                             onPress={() => setSelectedCategory(cat.id)}
                                        >
                                             <View style={[styles.catIconBox, { backgroundColor: cat.color + '20' }]}>
                                                  <Ionicons name={cat.icon as any} size={20} color={cat.color} />
                                             </View>
                                             <Text style={[styles.categoryName, selectedCategory === cat.id && { color: cat.color }]}>
                                                  {cat.name}
                                             </Text>
                                        </TouchableOpacity>
                                   ))}
                              </View>
                         </View>

                         {/* Submit Button */}
                         <TouchableOpacity
                              style={[styles.submitButton, { backgroundColor: type === 'expense' ? '#FF3B30' : '#4CD964' }]}
                              onPress={handleSave}
                              activeOpacity={0.8}
                         >
                              <Text style={styles.submitButtonText}>Save Transaction</Text>
                         </TouchableOpacity>
                    </View>
               </ScrollView>
          </SafeAreaView>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#080808',
     },
     header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          height: 70,
          borderBottomWidth: 1,
          borderBottomColor: '#1A1A1A',
     },
     backButton: {
          padding: 6,
          borderRadius: 12,
          backgroundColor: '#161616',
     },
     headerTitle: {
          fontSize: 20,
          fontWeight: '800',
          color: '#FFF',
          letterSpacing: -0.5,
     },
     scrollContent: {
          padding: 20,
          paddingBottom: 40,
     },
     toggleContainer: {
          flexDirection: 'row',
          backgroundColor: '#1E1E1E',
          borderRadius: 14,
          padding: 4,
          marginBottom: 30,
     },
     toggleButton: {
          flex: 1,
          paddingVertical: 12,
          alignItems: 'center',
          borderRadius: 10,
     },
     activeToggleExpense: {
          backgroundColor: '#FF3B30',
     },
     activeToggleIncome: {
          backgroundColor: '#4CD964',
     },
     toggleText: {
          fontSize: 16,
          fontWeight: '600',
          color: '#8e8e93',
     },
     activeToggleText: {
          color: '#FFF',
     },
     amountContainer: {
          alignItems: 'center',
          marginBottom: 40,
     },
     label: {
          fontSize: 14,
          color: '#8e8e93',
          marginBottom: 10,
          alignSelf: 'flex-start',
          fontWeight: '600',
          textTransform: 'uppercase',
     },
     amountInputRow: {
          flexDirection: 'row',
          alignItems: 'baseline',
     },
     currencySymbol: {
          fontSize: 24,
          fontWeight: '700',
          color: '#FFF',
          marginRight: 8,
     },
     amountInput: {
          fontSize: 48,
          fontWeight: '800',
          color: '#FFF',
          minWidth: 100,
          textAlign: 'center',
     },
     inputSection: {
          marginBottom: 30,
     },
     input: {
          backgroundColor: '#1E1E1E',
          borderRadius: 16,
          padding: 18,
          fontSize: 16,
          color: '#FFF',
          borderWidth: 1,
          borderColor: '#2C2C2C',
     },
     categorySection: {
          marginBottom: 40,
     },
     categoryGrid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 12,
     },
     categoryItem: {
          width: '30%',
          backgroundColor: '#1E1E1E',
          borderRadius: 16,
          padding: 12,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: 'transparent',
     },
     catIconBox: {
          width: 40,
          height: 40,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 8,
     },
     categoryName: {
          fontSize: 12,
          fontWeight: '600',
          color: '#8e8e93',
     },
     submitButton: {
          borderRadius: 18,
          paddingVertical: 18,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 6,
          marginBottom: 40,
     },
     submitButtonText: {
          color: '#FFF',
          fontSize: 18,
          fontWeight: '800',
     }
});
