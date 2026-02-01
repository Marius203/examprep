import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Alert
} from 'react-native';
import { ApiService } from '../services/ApiService';

export default function InsightsScreen() {
    const [topGenres, setTopGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [offline, setOffline] = useState(false);

    useEffect(() => {
        loadInsights();
    }, []);

    const loadInsights = async () => {
        try {
            setLoading(true);
            console.log('Loading insights...');

            const result = await ApiService.getAllTickets();

            if (result.success || result.offline) {
                const tickets = result.data;
                const topGenresData = calculateTopGenres(tickets);
                setTopGenres(topGenresData);
                setOffline(result.offline || false);

                if (result.error) {
                    Alert.alert('Offline Mode', result.error);
                }
            } else {
                Alert.alert('Error', result.error || 'Failed to load insights');
            }
        } catch (error) {
            console.error('Error loading insights:', error);
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const calculateTopGenres = (tickets) => {
        const categoryMap = {};

        tickets.forEach(ticket => {
            const category = ticket.category.toLowerCase();

            if (!categoryMap[category]) {
                categoryMap[category] = {
                    category: ticket.category,
                    total: 0,
                    count: 0
                };
            }

            categoryMap[category].total += ticket.amount;
            categoryMap[category].count += 1;
        });

        // Convert to array and sort by total in descending order
        const categoryArray = Object.values(categoryMap);
        categoryArray.sort((a, b) => b.total - a.total);

        // Get top 3
        const top3 = categoryArray.slice(0, 3);

        console.log('Top 3 genres calculated:', top3);
        return top3;
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadInsights();
        setRefreshing(false);
    }, []);

    const getMedalEmoji = (index) => {
        const medals = ['🥇', '🥈', '🥉'];
        return medals[index] || '🏆';
    };

    const getBackgroundColor = (index) => {
        const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];
        return colors[index] || '#007AFF';
    };

    const renderGenreItem = ({ item, index }) => (
        <View style={[styles.genreItem, { borderLeftColor: getBackgroundColor(index) }]}>
            <Text style={styles.medalEmoji}>{getMedalEmoji(index)}</Text>
            <View style={styles.genreInfo}>
                <Text style={styles.genreName}>{item.category}</Text>
                <Text style={styles.genreCount}>{item.count} transaction(s)</Text>
            </View>
            <Text style={styles.genreTotal}>${item.total.toFixed(2)}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading insights...</Text>
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

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Top Movie Genres</Text>
                <Text style={styles.headerSubtitle}>Top 3 categories by spending</Text>
            </View>

            {topGenres.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No data available</Text>
                </View>
            ) : (
                <FlatList
                    data={topGenres}
                    renderItem={renderGenreItem}
                    keyExtractor={(item, index) => `${item.category}-${index}`}
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
    header: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    listContent: {
        padding: 16,
    },
    genreItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        marginBottom: 16,
        borderLeftWidth: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    medalEmoji: {
        fontSize: 40,
        marginRight: 16,
    },
    genreInfo: {
        flex: 1,
    },
    genreName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
        textTransform: 'capitalize',
    },
    genreCount: {
        fontSize: 14,
        color: '#666',
    },
    genreTotal: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
    },
});
