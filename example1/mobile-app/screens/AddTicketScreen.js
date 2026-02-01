import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { ApiService } from '../services/ApiService';
import { validateDate, validateAmount, validateTextField } from '../utils/validation';
import { showToast } from '../utils/toast';

export default function AddTicketScreen({ navigation }) {
    const [formData, setFormData] = useState({
        date: '',
        amount: '',
        type: '',
        category: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateForm = () => {
        // Validate date
        const dateValidation = validateDate(formData.date);
        if (!dateValidation.valid) {
            showToast(dateValidation.error);
            return false;
        }

        // Validate amount
        const amountValidation = validateAmount(formData.amount);
        if (!amountValidation.valid) {
            showToast(amountValidation.error);
            return false;
        }

        // Validate type
        const typeValidation = validateTextField(formData.type, 'Type', 1, 50);
        if (!typeValidation.valid) {
            showToast(typeValidation.error);
            return false;
        }

        // Validate category
        const categoryValidation = validateTextField(formData.category, 'Category', 1, 50);
        if (!categoryValidation.valid) {
            showToast(categoryValidation.error);
            return false;
        }

        // Validate description
        const descriptionValidation = validateTextField(formData.description, 'Description', 1, 200);
        if (!descriptionValidation.valid) {
            showToast(descriptionValidation.error);
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            console.log('Creating new ticket:', formData);

            // Sanitize data before sending
            const sanitizedData = {
                ...formData,
                amount: parseFloat(formData.amount).toFixed(2),
                type: formData.type.trim(),
                category: formData.category.trim(),
                description: formData.description.trim()
            };

            const result = await ApiService.createTicket(sanitizedData);

            if (result.success) {
                showToast('✅ Ticket created successfully');
                setTimeout(() => navigation.goBack(), 500);
            } else {
                showToast(result.error || 'Failed to create ticket');
            }
        } catch (error) {
            console.error('Error creating ticket:', error);
            showToast('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const setToday = () => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        handleInputChange('date', formattedDate);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>Add New Ticket</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Date *</Text>
                    <View style={styles.dateInputContainer}>
                        <TextInput
                            style={[styles.input, styles.dateInput]}
                            placeholder="YYYY-MM-DD"
                            value={formData.date}
                            onChangeText={(value) => handleInputChange('date', value)}
                            editable={!loading}
                        />
                        <TouchableOpacity
                            style={styles.todayButton}
                            onPress={setToday}
                            disabled={loading}
                        >
                            <Text style={styles.todayButtonText}>Today</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Amount ($) *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                        value={formData.amount}
                        onChangeText={(value) => handleInputChange('amount', value)}
                        editable={!loading}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Type *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., ticket, snacks, subscription"
                        value={formData.type}
                        onChangeText={(value) => handleInputChange('type', value)}
                        editable={!loading}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Category *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., action, drama, sci-fi"
                        value={formData.category}
                        onChangeText={(value) => handleInputChange('category', value)}
                        editable={!loading}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description *</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Movie title or description"
                        value={formData.description}
                        onChangeText={(value) => handleInputChange('description', value)}
                        multiline
                        numberOfLines={3}
                        editable={!loading}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.disabledButton]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Create Ticket</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.goBack()}
                    disabled={loading}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    form: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
    },
    dateInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateInput: {
        flex: 1,
        marginRight: 8,
    },
    todayButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    todayButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        padding: 16,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
    },
});
