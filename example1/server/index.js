const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 2623;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database file path
const DB_PATH = path.join(__dirname, 'database.json');
const DB_LOCK_PATH = path.join(__dirname, 'database.lock');

// Lock mechanism for database writes
let writeLock = Promise.resolve();

// Helper functions for database operations
function readDatabase() {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        console.log('Database read successfully');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        return { tickets: [], nextId: 1 };
    }
}

function writeDatabase(data) {
    // Queue writes to prevent concurrent access issues
    writeLock = writeLock.then(() => {
        return new Promise((resolve, reject) => {
            try {
                // Write to temporary file first
                const tempPath = DB_PATH + '.tmp';
                fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');

                // Atomic rename
                fs.renameSync(tempPath, DB_PATH);

                console.log('Database written successfully');
                resolve(true);
            } catch (error) {
                console.error('Error writing database:', error);
                reject(error);
            }
        });
    });

    return writeLock;
}

// REST API Endpoints

// GET /tickets - Get all tickets
app.get('/tickets', (req, res) => {
    console.log('GET /tickets - Fetching all tickets');
    const db = readDatabase();
    res.json(db.tickets);
});

// GET /ticket/:id - Get specific ticket by ID
app.get('/ticket/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`GET /ticket/${id} - Fetching ticket details`);

    const db = readDatabase();
    const ticket = db.tickets.find(t => t.id === id);

    if (ticket) {
        res.json(ticket);
    } else {
        console.error(`Ticket with ID ${id} not found`);
        res.status(404).json({ error: 'Ticket not found' });
    }
});

// POST /ticket - Create a new ticket
app.post('/ticket', async (req, res) => {
    console.log('POST /ticket - Creating new ticket:', req.body);

    const { date, amount, type, category, description } = req.body;

    // Validation
    if (!date || !amount || !type || !category || !description) {
        console.error('Missing required fields');
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Additional validation
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }

    try {
        const db = readDatabase();

        const newTicket = {
            id: db.nextId,
            date: date.trim(),
            amount: amountNum,
            type: type.trim(),
            category: category.trim(),
            description: description.trim()
        };

        db.tickets.push(newTicket);
        db.nextId++;

        await writeDatabase(db);
        console.log('New ticket created successfully:', newTicket);

        // Broadcast new ticket to all WebSocket clients
        broadcastNewTicket(newTicket);

        res.status(201).json(newTicket);
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({ error: 'Failed to save ticket' });
    }
});

// DELETE /ticket/:id - Delete a ticket
app.delete('/ticket/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`DELETE /ticket/${id} - Deleting ticket`);

    try {
        const db = readDatabase();
        const index = db.tickets.findIndex(t => t.id === id);

        if (index !== -1) {
            const deletedTicket = db.tickets.splice(index, 1)[0];

            await writeDatabase(db);
            console.log('Ticket deleted successfully:', deletedTicket);
            res.json({ message: 'Ticket deleted successfully', ticket: deletedTicket });
        } else {
            console.error(`Ticket with ID ${id} not found`);
            res.status(404).json({ error: 'Ticket not found' });
        }
    } catch (error) {
        console.error('Error deleting ticket:', error);
        res.status(500).json({ error: 'Failed to delete ticket' });
    }
});

// GET /allTickets - Get all tickets (for reports and insights)
app.get('/allTickets', (req, res) => {
    console.log('GET /allTickets - Fetching all tickets for reports');
    const db = readDatabase();
    res.json(db.tickets);
});

// WebSocket Server
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`REST API: http://localhost:${PORT}`);
    console.log(`WebSocket: ws://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });

// Store all connected WebSocket clients
const clients = new Set();

wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');
    clients.add(ws);

    ws.on('message', (message) => {
        console.log('Received message from client:', message.toString());
    });

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
        clients.delete(ws);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clients.delete(ws);
    });

    // Send welcome message
    ws.send(JSON.stringify({
        type: 'connection',
        message: 'Connected to Movie Budget Server'
    }));
});

// Function to broadcast new ticket to all connected clients
function broadcastNewTicket(ticket) {
    const message = JSON.stringify({
        type: 'new_ticket',
        ticket: ticket,
        message: `New ${ticket.type} added: ${ticket.description} - $${ticket.amount}`
    });

    console.log(`Broadcasting to ${clients.size} clients:`, message);

    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    wss.clients.forEach(client => {
        client.close();
    });
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
