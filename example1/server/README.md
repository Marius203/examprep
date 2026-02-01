# Movie Budget Server

## Installation

```bash
npm install
```

## Run Server

```bash
npm start
```

Server will run on port 2623.

## API Endpoints

- `GET /tickets` - Get all tickets
- `GET /ticket/:id` - Get specific ticket by ID
- `POST /ticket` - Create a new ticket
- `DELETE /ticket/:id` - Delete a ticket
- `GET /allTickets` - Get all tickets for reports

## WebSocket

WebSocket server runs on the same port. Connect to `ws://localhost:2623` to receive real-time notifications when new tickets are added.
