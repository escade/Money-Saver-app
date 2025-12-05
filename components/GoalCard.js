import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { Feather } from '@expo/vector-icons';

export default function GoalCard({ goal, onPress, onDeposit, onWithdraw }) {
    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>{goal.name}</Text>
                <Text style={styles.amount}>${goal.currentAmount} / ${goal.targetAmount}</Text>
            </View>

            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>

            <View style={styles.footer}>
                <Text style={styles.percentage}>{progress.toFixed(0)}% Achieved</Text>
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.addButton]}
                        onPress={onDeposit}
                        activeOpacity={0.7}
                    >
                        <Feather name="plus" size={14} color={Colors.black} />
                        <Text style={styles.actionText}>Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.reduceButton]}
                        onPress={onWithdraw}
                        activeOpacity={0.7}
                    >
                        <Feather name="minus" size={14} color={Colors.black} />
                        <Text style={styles.actionText}>Reduce</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: Colors.borderWidth,
        borderColor: Colors.border,
        width: '100%',
        ...Colors.cardShadow,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: '900',
        color: Colors.text,
        letterSpacing: -0.5,
    },
    amount: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
    },
    progressBarBg: {
        height: 12,
        backgroundColor: Colors.white,
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 12,
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
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    percentage: {
        fontSize: 14,
        color: Colors.text,
        fontWeight: '800',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        gap: 4,
        borderWidth: 2,
        borderColor: Colors.black,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    addButton: {
        backgroundColor: Colors.primary,
    },
    reduceButton: {
        backgroundColor: Colors.accent,
    },
    actionText: {
        color: Colors.black,
        fontSize: 12,
        fontWeight: '800',
    }
});
