import AsyncStorage from '@react-native-async-storage/async-storage';

const TRANSACTIONS_KEY = '@moneysaver_transactions';
const GOALS_KEY = '@moneysaver_goals';
const RECURRING_KEY = '@moneysaver_recurring';

export const getTransactions = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(TRANSACTIONS_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Error reading transactions', e);
        return [];
    }
};

export const addTransaction = async (transaction) => {
    try {
        const existing = await getTransactions();
        const newTransactions = [transaction, ...existing];
        await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(newTransactions));
        return newTransactions;
    } catch (e) {
        console.error('Error adding transaction', e);
    }
};

export const getGoals = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(GOALS_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Error reading goals', e);
        return [];
    }
};

export const addGoal = async (goal) => {
    try {
        const existing = await getGoals();
        const newGoals = [...existing, goal];
        await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(newGoals));
        return newGoals;
    } catch (e) {
        console.error('Error adding goal', e);
    }
};

export const updateGoal = async (updatedGoal) => {
    try {
        const existing = await getGoals();
        const newGoals = existing.map(g => g.id === updatedGoal.id ? updatedGoal : g);
        await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(newGoals));
        return newGoals;
    } catch (e) {
        console.error('Error updating goal', e);
    }
};

export const clearAll = async () => {
    try {
        await AsyncStorage.clear();
    } catch (e) {
        // clear error
    }
}

export const getRecurringTransactions = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(RECURRING_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Error reading recurring', e);
        return [];
    }
};

export const addRecurringTransaction = async (transaction) => {
    try {
        const existing = await getRecurringTransactions();
        const newRecurring = [...existing, transaction];
        await AsyncStorage.setItem(RECURRING_KEY, JSON.stringify(newRecurring));
        return newRecurring;
    } catch (e) {
        console.error('Error adding recurring', e);
    }
};

export const updateRecurringTransaction = async (updatedRecurring) => {
    try {
        const existing = await getRecurringTransactions();
        const newRecurring = existing.map(r => r.id === updatedRecurring.id ? updatedRecurring : r);
        await AsyncStorage.setItem(RECURRING_KEY, JSON.stringify(newRecurring));
        return newRecurring;
    } catch (e) {
        console.error('Error updating recurring', e);
    }
};
