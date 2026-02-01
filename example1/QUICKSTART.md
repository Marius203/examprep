# Movie Budget App - Quick Start Guide

## Installation & Setup

### 1. Server Setup
```bash
cd server
npm install
npm start
```
Server will run on http://localhost:2623

### 2. Mobile App Setup
```bash
cd mobile-app
npm install
npm start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator  
- Or scan QR code with Expo Go app

## Important Configuration

If testing on a **physical device**, you must update the server URLs in `mobile-app/config.js`:

```javascript
// Replace localhost with your computer's IP address
const API_BASE_URL = 'http://YOUR_IP_ADDRESS:2623';
const WS_URL = 'ws://YOUR_IP_ADDRESS:2623';
```

To find your IP address:
- Windows: `ipconfig` (look for IPv4 Address)
- Mac/Linux: `ifconfig` or `ip addr`

## Project Structure

```
example1/
├── server/                 # Node.js backend
│   ├── package.json
│   ├── index.js           # Server with REST API and WebSocket
│   └── database.json      # JSON database
└── mobile-app/            # React Native frontend
    ├── package.json
    ├── app.json
    ├── App.js             # Main app component
    ├── config.js          # Server URLs (UPDATE THIS FOR PHYSICAL DEVICES!)
    ├── screens/           # All app screens
    └── services/          # API, Storage, WebSocket services
```

## Features Checklist

✅ View ticket list (with offline support)  
✅ View ticket details (with offline support)  
✅ Add new ticket (online only)  
✅ Delete ticket (online only)  
✅ Monthly spending reports  
✅ Top 3 genres insights  
✅ WebSocket real-time notifications  
✅ Progress indicators  
✅ Error handling & logging  

## Testing Tips

1. **Start server first**, then mobile app
2. Add some tickets to see reports and insights
3. Try stopping server to test offline mode
4. Add a ticket to see WebSocket notification
5. Check console logs for debugging

## Troubleshooting

**Can't connect to server from phone?**
- Make sure phone and computer are on same WiFi
- Update `mobile-app/config.js` with your computer's IP
- Check firewall isn't blocking port 2623

**WebSocket not working?**
- Check server console for connection messages
- Restart the app to reconnect

**Expo app crashes?**
- Clear cache: `npm start -- --clear`
- Reinstall dependencies: `rm -rf node_modules && npm install`
