import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Keyboard, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { addTransaction, addRecurringTransaction } from '../utils/storage';
import { Feather } from '@expo/vector-icons';

const CATEGORIES = ['Groceries', 'Rent', 'Entertainment', 'Salary', 'Transport', 'Shopping', 'Health', 'Other'];

export default function AddTransaction() {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Other');
    const [type, setType] = useState('expense'); // 'expense' or 'income'
    const [note, setNote] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    React.useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            (e) => {
                setKeyboardVisible(true);
                setKeyboardHeight(e.endCoordinates.height);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
                setKeyboardHeight(0);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const handleSave = async () => {
        if (!amount) return;

        const newTransaction = {
            id: Date.now().toString(),
            amount: parseFloat(amount),
            category,
            type,
            note,
            date: new Date().toISOString(),
        };

        await addTransaction(newTransaction);

        if (isRecurring) {
            await addRecurringTransaction({
                ...newTransaction,
                id: 'rec_' + Date.now().toString(),
                dayOfMonth: new Date().getDate(),
                lastGenerated: new Date().toISOString(), // Mark as generated so it doesn't duplicate immediately
            });
        }

        router.back();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <Feather name="x" size={24} color={Colors.black} />
                </TouchableOpacity>
                <Text style={styles.title}>New Transaction</Text>
                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    <Feather name="check" size={24} color={Colors.black} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={0}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >

                    {/* Type Switcher */}
                    <View style={styles.typeContainer}>
                        <TouchableOpacity
                            style={[styles.typeButton, type === 'expense' && styles.activeExpense]}
                            onPress={() => setType('expense')}
                        >
                            <Text style={[styles.typeText, type === 'expense' && styles.activeTypeText]}>Expense</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.typeButton, type === 'income' && styles.activeIncome]}
                            onPress={() => setType('income')}
                        >
                            <Text style={[styles.typeText, type === 'income' && styles.activeTypeText]}>Income</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Amount Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Amount</Text>
                        <View style={styles.amountContainer}>
                            <Text style={styles.currencySymbol}>$</Text>
                            <TextInput
                                style={styles.amountInput}
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="numeric"
                                placeholder="0.00"
                                placeholderTextColor={Colors.textSecondary}
                            />
                        </View>
                    </View>

                    {/* Categories */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Category</Text>
                        <View style={styles.categoriesContainer}>
                            {CATEGORIES.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.categoryChip,
                                        category === cat && { backgroundColor: type === 'expense' ? Colors.accent : Colors.success }
                                    ]}
                                    onPress={() => setCategory(cat)}
                                >
                                    <Text style={[
                                        styles.categoryText,
                                        category === cat && { color: Colors.black, fontWeight: '800' }
                                    ]}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Note Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Note (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            value={note}
                            onChangeText={setNote}
                            placeholder="What is this for?"
                            placeholderTextColor={Colors.textSecondary}
                        />
                    </View>

                    {/* Recurring Toggle */}
                    <TouchableOpacity
                        style={styles.recurringRow}
                        onPress={() => setIsRecurring(!isRecurring)}
                    >
                        <View style={styles.recurringLeft}>
                            <Feather name="repeat" size={24} color={isRecurring ? Colors.primary : Colors.textSecondary} />
                            <Text style={[styles.recurringText, isRecurring && { color: Colors.primary }]}>
                                Repeat Monthly
                            </Text>
                        </View>
                        <View style={[styles.checkbox, isRecurring && styles.checkboxChecked]}>
                            {isRecurring && <Feather name="check" size={16} color={Colors.black} />}
                        </View>
                    </TouchableOpacity>

                </ScrollView>

                {/* Keyboard Done Button */}
                {keyboardVisible && (
                    <View style={[styles.keyboardToolbar, { bottom: keyboardHeight }]}>
                        <TouchableOpacity
                            style={styles.doneButton}
                            onPress={() => Keyboard.dismiss()}
                        >
                            <Text style={styles.doneButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: Colors.text,
        letterSpacing: -0.5,
    },
    closeButton: {
        padding: 10,
        backgroundColor: Colors.white,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.black,
        shadowColor: Colors.black,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    saveButton: {
        padding: 10,
        backgroundColor: Colors.primary,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.black,
        shadowColor: Colors.black,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    typeContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 4,
        marginBottom: 30,
        borderWidth: 2,
        borderColor: Colors.black,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
    },
    activeExpense: {
        backgroundColor: Colors.accent,
        borderWidth: 2,
        borderColor: Colors.black,
    },
    activeIncome: {
        backgroundColor: Colors.success,
        borderWidth: 2,
        borderColor: Colors.black,
    },
    typeText: {
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    activeTypeText: {
        color: Colors.black,
        fontWeight: '800',
    },
    inputGroup: {
        marginBottom: 30,
    },
    label: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 10,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencySymbol: {
        fontSize: 40,
        color: Colors.text,
        fontWeight: 'bold',
        marginRight: 5,
    },
    amountInput: {
        fontSize: 40,
        color: Colors.text,
        fontWeight: 'bold',
        flex: 1,
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: Colors.white,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: Colors.black,
    },
    categoryText: {
        color: Colors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    input: {
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 16,
        color: Colors.text,
        fontSize: 16,
        borderWidth: 2,
        borderColor: Colors.black,
    },
    recurringRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 16,
        marginBottom: 40,
        borderWidth: 2,
        borderColor: Colors.black,
    },
    recurringLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    recurringText: {
        fontSize: 16,
        color: Colors.text,
        fontWeight: '600',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: Colors.black,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: Colors.primary,
        borderColor: Colors.black,
    },
    keyboardToolbar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.white,
        borderTopWidth: 2,
        borderTopColor: Colors.black,
        paddingHorizontal: 20,
        paddingVertical: 10,
        paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    doneButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: Colors.black,
    },
    doneButtonText: {
        color: Colors.black,
        fontSize: 14,
        fontWeight: '800',
    }
});
