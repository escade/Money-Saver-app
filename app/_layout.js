import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { Colors } from '../constants/Colors';
import { Feather } from '@expo/vector-icons';

export default function Layout() {
    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <StatusBar style="dark" />
            <Tabs
                screenOptions={{
                    headerStyle: {
                        backgroundColor: Colors.background,
                    },
                    headerTintColor: Colors.text,
                    headerTitleStyle: {
                        fontWeight: '900',
                        fontSize: 24,
                    },
                    headerShadowVisible: false,
                    tabBarStyle: {
                        backgroundColor: Colors.surface,
                        borderTopWidth: 2,
                        borderTopColor: Colors.black,
                        height: 80,
                        paddingBottom: 12,
                        paddingTop: 12,
                        paddingHorizontal: 10,
                        elevation: 0,
                    },
                    tabBarActiveTintColor: Colors.primary,
                    tabBarInactiveTintColor: Colors.textSecondary,
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '800',
                    },
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        headerShown: false,
                        title: 'Home',
                        tabBarIcon: ({ color, size }) => (
                            <Feather name="home" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="goals"
                    options={{
                        title: 'Goals',
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <Feather name="target" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="statistics"
                    options={{
                        title: 'Statistics',
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <Feather name="bar-chart-2" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: 'Settings',
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <Feather name="settings" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="add-transaction"
                    options={{
                        href: null, // Hide from tabs
                    }}
                />
            </Tabs>
        </View>
    );
}
