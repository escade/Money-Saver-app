import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { Feather } from '@expo/vector-icons';

const TransactionItem = ({ item }) => {
    const isExpense = item.type === 'expense';

    return (
        <View style={styles.itemContainer}>
            <View style={styles.iconContainer}>
                {isExpense ? (
                    <Feather name="arrow-up-right" size={24} color={Colors.accent} />
                ) : (
                    <Feather name="arrow-down-left" size={24} color={Colors.success} />
                )}
            </View>
            <View style={styles.details}>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <Text style={[styles.amount, { color: isExpense ? Colors.accent : Colors.success }]}>
                {isExpense ? '-' : '+'}${parseFloat(item.amount).toFixed(2)}
            </Text>
        </View>
    );
};

export default function TransactionList({ transactions }) {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Recent Transactions</Text>
            {transactions.length === 0 ? (
                <Text style={styles.emptyText}>No transactions yet.</Text>
            ) : (
                <FlatList
                    data={transactions}
                    renderItem={({ item }) => <TransactionItem item={item} />}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    scrollEnabled={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: '900',
        color: Colors.text,
        marginBottom: 15,
        letterSpacing: -0.5,
    },
    listContent: {
        paddingBottom: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: 15,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: Colors.black,
        shadowColor: Colors.black,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderWidth: 2,
        borderColor: Colors.black,
    },
    details: {
        flex: 1,
    },
    category: {
        fontSize: 16,
        fontWeight: '800',
        color: Colors.text,
    },
    date: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 2,
        fontWeight: '600',
    },
    amount: {
        fontSize: 16,
        fontWeight: '900',
    },
    emptyText: {
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: 20,
        fontWeight: '600',
    }
});
