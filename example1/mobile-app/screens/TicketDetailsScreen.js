import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    ScrollView
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { ApiService } from '../services/ApiService';

export default function TicketDetailsScreen({ route, navigation }) {
    const { ticketId } = route.params;
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [offline, setOffline] = useState(false);
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        loadTicketDetails();

        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOnline(state.isConnected && state.isInternetReachable !== false);
        });
        return () => unsubscribe();
    }, [ticketId]);

    const loadTicketDetails = async () => {
        try {
            setLoading(true);
            console.log(`Loading details for ticket ${ticketId}...`);

            const result = await ApiService.getTicketById(ticketId);

            if (result.success) {
                setTicket(result.data);
                setOffline(result.offline || false);
            } else {
                Alert.alert('Error', result.error || 'Failed to load ticket details');
                navigation.goBack();
            }
        } catch (error) {
            console.error('Error loading ticket details:', error);
            Alert.alert('Error', 'An unexpected error occurred');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        if (offline) {
            Alert.alert('Offline', 'Cannot delete tickets while offline');
            return;
        }

        Alert.alert(
            'Delete Ticket',
            'Are you sure you want to delete this ticket?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            const result = await ApiService.deleteTicket(ticketId);

                            if (result.success) {
                                Alert.alert('Success', 'Ticket deleted successfully');
                                navigation.goBack();
                            } else {
                                // Only show error if online
                                if (isOnline) {
                                    Alert.alert('Error', result.error || 'Failed to delete ticket');
                                }
                                setLoading(false);
                            }
                        } catch (error) {
                            console.error('Error deleting ticket:', error);
                            // Only show error if online
                            if (isOnline) {
                                Alert.alert('Error', 'An unexpected error occurred');
                            }
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading ticket details...</Text>
            </View>
        );
    }

    if (!ticket) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Ticket not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {offline && (
                <View style={styles.offlineBanner}>
                    <Text style={styles.offlineText}>📴 Offline Mode - Showing cached data</Text>
                </View>
            )}

            <View style={styles.card}>
                <Text style={styles.label}>Description</Text>
                <Text style={styles.value}>{ticket.description}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Amount</Text>
                <Text style={[styles.value, styles.amountText]}>${ticket.amount.toFixed(2)}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Type</Text>
                <Text style={styles.value}>{ticket.type}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Category</Text>
                <Text style={styles.value}>{ticket.category}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Date</Text>
                <Text style={styles.value}>{ticket.date}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>ID</Text>
                <Text style={styles.value}>#{ticket.id}</Text>
            </View>

            <TouchableOpacity
                style={[styles.deleteButton, offline && styles.disabledButton]}
                onPress={handleDelete}
                disabled={offline}
            >
                <Text style={styles.deleteButtonText}>🗑 Delete Ticket</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 18,
        color: '#FF3B30',
    },
    offlineBanner: {
        backgroundColor: '#FFA500',
        padding: 10,
        alignItems: 'center',
    },
    offlineText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#fff',
        margin: 16,
        marginBottom: 0,
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 14,
        color: '#999',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    value: {
        fontSize: 18,
        color: '#333',
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    amountText: {
        fontSize: 32,
        color: '#007AFF',
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
        margin: 16,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 32,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
