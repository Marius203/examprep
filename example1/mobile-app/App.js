import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import WebSocketService from './services/WebSocketService';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider, showToast } from './utils/toast';

// Import screens
import TicketListScreen from './screens/TicketListScreen';
import TicketDetailsScreen from './screens/TicketDetailsScreen';
import AddTicketScreen from './screens/AddTicketScreen';
import ReportsScreen from './screens/ReportsScreen';
import InsightsScreen from './screens/InsightsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Main section navigator (tickets)
function MainStackNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#007AFF',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="TicketList"
                component={TicketListScreen}
                options={{ title: 'My Tickets' }}
            />
            <Stack.Screen
                name="TicketDetails"
                component={TicketDetailsScreen}
                options={{ title: 'Ticket Details' }}
            />
            <Stack.Screen
                name="AddTicket"
                component={AddTicketScreen}
                options={{ title: 'Add Ticket' }}
            />
        </Stack.Navigator>
    );
}

// Tab navigator for main app sections
function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#999',
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#e0e0e0',
                },
                headerStyle: {
                    backgroundColor: '#007AFF',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Tab.Screen
                name="Main"
                component={MainStackNavigator}
                options={{
                    title: 'Tickets',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <Text style={{ fontSize: 24, color }}>🎫</Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Reports"
                component={ReportsScreen}
                options={{
                    title: 'Reports',
                    tabBarIcon: ({ color }) => (
                        <Text style={{ fontSize: 24, color }}>📊</Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Insights"
                component={InsightsScreen}
                options={{
                    title: 'Insights',
                    tabBarIcon: ({ color }) => (
                        <Text style={{ fontSize: 24, color }}>💡</Text>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default function App() {
    const [notification, setNotification] = useState(null);
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        console.log('App starting...');

        // Monitor network connectivity
        const unsubscribeNetInfo = NetInfo.addEventListener(state => {
            const online = state.isConnected && state.isInternetReachable !== false;
            setIsOnline(online);
            console.log('Network status:', online ? 'Online' : 'Offline');
        });

        // Connect to WebSocket
        WebSocketService.connect();

        // Add WebSocket listener for new ticket notifications
        const handleWebSocketMessage = (data) => {
            console.log('WebSocket notification received:', data);

            if (data.type === 'new_ticket') {
                // Show toast notification
                showToast(`🎬 ${data.message}`);

                // Also show a persistent notification at the top
                setNotification(data.message);
                setTimeout(() => setNotification(null), 5000);
            }
        };

        WebSocketService.addListener(handleWebSocketMessage);

        // Cleanup on unmount
        return () => {
            console.log('App unmounting, cleaning up...');
            WebSocketService.removeListener(handleWebSocketMessage);
            WebSocketService.disconnect();
            unsubscribeNetInfo();
        };
    }, []);

    return (
        <ErrorBoundary>
            <PaperProvider>
                <StatusBar style="light" />
                {!isOnline && (
                    <View style={styles.offlineBanner}>
                        <Text style={styles.offlineText}>📴 No Internet Connection</Text>
                    </View>
                )}
                <NavigationContainer>
                    <TabNavigator />
                </NavigationContainer>

                {notification && (
                    <View style={styles.notification}>
                        <Text style={styles.notificationText}>{notification}</Text>
                    </View>
                )}
                <ToastProvider />
            </PaperProvider>
        </ErrorBoundary>
    );
}

const styles = StyleSheet.create({
    offlineBanner: {
        backgroundColor: '#FF3B30',
        padding: 8,
        alignItems: 'center',
        zIndex: 1000,
    },
    offlineText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    notification: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        zIndex: 9999,
    },
    notificationText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
