import axios from 'axios';
import { API_BASE_URL } from '../config';
import { StorageService } from './StorageService';

export const ApiService = {
    // Get all tickets
    getTickets: async () => {
        try {
            console.log('API: Fetching all tickets');
            const response = await axios.get(`${API_BASE_URL}/tickets`);

            // Save to local storage for offline access
            await StorageService.saveTickets(response.data);

            return { success: true, data: response.data };
        } catch (error) {
            console.error('API Error: Failed to fetch tickets', error);

            // Return cached data if offline
            const cachedTickets = await StorageService.getTickets();
            return {
                success: false,
                data: cachedTickets,
                error: 'Failed to fetch tickets from server. Showing cached data.',
                offline: true
            };
        }
    },

    // Get specific ticket by ID
    getTicketById: async (id) => {
        try {
            console.log(`API: Fetching ticket with ID ${id}`);
            const response = await axios.get(`${API_BASE_URL}/ticket/${id}`);
            return { success: true, data: response.data };
        } catch (error) {
            console.error(`API Error: Failed to fetch ticket ${id}`, error);

            // Try to find in cached data
            const cachedTickets = await StorageService.getTickets();
            const ticket = cachedTickets.find(t => t.id === id);

            if (ticket) {
                return { success: true, data: ticket, offline: true };
            }

            return {
                success: false,
                error: 'Failed to fetch ticket details',
                offline: true
            };
        }
    },

    // Create a new ticket
    createTicket: async (ticketData) => {
        try {
            console.log('API: Creating new ticket', ticketData);
            const response = await axios.post(`${API_BASE_URL}/ticket`, ticketData);

            // Update local storage
            const tickets = await StorageService.getTickets();
            tickets.push(response.data);
            await StorageService.saveTickets(tickets);

            return { success: true, data: response.data };
        } catch (error) {
            console.error('API Error: Failed to create ticket', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to create ticket. Please check your connection.'
            };
        }
    },

    // Delete a ticket
    deleteTicket: async (id) => {
        try {
            console.log(`API: Deleting ticket with ID ${id}`);
            const response = await axios.delete(`${API_BASE_URL}/ticket/${id}`);

            // Update local storage
            const tickets = await StorageService.getTickets();
            const updatedTickets = tickets.filter(t => t.id !== id);
            await StorageService.saveTickets(updatedTickets);

            return { success: true, data: response.data };
        } catch (error) {
            console.error(`API Error: Failed to delete ticket ${id}`, error);
            return {
                success: false,
                error: 'Failed to delete ticket. Please check your connection.'
            };
        }
    },

    // Get all tickets for reports
    getAllTickets: async () => {
        try {
            console.log('API: Fetching all tickets for reports');
            const response = await axios.get(`${API_BASE_URL}/allTickets`);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('API Error: Failed to fetch tickets for reports', error);

            // Return cached data if offline
            const cachedTickets = await StorageService.getTickets();
            return {
                success: false,
                data: cachedTickets,
                error: 'Failed to fetch tickets from server. Showing cached data.',
                offline: true
            };
        }
    }
};
