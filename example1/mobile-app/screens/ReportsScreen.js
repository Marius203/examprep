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

export default function ReportsScreen() {
    const [monthlyData, setMonthlyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [offline, setOffline] = useState(false);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            setLoading(true);
            console.log('Loading monthly reports...');

            const result = await ApiService.getAllTickets();

            if (result.success || result.offline) {
                const tickets = result.data;
                const monthlyTotals = calculateMonthlyTotals(tickets);
                setMonthlyData(monthlyTotals);
                setOffline(result.offline || false);

                if (result.error) {
                    Alert.alert('Offline Mode', result.error);
                }
            } else {
                Alert.alert('Error', result.error || 'Failed to load reports');
            }
        } catch (error) {
            console.error('Error loading reports:', error);
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const calculateMonthlyTotals = (tickets) => {
        const monthlyMap = {};

        tickets.forEach(ticket => {
            // Extract year and month from date (YYYY-MM-DD)
            const yearMonth = ticket.date.substring(0, 7); // Gets YYYY-MM

            if (!monthlyMap[yearMonth]) {
                monthlyMap[yearMonth] = {
                    month: yearMonth,
                    total: 0,
                    count: 0
                };
            }

            monthlyMap[yearMonth].total += ticket.amount;
            monthlyMap[yearMonth].count += 1;
        });

        // Convert to array and sort by total in descending order
        const monthlyArray = Object.values(monthlyMap);
        monthlyArray.sort((a, b) => b.total - a.total);

        console.log('Monthly totals calculated:', monthlyArray);
        return monthlyArray;
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadReports();
        setRefreshing(false);
    }, []);

    const formatMonth = (yearMonth) => {
        const [year, month] = yearMonth.split('-');
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${monthNames[parseInt(month) - 1]} ${year}`;
    };

    const renderMonthItem = ({ item, index }) => (
        <View style={styles.monthItem}>
            <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{index + 1}</Text>
            </View>
            <View style={styles.monthInfo}>
                <Text style={styles.monthName}>{formatMonth(item.month)}</Text>
                <Text style={styles.monthCount}>{item.count} transaction(s)</Text>
            </View>
            <Text style={styles.monthTotal}>${item.total.toFixed(2)}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading reports...</Text>
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
                <Text style={styles.headerTitle}>Monthly Entertainment Analysis</Text>
                <Text style={styles.headerSubtitle}>Total spending by month (descending)</Text>
            </View>

            {monthlyData.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No data available</Text>
                </View>
            ) : (
                <FlatList
                    data={monthlyData}
                    renderItem={renderMonthItem}
                    keyExtractor={(item) => item.month}
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
    monthItem: {
        flexDirection: 'row',
        alignItems: 'center',
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
    rankBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rankText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    monthInfo: {
        flex: 1,
    },
    monthName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    monthCount: {
        fontSize: 14,
        color: '#666',
    },
    monthTotal: {
        fontSize: 20,
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
