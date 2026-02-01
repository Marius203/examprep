# Movie Budget Mobile Application

A React Native mobile application for managing entertainment budgets, tracking movie tickets, snacks, and subscriptions.

## 📱 Features

### Main Section
- **View Ticket List**: Browse all your movie entertainment transactions
- **View Ticket Details**: See detailed information for each ticket
- **Add New Ticket**: Create new transactions (online only)
- **Delete Ticket**: Remove unwanted records (online only)
- **Offline Support**: View cached data when offline

### Reports Section
- **Monthly Entertainment Analysis**: View spending totals by month in descending order

### Insights Section
- **Top Movie Genres**: See your top 3 spending categories

### Additional Features
- **WebSocket Notifications**: Real-time notifications when new tickets are added
- **Progress Indicators**: Loading states during server operations
- **Error Handling**: User-friendly error messages and logging
- **Offline Mode**: Cached data available when disconnected

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Node.js with Express
- **Database**: Local JSON file
- **Real-time**: WebSocket for notifications
- **Storage**: AsyncStorage for offline support

## 📦 Installation

### Server Setup

1. Navigate to the server directory:
```bash
cd example1/server
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

Server will run on `http://localhost:2623`

### Mobile App Setup

1. Navigate to the mobile app directory:
```bash
cd example1/mobile-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the Expo development server:
```bash
npm start
```

4. Run on your device:
   - Scan the QR code with Expo Go app (Android/iOS)
   - Or press `a` for Android emulator
   - Or press `i` for iOS simulator

## 🔧 Configuration

### Server Configuration
- **Port**: 2623 (configured in [server/index.js](server/index.js#L10))
- **Database**: [server/database.json](server/database.json)

### Mobile App Configuration
- **API URL**: `http://localhost:2623` (configured in [mobile-app/config.js](mobile-app/config.js))
- **WebSocket URL**: `ws://localhost:2623`

**Note**: If testing on a physical device, replace `localhost` with your computer's IP address in [mobile-app/config.js](mobile-app/config.js).

## 📝 API Endpoints

- `GET /tickets` - Get all tickets
- `GET /ticket/:id` - Get specific ticket by ID
- `POST /ticket` - Create a new ticket
- `DELETE /ticket/:id` - Delete a ticket
- `GET /allTickets` - Get all tickets for reports/insights

## 📊 Data Structure

Each ticket contains:
- **id**: Unique identifier (integer)
- **date**: Transaction date (YYYY-MM-DD format)
- **amount**: Cost (decimal)
- **type**: Transaction type (ticket, snacks, subscription)
- **category**: Movie genre (action, drama, sci-fi, etc.)
- **description**: Movie title or description

## 🚀 Usage

1. Start the server first
2. Start the mobile app
3. Add your first ticket using the "Add Ticket" button
4. View detailed information by tapping on any ticket
5. Check Reports tab for monthly analysis
6. Check Insights tab for top genres
7. Watch for real-time notifications when new tickets are added!

## 📱 App Structure

```
mobile-app/
├── App.js                          # Main app component with navigation
├── config.js                       # API and WebSocket configuration
├── screens/
│   ├── TicketListScreen.js         # List all tickets
│   ├── TicketDetailsScreen.js      # View/delete ticket details
│   ├── AddTicketScreen.js          # Create new ticket
│   ├── ReportsScreen.js            # Monthly spending analysis
│   └── InsightsScreen.js           # Top genres by spending
└── services/
    ├── ApiService.js               # REST API calls
    ├── StorageService.js           # Local data persistence
    └── WebSocketService.js         # Real-time notifications
```

## 🔍 Features Breakdown

### A. View Ticket List (1p)
- Fetches all tickets from server
- Displays offline message with retry option
- Caches data for offline viewing
- Pull-to-refresh functionality

### B. View Ticket Details (1p)
- Retrieves specific ticket information
- Available offline with cached data
- Shows all ticket fields

### C. Add New Ticket (1p)
- Form validation for all fields
- Online-only feature
- Real-time broadcast to all connected clients

### D. Delete Ticket (1p)
- Confirmation dialog before deletion
- Online-only feature
- Updates local cache

### E. Monthly Entertainment Analysis (1p)
- Computes monthly spending totals
- Sorted in descending order
- Shows transaction count per month

### F. Top Movie Genres (1p)
- Calculates top 3 categories by spending
- Visual ranking with medals
- Displays total amount and transaction count

### G. WebSocket Notifications (1p)
- Real-time alerts for new tickets
- Alert dialog and toast notification
- Auto-reconnection on disconnect

### H. Progress Indicators (0.5p)
- Loading spinners during API calls
- Pull-to-refresh indicators
- Button loading states

### I. Error Handling & Logging (0.5p)
- User-friendly error messages
- Console logging for all operations
- Offline mode indicators

## 🧪 Testing

1. **Test Offline Mode**:
   - Stop the server
   - Try viewing tickets (should show cached data)
   - Try adding/deleting (should show error)

2. **Test WebSocket**:
   - Open app on multiple devices/emulators
   - Add a ticket from one device
   - Watch for notification on others

3. **Test Reports**:
   - Add tickets with different dates
   - Check Reports tab for monthly totals

4. **Test Insights**:
   - Add tickets with different categories
   - Check Insights tab for top 3 genres

## 📄 License

This is an exam preparation project for Mobile Applications course.

## 👨‍💻 Development Notes

- The server uses a simple JSON file for data persistence
- WebSocket connection auto-reconnects up to 5 times
- All server interactions are logged to console
- AsyncStorage is used for client-side caching
- The app follows React Native and Expo best practices
