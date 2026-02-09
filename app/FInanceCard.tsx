import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTransactions } from '../context/TransactionContext';

export type Transaction = {
     id: string;
     title: string;
     amount: string;
     category: string;
     icon: string;
     color: string;
     type: 'expense' | 'income';
     date?: string;
};

interface CardProps {
     transactions: Transaction[];
     title?: string;
}

export default function Card({ transactions, title }: CardProps) {
     const { formatCurrency } = useTransactions();

     return (
          <View style={styles.card}>
               {title && <Text style={styles.cardTitle}>{title}</Text>}
               <View style={styles.list}>
                    {transactions.map((item, index) => (
                         <View
                              key={item.id}
                              style={[
                                   styles.transactionItem,
                                   index === transactions.length - 1 && { borderBottomWidth: 0 }
                              ]}
                         >
                              <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
                                   <Ionicons name={item.icon as any} size={22} color={item.color} />
                              </View>
                              <View style={styles.details}>
                                   <Text style={styles.title}>{item.title}</Text>
                                   <Text style={styles.category}>{item.category}</Text>
                              </View>
                              <Text style={[
                                   styles.amount,
                                   { color: item.type === 'income' ? '#4caf50' : '#f44336' }
                              ]}>
                                   {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                              </Text>
                         </View>
                    ))}
               </View>
               {transactions.length === 0 && (
                    <View style={styles.emptyContainer}>
                         <Text style={styles.emptyText}>No transactions yet</Text>
                    </View>
               )}
          </View>
     );
}


const styles = StyleSheet.create({
     card: {
          backgroundColor: "#121212",
          borderRadius: 24,
          padding: 16,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#1E1E1E',
     },
     cardTitle: {
          fontSize: 13,
          color: '#555',
          fontWeight: '800',
          textTransform: 'uppercase',
          marginBottom: 12,
          marginLeft: 4,
          letterSpacing: 1,
     },
     list: {
          width: '100%',
     },
     transactionItem: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#1E1E1E',
     },
     iconBox: {
          width: 44,
          height: 44,
          borderRadius: 14,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 15,
     },
     details: {
          flex: 1,
     },
     title: {
          fontSize: 15,
          fontWeight: '700',
          color: '#FFFFFF',
     },
     category: {
          fontSize: 12,
          color: '#666',
          marginTop: 2,
     },
     amount: {
          fontSize: 15,
          fontWeight: '800',
     },
     emptyContainer: {
          padding: 20,
          alignItems: 'center',
     },
     emptyText: {
          color: '#444',
          fontSize: 14,
          fontWeight: '600',
     }
});
