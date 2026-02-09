import { collection, doc, onSnapshot, query, setDoc, updateDoc } from '@firebase/firestore';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

export type User = {
     id: string;
     name: string;
     email: string;
     avatar: string;
     joiningDate: string;
};

export type ViewMode = 'personal' | 'shared';

export type Transaction = {
     id: string;
     title: string;
     amount: string;
     category: string;
     icon: string;
     color: string;
     type: 'expense' | 'income';
     date: string;
     userId: string;
};

export type Goal = {
     id: string;
     name: string;
     target: number;
     current: number;
     icon: string;
     color: string;
};

export type Currency = {
     label: string;
     symbol: string;
     code: string;
};

export const CURRENCIES: Currency[] = [
     { label: 'PKR', symbol: '₨', code: 'en-PK' },
     { label: 'USD', symbol: '$', code: 'en-US' },
     { label: 'EUR', symbol: '€', code: 'en-DE' },
     { label: 'GBP', symbol: '£', code: 'en-GB' },
];

export const DATE_FORMATS = [
     'DD/MM/YYYY',
     'MM/DD/YYYY',
     'YYYY-MM-DD',
     'Month D, YYYY',
];

type TransactionContextType = {
     transactions: Transaction[];
     filteredTransactions: Transaction[];
     addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'userId'>) => void;
     balance: number;
     expenses: number;
     income: number;
     currentUser: User;
     updateProfile: (updates: Partial<User>) => void;
     viewMode: ViewMode;
     setViewMode: (mode: ViewMode) => void;
     monthlyEstimate: { balance: number; expenses: number; income: number };
     monthlyBudget: number;
     setMonthlyBudget: (amount: number) => void;
     budgetProgress: number;
     goals: Goal[];
     addGoal: (goal: Omit<Goal, 'id' | 'current'>) => void;
     currency: Currency;
     setCurrency: (currency: Currency) => void;
     dateFormat: string;
     setDateFormat: (format: string) => void;
     formatCurrency: (amount: number | string) => string;
     formatDate: (date: string | Date) => string;
};



