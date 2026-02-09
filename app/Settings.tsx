import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { CURRENCIES, DATE_FORMATS, useTransactions } from '../context/TransactionContext';

export default function Settings() {
     const router = useRouter();
     const { logout } = useAuth();
     const { currency, setCurrency, dateFormat, setDateFormat } = useTransactions();
     const [notifications, setNotifications] = useState(true);
     const [biometrics, setBiometrics] = useState(false);

     const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
     const [dateModalVisible, setDateModalVisible] = useState(false);

     const handleLogout = async () => {
          Alert.alert(
               "Logout",
               "Are you sure you want to log out?",
               [
                    { text: "Cancel", style: "cancel" },
                    {
                         text: "Logout",
                         style: "destructive",
                         onPress: async () => {
                              await logout();
                              router.replace('/Frontscreen');
                         }
                    }
               ]
          );
     };

     const showPlaceholderAlert = (feature: string) => {
          Alert.alert("Information", `${feature} will be available in the next version.`);
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
                    <Text style={styles.headerTitle}>Settings</Text>
                    <View style={{ width: 40 }} />
               </View>

               {/* @ts-ignore */}
               <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                         <View style={styles.section}>
                              <Text style={styles.sectionTitle}>General</Text>

                              <View style={styles.settingItem}>
                                   <View style={styles.settingInfo}>
                                        <Ionicons name="notifications-outline" size={22} color="#AAA" />
                                        <Text style={styles.settingLabel}>Push Notifications</Text>
                                   </View>
                                   <Switch
                                        value={notifications}
                                        onValueChange={setNotifications}
                                        trackColor={{ false: '#222', true: '#8ac751' }}
                                        thumbColor={notifications ? '#FFF' : '#AAA'}
                                   />
                              </View>
                         </View>

                         <View style={styles.section}>
                              <Text style={styles.sectionTitle}>Currency & Region</Text>
                              <TouchableOpacity style={styles.menuItem} onPress={() => setCurrencyModalVisible(true)}>
                                   <Text style={styles.menuLabel}>Currency</Text>
                                   <View style={styles.menuRight}>
                                        <Text style={styles.menuValue}>{currency.label} ({currency.symbol})</Text>
                                        <Ionicons name="chevron-forward" size={18} color="#444" />
                                   </View>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.menuItem} onPress={() => setDateModalVisible(true)}>
                                   <Text style={styles.menuLabel}>Date Format</Text>
                                   <View style={styles.menuRight}>
                                        <Text style={styles.menuValue}>{dateFormat}</Text>
                                        <Ionicons name="chevron-forward" size={18} color="#444" />
                                   </View>
                              </TouchableOpacity>
                         </View>

                         <View style={styles.section}>
                              <Text style={styles.sectionTitle}>About</Text>
                              <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/Terms')}>
                                   <Text style={styles.menuLabel}>Terms of Service</Text>
                                   <Ionicons name="chevron-forward" size={18} color="#444" />
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/Privacy')}>
                                   <Text style={styles.menuLabel}>Privacy Policy</Text>
                                   <Ionicons name="chevron-forward" size={18} color="#444" />
                              </TouchableOpacity>
                         </View>

                         <View style={styles.section}>
                              <Text style={styles.sectionTitle}>Account</Text>
                              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                                   <View style={styles.settingInfo}>
                                        <Ionicons name="log-out-outline" size={22} color="#FF4444" />
                                        <Text style={styles.logoutLabel}>Log Out</Text>
                                   </View>
                              </TouchableOpacity>
                         </View>

                         <Text style={styles.versionInfo}>BuddyPay Version 1.0.0 (Build 124)</Text>
                    </View>
               </ScrollView>

               {/* Currency Modal */}
               <Modal
                    animationType="slide"
                    transparent={true}
                    visible={currencyModalVisible}
                    onRequestClose={() => setCurrencyModalVisible(false)}
               >
                    <View style={styles.modalOverlay}>
                         <View style={styles.modalContent}>
                              <Text style={styles.modalTitle}>Choose Currency</Text>
                              {CURRENCIES.map(curr => (
                                   <TouchableOpacity
                                        key={curr.code}
                                        style={[styles.optionItem, currency.code === curr.code && styles.selectedOption]}
                                        onPress={() => {
                                             setCurrency(curr);
                                             setCurrencyModalVisible(false);
                                        }}
                                   >
                                        <Text style={[styles.optionLabel, currency.code === curr.code && styles.selectedOptionText]}>
                                             {curr.label} ({curr.symbol})
                                        </Text>
                                        {currency.code === curr.code && <Ionicons name="checkmark" size={20} color="#8ac751" />}
                                   </TouchableOpacity>
                              ))}
                              <TouchableOpacity style={styles.closeBtn} onPress={() => setCurrencyModalVisible(false)}>
                                   <Text style={styles.closeBtnText}>Cancel</Text>
                              </TouchableOpacity>
                         </View>
                    </View>
               </Modal>

               {/* Date Format Modal */}
               <Modal
                    animationType="slide"
                    transparent={true}
                    visible={dateModalVisible}
                    onRequestClose={() => setDateModalVisible(false)}
               >
                    <View style={styles.modalOverlay}>
                         <View style={styles.modalContent}>
                              <Text style={styles.modalTitle}>Choose Date Format</Text>
                              {DATE_FORMATS.map(fmt => (
                                   <TouchableOpacity
                                        key={fmt}
                                        style={[styles.optionItem, dateFormat === fmt && styles.selectedOption]}
                                        onPress={() => {
                                             setDateFormat(fmt);
                                             setDateModalVisible(false);
                                        }}
                                   >
                                        <Text style={[styles.optionLabel, dateFormat === fmt && styles.selectedOptionText]}>
                                             {fmt}
                                        </Text>
                                        {dateFormat === fmt && <Ionicons name="checkmark" size={20} color="#8ac751" />}
                                   </TouchableOpacity>
                              ))}
                              <TouchableOpacity style={styles.closeBtn} onPress={() => setDateModalVisible(false)}>
                                   <Text style={styles.closeBtnText}>Cancel</Text>
                              </TouchableOpacity>
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
     section: {
          marginBottom: 35,
     },
     sectionTitle: {
          color: '#444',
          fontSize: 11,
          fontWeight: '800',
          textTransform: 'uppercase',
          marginBottom: 15,
          marginLeft: 10,
          letterSpacing: 1,
     },
     settingItem: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#111',
          padding: 16,
          borderRadius: 20,
          marginBottom: 10,
          borderWidth: 1,
          borderColor: '#1A1A1A',
     },
     settingInfo: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 15,
     },
     settingLabel: {
          color: '#FFF',
          fontSize: 15,
          fontWeight: '600',
     },
     menuItem: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#111',
          padding: 18,
          borderRadius: 20,
          marginBottom: 10,
          borderWidth: 1,
          borderColor: '#1A1A1A',
     },
     menuLabel: {
          color: '#EEE',
          fontSize: 15,
          fontWeight: '600',
     },
     menuRight: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
     },
     menuValue: {
          color: '#666',
          fontSize: 14,
          fontWeight: '600',
     },
     versionInfo: {
          color: '#222',
          textAlign: 'center',
          fontSize: 12,
          fontWeight: '700',
          marginTop: 10,
          marginBottom: 40,
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
     modalTitle: {
          color: '#FFF',
          fontSize: 20,
          fontWeight: '800',
          marginBottom: 25,
          textAlign: 'center',
     },
     optionItem: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 18,
          backgroundColor: '#1A1A1A',
          borderRadius: 16,
          marginBottom: 10,
          borderWidth: 1,
          borderColor: 'transparent',
     },
     selectedOption: {
          borderColor: '#8ac751',
          backgroundColor: '#8ac75110',
     },
     optionLabel: {
          color: '#AAA',
          fontSize: 16,
          fontWeight: '600',
     },
     selectedOptionText: {
          color: '#8ac751',
     },
     closeBtn: {
          padding: 18,
          alignItems: 'center',
          marginTop: 10,
     },
     closeBtnText: {
          color: '#666',
          fontSize: 16,
          fontWeight: '700',
     },
     logoutButton: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#1A0A0A',
          padding: 16,
          borderRadius: 20,
          marginBottom: 10,
          borderWidth: 1,
          borderColor: '#441111',
     },
     logoutLabel: {
          color: '#FF4444',
          fontSize: 15,
          fontWeight: '700',
     },
});

