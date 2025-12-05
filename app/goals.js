import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Colors } from '../constants/Colors';
import { getGoals, addGoal, updateGoal } from '../utils/storage';
import GoalCard from '../components/GoalCard';
import { Feather } from '@expo/vector-icons';

export default function Goals() {
    const [goals, setGoals] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newGoalName, setNewGoalName] = useState('');
    const [newGoalTarget, setNewGoalTarget] = useState('');

    const [depositModalVisible, setDepositModalVisible] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [depositAmount, setDepositAmount] = useState('');
    const [transactionType, setTransactionType] = useState('deposit'); // 'deposit' or 'withdraw'

    const loadGoals = async () => {
        const data = await getGoals();
        setGoals(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadGoals();
        }, [])
    );

    const handleAddGoal = async () => {
        if (!newGoalName || !newGoalTarget) return;

        const newGoal = {
            id: Date.now().toString(),
            name: newGoalName,
            targetAmount: parseFloat(newGoalTarget),
            currentAmount: 0,
        };

        await addGoal(newGoal);
        setModalVisible(false);
        setNewGoalName('');
        setNewGoalTarget('');
        loadGoals();
    };

    const handleTransaction = async (goal, type) => {
        setSelectedGoal(goal);
        setTransactionType(type);
        setDepositModalVisible(true);
    };

    const confirmTransaction = async () => {
        if (!depositAmount || !selectedGoal) return;

        const amount = parseFloat(depositAmount);
        if (isNaN(amount) || amount <= 0) return;

        let newAmount = selectedGoal.currentAmount;
        if (transactionType === 'deposit') {
            newAmount = Math.min(selectedGoal.currentAmount + amount, selectedGoal.targetAmount);
        } else {
            newAmount = Math.max(selectedGoal.currentAmount - amount, 0);
        }

        const updatedGoal = {
            ...selectedGoal,
            currentAmount: newAmount
        };
        await updateGoal(updatedGoal);
        setDepositModalVisible(false);
        setDepositAmount('');
        setSelectedGoal(null);
        loadGoals();
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {goals.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No goals set yet.</Text>
                        <Text style={styles.emptySubText}>Start saving for something special!</Text>
                    </View>
                ) : (
                    goals.map(goal => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            onDeposit={() => handleTransaction(goal, 'deposit')}
                            onWithdraw={() => handleTransaction(goal, 'withdraw')}
                        />
                    ))
                )}
            </ScrollView>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
            >
                <Feather name="plus" size={32} color={Colors.black} />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                    style={styles.modalOverlay}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardView}
                    >
                        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>New Savings Goal</Text>
                                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                                        <Feather name="x" size={24} color={Colors.text} />
                                    </TouchableOpacity>
                                </View>

                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    keyboardShouldPersistTaps="handled"
                                >
                                    <Text style={styles.label}>Goal Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={newGoalName}
                                        onChangeText={setNewGoalName}
                                        placeholder="e.g. New Laptop"
                                        placeholderTextColor={Colors.textSecondary}
                                    />

                                    <Text style={styles.label}>Target Amount</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={newGoalTarget}
                                        onChangeText={setNewGoalTarget}
                                        placeholder="1000"
                                        keyboardType="numeric"
                                        placeholderTextColor={Colors.textSecondary}
                                    />
                                </ScrollView>

                                <TouchableOpacity style={styles.saveButton} onPress={handleAddGoal}>
                                    <Text style={styles.saveButtonText}>Create Goal</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </TouchableOpacity>
            </Modal>

            {/* Deposit Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={depositModalVisible}
                onRequestClose={() => setDepositModalVisible(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setDepositModalVisible(false)}
                    style={styles.modalOverlay}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardView}
                    >
                        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>
                                        {transactionType === 'deposit' ? 'Add Funds' : 'Reduce Funds'}
                                    </Text>
                                    <TouchableOpacity onPress={() => setDepositModalVisible(false)}>
                                        <Feather name="x" size={24} color={Colors.text} />
                                    </TouchableOpacity>
                                </View>

                                {selectedGoal && (
                                    <View style={styles.goalInfo}>
                                        <Text style={styles.goalInfoText}>{selectedGoal.name}</Text>
                                        <Text style={styles.goalInfoSubText}>
                                            ${selectedGoal.currentAmount} / ${selectedGoal.targetAmount}
                                        </Text>
                                    </View>
                                )}

                                <Text style={styles.label}>
                                    {transactionType === 'deposit' ? 'Amount to Deposit' : 'Amount to Reduce'}
                                </Text>
                                <View style={styles.amountInputContainer}>
                                    <Text style={styles.currencySymbol}>$</Text>
                                    <TextInput
                                        style={styles.amountInput}
                                        value={depositAmount}
                                        onChangeText={setDepositAmount}
                                        placeholder="0.00"
                                        keyboardType="numeric"
                                        placeholderTextColor={Colors.textSecondary}
                                        autoFocus
                                    />
                                </View>

                                <TouchableOpacity style={styles.saveButton} onPress={confirmTransaction}>
                                    <Text style={styles.saveButtonText}>
                                        {transactionType === 'deposit' ? 'Confirm Deposit' : 'Confirm Reduce'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: 20,
        paddingTop: 90,
        paddingBottom: 100,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 10,
    },
    emptySubText: {
        color: Colors.textSecondary,
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
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    keyboardView: {
        justifyContent: 'flex-end',
        width: '100%',
    },
    modalContent: {
        backgroundColor: Colors.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        borderWidth: 2,
        borderColor: Colors.black,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: Colors.text,
        letterSpacing: -1,
    },
    label: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 12,
        color: Colors.text,
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: Colors.black,
    },
    saveButton: {
        backgroundColor: Colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 2,
        borderColor: Colors.black,
        shadowColor: Colors.black,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    saveButtonText: {
        color: Colors.black,
        fontWeight: '800',
        fontSize: 16,
    },
    goalInfo: {
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: Colors.black,
    },
    goalInfoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
    },
    goalInfoSubText: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: Colors.black,
    },
    currencySymbol: {
        fontSize: 24,
        color: Colors.text,
        fontWeight: 'bold',
        marginRight: 8,
    },
    amountInput: {
        fontSize: 24,
        color: Colors.text,
        fontWeight: 'bold',
        flex: 1,
    }
});