const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
     const { user: authUser } = useAuth();
     const [currentUser, setCurrentUser] = useState<User>({
          id: authUser?.uid || '',
          name: 'Buddy',
          email: 'hello@buddypay.app',
          avatar: 'BP',
          joiningDate: 'Feb 2026'
     });
     const [viewMode, setViewMode] = useState<ViewMode>('shared');
     const [monthlyBudget, setMonthlyBudget] = useState<number>(20000);
     const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
     const [dateFormat, setDateFormat] = useState<string>(DATE_FORMATS[0]);
     const [goals, setGoals] = useState<Goal[]>([]);
     const [transactions, setTransactions] = useState<Transaction[]>([]);



     // 1. Initial Data Fetch & Listeners
     useEffect(() => {
          if (!authUser) {
               setTransactions([]);
               setGoals([]);
               return;
          }

          const userDocRef = doc(db, 'users', authUser.uid);

          // Listen to User Settings & Profile
          const unsubUser = onSnapshot(userDocRef, (docSnap) => {
               if (docSnap.exists()) {
                    const data = docSnap.data();
                    setCurrentUser(prev => ({ ...prev, ...data }));
                    if (data.monthlyBudget !== undefined) setMonthlyBudget(data.monthlyBudget);
                    if (data.currencyCode) {
                         const found = CURRENCIES.find(c => c.code === data.currencyCode);
                         if (found) setCurrency(found);
                    }
                    if (data.dateFormat) setDateFormat(data.dateFormat);
               } else {
                    // Initialize if not exists
                    setDoc(userDocRef, {
                         name: currentUser.name,
                         email: currentUser.email,
                         avatar: currentUser.avatar,
                         joiningDate: currentUser.joiningDate,
                         monthlyBudget: 20000,
                         currencyCode: 'en-PK',
                         dateFormat: 'DD/MM/YYYY'
                    });
               }
          });

          // Listen to Transactions
          const txColRef = collection(db, 'users', authUser.uid, 'transactions');
          const txQuery = query(txColRef);
          const unsubTx = onSnapshot(txQuery, (querySnapshot) => {
               const txs: Transaction[] = [];
               querySnapshot.forEach((doc) => {
                    txs.push({ id: doc.id, ...doc.data() } as Transaction);
               });
               setTransactions(txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
          });

          // Listen to Goals
          const goalColRef = collection(db, 'users', authUser.uid, 'goals');
          const goalQuery = query(goalColRef);
          const unsubGoals = onSnapshot(goalQuery, (querySnapshot) => {
               const gs: Goal[] = [];
               querySnapshot.forEach((doc) => {
                    gs.push({ id: doc.id, ...doc.data() } as Goal);
               });
               setGoals(gs);
          });

          return () => {
               unsubUser();
               unsubTx();
               unsubGoals();
          };
     }, [authUser]);

     const addTransaction = async (newTx: Omit<Transaction, 'id' | 'date' | 'userId'>) => {
          if (!authUser) return;
          try {
               const txId = Math.random().toString(36).substr(2, 9);
               const transaction = {
                    ...newTx,
                    date: new Date().toISOString(),
                    userId: authUser.uid,
               };
               await setDoc(doc(db, 'users', authUser.uid, 'transactions', txId), transaction);
          } catch (e) {
               console.error("Error adding transaction: ", e);
          }
     };

     const addGoal = async (newGoal: Omit<Goal, 'id' | 'current'>) => {
          if (!authUser) return;
          try {
               const goalId = Math.random().toString(36).substr(2, 9);
               const goal = {
                    ...newGoal,
                    current: 0,
               };
               await setDoc(doc(db, 'users', authUser.uid, 'goals', goalId), goal);
          } catch (e) {
               console.error("Error adding goal: ", e);
          }
     };

     const updateProfile = async (updates: Partial<User>) => {
          if (!authUser) return;
          try {
               await updateDoc(doc(db, 'users', authUser.uid), updates);
          } catch (e) {
               console.error("Error updating profile: ", e);
          }
     };

     const updateMonthlyBudget = async (amount: number) => {
          if (!authUser) return;
          try {
               await updateDoc(doc(db, 'users', authUser.uid), { monthlyBudget: amount });
          } catch (e) {
               console.error("Error updating budget: ", e);
          }
     };

     const updateCurrency = async (newCurrency: Currency) => {
          if (!authUser) return;
          try {
               await updateDoc(doc(db, 'users', authUser.uid), { currencyCode: newCurrency.code });
          } catch (e) {
               console.error("Error updating currency: ", e);
          }
     };

     const updateDateFormat = async (format: string) => {
          if (!authUser) return;
          try {
               await updateDoc(doc(db, 'users', authUser.uid), { dateFormat: format });
          } catch (e) {
               console.error("Error updating date format: ", e);
          }
     };

     // Filter transactions based on viewMode
     const filteredTransactions = viewMode === 'personal'
          ? transactions.filter(tx => tx.userId === currentUser.id)
          : transactions;

     // Calculate totals for currently filtered transactions
     const calculateTotals = (txList: Transaction[]) => {
          return txList.reduce(
               (acc, tx) => {
                    const amt = parseFloat(tx.amount.replace(/[,+]/g, ''));
                    if (tx.type === 'income') acc.income += amt;
                    else acc.expenses += Math.abs(amt);
                    return acc;
               },
               { income: 0, expenses: 0 }
          );
     };

     const currentTotals = calculateTotals(filteredTransactions);
     const balance = currentTotals.income - currentTotals.expenses;

     // Calculate Monthly Estimate (Mocking current month logic)
     const now = new Date();
     const currentMonthTx = filteredTransactions.filter(tx => {
          const d = new Date(tx.date);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
     });
     const monthlyTotals = calculateTotals(currentMonthTx);

     // Budget Progress (Current month expenses / Budget)
     const budgetProgress = monthlyBudget > 0
          ? Math.min(monthlyTotals.expenses / monthlyBudget, 1)
          : 0;

     const formatCurrency = (amount: number | string) => {
          const val = typeof amount === 'string' ? parseFloat(amount.replace(/[,+]/g, '')) : amount;
          return currency.symbol + Math.abs(val).toLocaleString(currency.code, { minimumFractionDigits: 0 });
     };

     const formatDate = (date: string | Date) => {
          const d = new Date(date);
          if (dateFormat === 'DD/MM/YYYY') return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
          if (dateFormat === 'MM/DD/YYYY') return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}/${d.getFullYear()}`;
          if (dateFormat === 'YYYY-MM-DD') return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
          if (dateFormat === 'Month D, YYYY') return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
          return d.toLocaleDateString();
     };

     return (
          <TransactionContext.Provider value={{
               transactions,
               filteredTransactions,
               addTransaction,
               balance,
               expenses: currentTotals.expenses,
               income: currentTotals.income,
               currentUser,
               updateProfile,
               viewMode,
               setViewMode,
               monthlyEstimate: {
                    balance: monthlyTotals.income - monthlyTotals.expenses,
                    expenses: monthlyTotals.expenses,
                    income: monthlyTotals.income
               },
               monthlyBudget,
               setMonthlyBudget: updateMonthlyBudget,
               budgetProgress,
               goals,
               addGoal,
               currency,
               setCurrency: updateCurrency,
               dateFormat,
               setDateFormat: updateDateFormat,
               formatCurrency,
               formatDate
          }}>
               {children}
          </TransactionContext.Provider>
     );
};

export const useTransactions = () => {
     const context = useContext(TransactionContext);
     if (!context) {
          throw new Error('useTransactions must be used within a TransactionProvider');
     }
     return context;
};

