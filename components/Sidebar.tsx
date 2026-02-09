import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

interface SidebarProps {
     visible: boolean;
     onClose: () => void;
}

export default function Sidebar({ visible, onClose }: SidebarProps) {
     const router = useRouter();
     const { logout } = useAuth();
     const { currentUser, budgetProgress, monthlyBudget, expenses } = useTransactions();

     const animatedStyle = useAnimatedStyle(() => {
          return {
               transform: [
                    { translateX: withSpring(visible ? 0 : -SIDEBAR_WIDTH, { damping: 20, stiffness: 100 }) }
               ],
          };
     });

     const backdropStyle = useAnimatedStyle(() => {
          return {
               opacity: withTiming(visible ? 1 : 0),
               zIndex: visible ? 99 : -1,
          };
     });

     const handleNav = (path: string) => {
          onClose();
          router.push(path as any);
     };

     const handleLogout = async () => {
          onClose();
          await logout();
          router.replace('/Frontscreen');
     };

     return (
          <>
               {/* Backdrop */}
               {/* @ts-ignore */}
               <Animated.View style={[styles.backdrop, backdropStyle]}>
                    <Pressable style={{ flex: 1 }} onPress={onClose} />
               </Animated.View>

               {/* Sidebar */}
               {/* @ts-ignore */}
               <Animated.View style={[styles.sidebar, animatedStyle]}>
                    <View style={styles.content}>
                         {/* Profile Header */}
                         <View style={styles.profileHeader}>
                              <View style={styles.avatar}>
                                   <Text style={styles.avatarText}>{currentUser.avatar}</Text>
                              </View>
                              <View style={styles.profileInfo}>
                                   <Text style={styles.userName}>{currentUser.name}</Text>
                                   <Text style={styles.userEmail}>{currentUser.email}</Text>
                              </View>
                         </View>

                         {/* Budget Section */}
                         <View style={styles.budgetSection}>
                              <View style={styles.budgetHeader}>
                                   <Text style={styles.budgetTitle}>Monthly Budget</Text>
                                   <Text style={styles.budgetValue}>{Math.round(budgetProgress * 100)}%</Text>
                              </View>
                              <View style={styles.progressBarBg}>
                                   <View style={[styles.progressBarFill, { width: `${budgetProgress * 100}%` }]} />
                              </View>
                              <Text style={styles.budgetSubtitle}>
                                   PKR {expenses.toLocaleString()} of PKR {monthlyBudget.toLocaleString()}
                              </Text>
                         </View>

                         {/* Menu Items */}
                         <View style={styles.menu}>
                              <TouchableOpacity style={styles.menuItem} onPress={() => handleNav('/Profile')}>
                                   <Ionicons name="person-outline" size={22} color="#fff" />
                                   <Text style={styles.menuText}>Edit Profile</Text>
                              </TouchableOpacity>

                              <TouchableOpacity style={styles.menuItem} onPress={() => handleNav('/AllTransactions')}>
                                   <Ionicons name="receipt-outline" size={22} color="#fff" />
                                   <Text style={styles.menuText}>Transaction History</Text>
                              </TouchableOpacity>

                              <TouchableOpacity style={styles.menuItem} onPress={() => handleNav('/Budgeting')}>
                                   <Ionicons name="wallet-outline" size={22} color="#fff" />
                                   <Text style={styles.menuText}>Budget & Goals</Text>
                              </TouchableOpacity>

                              <TouchableOpacity style={styles.menuItem} onPress={() => handleNav('/Analytics')}>
                                   <Ionicons name="analytics-outline" size={22} color="#fff" />
                                   <Text style={styles.menuText}>Spending Insights</Text>
                              </TouchableOpacity>

                              <View style={styles.divider} />

                              <TouchableOpacity style={styles.menuItem} onPress={() => handleNav('/Settings')}>
                                   <Ionicons name="settings-outline" size={22} color="#fff" />
                                   <Text style={styles.menuText}>Settings</Text>
                              </TouchableOpacity>

                              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                                   <Ionicons name="log-out-outline" size={22} color="#ff4444" />
                                   <Text style={[styles.menuText, { color: '#ff4444' }]}>Log Out</Text>
                              </TouchableOpacity>
                         </View>
                    </View>

                    <View style={styles.footer}>
                         <Text style={styles.footerText}>BuddyPay v1.0.0</Text>
                         <Text style={styles.footerSub}>Powered by Smart Wallet</Text>
                    </View>
               </Animated.View>
          </>
     );
}

const styles = StyleSheet.create({
     backdrop: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0,0,0,0.8)',
     },
     sidebar: {
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: SIDEBAR_WIDTH,
          backgroundColor: '#121212',
          zIndex: 100,
          paddingTop: 60,
          paddingBottom: 30,
          borderRightWidth: 1,
          borderRightColor: '#1E1E1E',
     },
     content: {
          flex: 1,
          paddingHorizontal: 20,
     },
     profileHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 35,
     },
     avatar: {
          width: 54,
          height: 54,
          backgroundColor: '#8ac751',
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 15,
     },
     avatarText: {
          fontSize: 20,
          fontWeight: '800',
          color: '#000',
     },
     profileInfo: {
          flex: 1,
     },
     userName: {
          fontSize: 18,
          fontWeight: '800',
          color: '#fff',
     },
     userEmail: {
          fontSize: 12,
          color: '#666',
          marginTop: 2,
     },
     budgetSection: {
          backgroundColor: '#161616',
          padding: 16,
          borderRadius: 20,
          marginBottom: 30,
          borderWidth: 1,
          borderColor: '#1E1E1E',
     },
     budgetHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
     },
     budgetTitle: {
          fontSize: 13,
          fontWeight: '700',
          color: '#8e8e93',
          textTransform: 'uppercase',
     },
     budgetValue: {
          fontSize: 13,
          fontWeight: '800',
          color: '#8ac751',
     },
     progressBarBg: {
          height: 6,
          backgroundColor: '#222',
          borderRadius: 3,
          marginBottom: 8,
          overflow: 'hidden',
     },
     progressBarFill: {
          height: '100%',
          backgroundColor: '#8ac751',
          borderRadius: 3,
     },
     budgetSubtitle: {
          fontSize: 11,
          color: '#555',
          fontWeight: '600',
     },
     menu: {
          marginTop: 10,
     },
     menuItem: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 14,
     },
     menuText: {
          fontSize: 16,
          fontWeight: '600',
          color: '#fff',
          marginLeft: 15,
     },
     divider: {
          height: 1,
          backgroundColor: '#1E1E1E',
          marginVertical: 15,
     },
     footer: {
          paddingHorizontal: 20,
          alignItems: 'center',
     },
     footerText: {
          fontSize: 12,
          color: '#444',
          fontWeight: '700',
     },
     footerSub: {
          fontSize: 10,
          color: '#333',
          marginTop: 4,
          fontWeight: '600',
     },
});
