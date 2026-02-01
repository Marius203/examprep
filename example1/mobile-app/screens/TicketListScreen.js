import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    Alert
} from 'react-native';
import { ApiService } from '../services/ApiService';

export default function TicketListScreen({ navigation }) {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [offline, setOffline] = useState(false);

    useEffect(() => {
        loadTickets();
    }, []);

    // Reload tickets when screen comes into focus
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadTickets();
        });
        return unsubscribe;
    }, [navigation]);

    const loadTickets = async () => {
        try {
            setLoading(true);
            console.log('Loading tickets...');

            const result = await ApiService.getTickets();

            if (result.success || result.offline) {
                setTickets(result.data);
                setOffline(result.offline || false);

                if (result.error) {
                    Alert.alert('Offline Mode', result.error);
                }
            } else {
                Alert.alert('Error', result.error || 'Failed to load tickets');
            }
        } catch (error) {
            console.error('Error loading tickets:', error);
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadTickets();
        setRefreshing(false);
    }, []);

    const handleTicketPress = (ticket) => {
        navigation.navigate('TicketDetails', { ticketId: ticket.id });
    };

    const handleAddTicket = () => {
        navigation.navigate('AddTicket');
    };

    const renderTicketItem = ({ item }) => (
        <TouchableOpacity
            style={styles.ticketItem}
            onPress={() => handleTicketPress(item)}
        >
            <View style={styles.ticketHeader}>
                <Text style={styles.ticketDescription}>{item.description}</Text>
                <Text style={styles.ticketAmount}>${item.amount.toFixed(2)}</Text>
            </View>
            <View style={styles.ticketDetails}>
                <Text style={styles.ticketType}>{item.type}</Text>
                <Text style={styles.ticketCategory}>{item.category}</Text>
                <Text style={styles.ticketDate}>{item.date}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading tickets...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {offline && (
                <View style={styles.offlineBanner}>
                    <Text style={styles.offlineText}>📴 Offline Mode - Showing cached data</Text>
                </View>
            )}

            {tickets.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No tickets found</Text>
                    <Text style={styles.emptySubtext}>Add your first ticket to get started!</Text>
                </View>
            ) : (
                <FlatList
                    data={tickets}
                    renderItem={renderTicketItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#007AFF']}
                        />
                    }
                />
            )}

            <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddTicket}
            >
                <Text style={styles.addButtonText}>+ Add Ticket</Text>
            </TouchableOpacity>
        </View>
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
    offlineBanner: {
        backgroundColor: '#FFA500',
        padding: 10,
        alignItems: 'center',
    },
    offlineText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    listContent: {
        padding: 16,
    },
    ticketItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    ticketHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    ticketDescription: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    ticketAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    ticketDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    ticketType: {
        fontSize: 14,
        color: '#666',
        textTransform: 'capitalize',
    },
    ticketCategory: {
        fontSize: 14,
        color: '#666',
        textTransform: 'capitalize',
    },
    ticketDate: {
        fontSize: 14,
        color: '#999',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 16,
        color: '#666',
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
