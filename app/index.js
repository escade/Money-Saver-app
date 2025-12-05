import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Feather } from '@expo/vector-icons';
import TransactionList from '../components/TransactionList';
import { getTransactions, getGoals, getRecurringTransactions, addTransaction, updateRecurringTransaction } from '../utils/storage';

export default function Home() {
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);
    const [goals, setGoals] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [balance, setBalance] = useState(0);
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);

    const loadData = async () => {
        // Process recurring transactions
        const recurring = await getRecurringTransactions();
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        for (const rule of recurring) {
            const lastGenDate = rule.lastGenerated ? new Date(rule.lastGenerated) : null;
            const ruleDay = rule.dayOfMonth || 1;

            // Check if we need to generate for this month
            // Condition: No last generated OR last generated was previous month/year AND today is past the rule day
            const needsGeneration = !lastGenDate ||
                (lastGenDate.getMonth() !== currentMonth || lastGenDate.getFullYear() !== currentYear) &&
                today.getDate() >= ruleDay;

            if (needsGeneration) {
                const newTx = {
                    id: Date.now().toString() + Math.random(),
                    amount: rule.amount,
                    category: rule.category,
                    type: rule.type,
                    note: rule.note + ' (Recurring)',
                    date: new Date().toISOString(),
                };

                await addTransaction(newTx);

                // Update rule
                await updateRecurringTransaction({
                    ...rule,
                    lastGenerated: new Date().toISOString()
                });
            }
        }

        const txs = await getTransactions();
        const gls = await getGoals();

        setTransactions(txs);
        setGoals(gls);

        // Calculate totals
        let inc = 0;
        let exp = 0;
        txs.forEach(t => {
            if (t.type === 'income') inc += parseFloat(t.amount);
            else exp += parseFloat(t.amount);
        });

        setIncome(inc);
        setExpense(exp);
        setBalance(inc - exp);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.text} />}
            >
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <Text style={styles.greeting}>Welcome back,</Text>
                    <Text style={styles.username}>Jonjie</Text>
                </View>

                {/* Balance Card */}
                {/* Balance Card */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Total Balance</Text>
                    <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <View style={styles.iconCircle}>
                                <Feather name="trending-up" size={16} color={Colors.black} />
                            </View>
                            <View>
                                <Text style={styles.statLabel}>Income</Text>
                                <Text style={styles.statValue}>${income.toFixed(2)}</Text>
                            </View>
                        </View>

                        <View style={styles.statItem}>
                            <View style={styles.iconCircle}>
                                <Feather name="trending-down" size={16} color={Colors.black} />
                            </View>
                            <View>
                                <Text style={styles.statLabel}>Expense</Text>
                                <Text style={styles.statValue}>${expense.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Goals Card */}
                {/* Goals Card */}
                <Link href="/goals" asChild>
                    <TouchableOpacity>
                        <View style={styles.goalsCard}>
                            <View style={styles.goalsHeader}>
                                <Feather name="target" size={28} color={Colors.black} />
                                <Text style={styles.goalsTitle}>Savings Goals</Text>
                            </View>

                            {(() => {
                                const totalCurrent = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
                                const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
                                const progress = totalTarget > 0 ? Math.min((totalCurrent / totalTarget) * 100, 100) : 0;

                                return (
                                    <View>
                                        <View style={styles.goalsInfoRow}>
                                            <Text style={styles.goalsLabel}>Total Saved</Text>
                                            <Text style={styles.goalsAmount}>${totalCurrent.toFixed(0)} / ${totalTarget.toFixed(0)}</Text>
                                        </View>
                                        <View style={styles.progressBarBg}>
                                            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                                        </View>
                                        <Text style={styles.goalsSubtitle}>{goals.length} active goals</Text>
                                    </View>
                                );
                            })()}
                        </View>
                    </TouchableOpacity>
                </Link>

                {/* Recent Transactions */}
                <TransactionList transactions={transactions.slice(0, 5)} />

            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/add-transaction')}
                activeOpacity={0.8}
            >
                <Feather name="plus" size={32} color={Colors.black} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    headerSection: {
        paddingTop: 80,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    greeting: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    username: {
        fontSize: 32,
        fontWeight: '900',
        color: Colors.text,
        letterSpacing: -1,
    },
    balanceCard: {
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 25,
        backgroundColor: Colors.secondary, // Yellow
        borderWidth: 2,
        borderColor: Colors.black,
        shadowColor: Colors.black,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 10,
    },
    balanceLabel: {
        fontSize: 14,
        color: Colors.text,
        fontWeight: '600',
        marginBottom: 5,
    },
    balanceAmount: {
        fontSize: 40,
        fontWeight: '900',
        color: Colors.text,
        marginBottom: 25,
        letterSpacing: -1,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.black,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.text,
        fontWeight: '600',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '800',
        color: Colors.text,
    },
    goalsCard: {
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 20,
        padding: 25,
        backgroundColor: Colors.accent, // Purple
        borderWidth: 2,
        borderColor: Colors.black,
        shadowColor: Colors.black,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 10,
    },
    goalsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    goalsTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: Colors.text,
    },
    goalsSubtitle: {
        fontSize: 14,
        color: Colors.text,
        fontWeight: '600',
        marginTop: 8,
    },
    goalsInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    goalsLabel: {
        fontSize: 14,
        color: Colors.text,
        fontWeight: '600',
    },
    goalsAmount: {
        fontSize: 14,
        color: Colors.text,
        fontWeight: '800',
    },
    progressBarBg: {
        height: 12,
        backgroundColor: Colors.white,
        borderRadius: 6,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: Colors.black,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.secondary, // Yellow fill
        borderRadius: 0,
        borderRightWidth: 2,
        borderColor: Colors.black,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.black,
        shadowColor: Colors.black,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 8,
    }
});
