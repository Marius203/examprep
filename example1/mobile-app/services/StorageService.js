import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@movie_budget_tickets';

export const StorageService = {
    // Save tickets to local storage
    saveTickets: async (tickets) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
            console.log('Tickets saved to local storage');
            return true;
        } catch (error) {
            console.error('Error saving tickets to storage:', error);
            return false;
        }
    },

    // Get tickets from local storage
    getTickets: async () => {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            if (data) {
                console.log('Tickets loaded from local storage');
                return JSON.parse(data);
            }
            return [];
        } catch (error) {
            console.error('Error loading tickets from storage:', error);
            return [];
        }
    },

    // Clear all tickets from storage
    clearTickets: async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            console.log('Tickets cleared from local storage');
            return true;
        } catch (error) {
            console.error('Error clearing tickets from storage:', error);
            return false;
        }
    }
};
