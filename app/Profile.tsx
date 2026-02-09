import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTransactions } from '../context/TransactionContext';

export default function Profile() {
     const router = useRouter();
     const { currentUser, updateProfile, monthlyBudget, setMonthlyBudget, currency } = useTransactions();

     const [name, setName] = useState(currentUser.name);
     const [email, setEmail] = useState(currentUser.email);
     const [budget, setBudget] = useState(monthlyBudget.toString());
     const [avatar, setAvatar] = useState(currentUser.avatar);
     const [avatarModalVisible, setAvatarModalVisible] = useState(false);

     const handleSave = () => {
          const budgetNum = parseFloat(budget);
          if (isNaN(budgetNum) || budgetNum < 0) {
               Alert.alert("Invalid Input", "Please enter a valid budget amount.");
               return;
          }

          updateProfile({ name, email, avatar });
          setMonthlyBudget(budgetNum);
          Alert.alert("Success", "Profile updated successfully!");
          router.back();
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
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <TouchableOpacity onPress={handleSave}>
                         <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
               </View>

               {/* @ts-ignore */}
               <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                         {/* Avatar Section */}
                         <View style={styles.avatarSection}>
                              <View style={styles.avatarContainer}>
                                   <Text style={styles.avatarText}>{avatar}</Text>
                                   <TouchableOpacity
                                        style={styles.editAvatarBtn}
                                        onPress={() => setAvatarModalVisible(true)}
                                   >
                                        <Ionicons name="camera" size={16} color="#000" />
                                   </TouchableOpacity>
                              </View>
                              <Text style={styles.joinedText}>Joined {currentUser.joiningDate}</Text>
                         </View>

                         {/* Form */}
                         <View style={styles.form}>
                              <View style={styles.inputGroup}>
                                   <Text style={styles.label}>Full Name</Text>
                                   <TextInput
                                        style={styles.input}
                                        value={name}
                                        onChangeText={setName}
                                        placeholder="Enter your name"
                                        placeholderTextColor="#555"
                                   />
                              </View>

                              <View style={styles.inputGroup}>
                                   <Text style={styles.label}>Email Address</Text>
                                   <TextInput
                                        style={styles.input}
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder="Enter your email"
                                        placeholderTextColor="#555"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                   />
                              </View>

                              <View style={styles.divider} />

                              <View style={styles.inputGroup}>
                                   <Text style={styles.label}>Monthly Budget ({currency.label})</Text>
                                   <TextInput
                                        style={styles.input}
                                        value={budget}
                                        onChangeText={setBudget}
                                        placeholder="Enter budget limit"
                                        placeholderTextColor="#555"
                                        keyboardType="numeric"
                                   />
                                   <Text style={styles.hint}>This will be used to track your spending progress.</Text>
                              </View>
                         </View>

                         <TouchableOpacity
                              style={styles.logoutBtn}
                              onPress={() => router.replace('/Frontscreen')}
                         >
                              <Text style={styles.logoutText}>Log Out</Text>
                         </TouchableOpacity>
                    </View>
               </ScrollView>

               {/* Avatar Picker Modal */}
               <Modal
                    animationType="fade"
                    transparent={true}
                    visible={avatarModalVisible}
                    onRequestClose={() => setAvatarModalVisible(false)}
               >
                    <View style={styles.modalOverlay}>
                         <View style={styles.modalContent}>
                              <Text style={styles.modalTitle}>Change Avatar</Text>
                              <View style={styles.avatarGrid}>
                                   {['JD', '😎', '👨‍💻', '🚀', '💰', '🏠'].map(item => (
                                        <TouchableOpacity
                                             key={item}
                                             style={[styles.avatarOption, avatar === item && styles.selectedOption]}
                                             onPress={() => {
                                                  setAvatar(item);
                                                  setAvatarModalVisible(false);
                                             }}
                                        >
                                             <Text style={styles.optionText}>{item}</Text>
                                        </TouchableOpacity>
                                   ))}
                              </View>

                              <TextInput
                                   style={styles.customAvatarInput}
                                   placeholder="Or enter initials..."
                                   placeholderTextColor="#555"
                                   maxLength={2}
                                   autoCapitalize="characters"
                                   onSubmitEditing={(e) => {
                                        if (e.nativeEvent.text) {
                                             setAvatar(e.nativeEvent.text);
                                             setAvatarModalVisible(false);
                                        }
                                   }}
                              />

                              <TouchableOpacity
                                   style={styles.closeModalBtn}
                                   onPress={() => setAvatarModalVisible(false)}
                              >
                                   <Text style={styles.closeModalText}>Cancel</Text>
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
     saveText: {
          color: '#8ac751',
          fontSize: 16,
          fontWeight: '700',
     },
     body: {
          flex: 1,
     },
     content: {
          padding: 24,
     },
     avatarSection: {
          alignItems: 'center',
          marginBottom: 40,
     },
     avatarContainer: {
          width: 100,
          height: 100,
          backgroundColor: '#8ac751',
          borderRadius: 32,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
     },
     avatarText: {
          fontSize: 36,
          fontWeight: '900',
          color: '#000',
     },
     editAvatarBtn: {
          position: 'absolute',
          bottom: -5,
          right: -5,
          backgroundColor: '#FFF',
          width: 32,
          height: 32,
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 3,
          borderColor: '#080808',
     },
     joinedText: {
          color: '#555',
          fontSize: 13,
          marginTop: 15,
          fontWeight: '600',
     },
     form: {
          marginBottom: 30,
     },
     inputGroup: {
          marginBottom: 25,
     },
     label: {
          color: '#8e8e93',
          fontSize: 12,
          fontWeight: '700',
          textTransform: 'uppercase',
          marginBottom: 10,
          marginLeft: 4,
     },
     input: {
          backgroundColor: '#121212',
          borderRadius: 16,
          padding: 16,
          color: '#FFF',
          fontSize: 16,
          fontWeight: '600',
          borderWidth: 1,
          borderColor: '#1E1E1E',
     },
     hint: {
          color: '#444',
          fontSize: 12,
          marginTop: 8,
          marginLeft: 4,
          fontWeight: '500',
     },
     divider: {
          height: 1,
          backgroundColor: '#1A1A1A',
          marginVertical: 10,
          marginBottom: 30,
     },
     logoutBtn: {
          backgroundColor: '#1A1A1A',
          borderRadius: 16,
          padding: 18,
          alignItems: 'center',
          marginTop: 10,
     },
     logoutText: {
          color: '#ff4444',
          fontSize: 16,
          fontWeight: '700',
     },
     modalOverlay: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.85)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
     },
     modalContent: {
          width: '100%',
          backgroundColor: '#121212',
          borderRadius: 32,
          padding: 24,
          borderWidth: 1,
          borderColor: '#222',
          alignItems: 'center',
     },
     modalTitle: {
          color: '#FFF',
          fontSize: 20,
          fontWeight: '800',
          marginBottom: 25,
     },
     avatarGrid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 15,
          marginBottom: 25,
     },
     avatarOption: {
          width: 60,
          height: 60,
          backgroundColor: '#1A1A1A',
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: 'transparent',
     },
     selectedOption: {
          borderColor: '#8ac751',
          backgroundColor: '#8ac75120',
     },
     optionText: {
          fontSize: 24,
     },
     customAvatarInput: {
          width: '100%',
          backgroundColor: '#1A1A1A',
          borderRadius: 16,
          padding: 16,
          color: '#FFF',
          marginBottom: 25,
          textAlign: 'center',
          fontSize: 16,
          fontWeight: '600',
     },
     closeModalBtn: {
          padding: 10,
     },
     closeModalText: {
          color: '#666',
          fontSize: 16,
          fontWeight: '700',
     }
});

