# Setup Instructions for Movie Budget App

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Expo CLI** (optional, but recommended)
   ```bash
   npm install -g expo-cli
   ```

4. **Expo Go App** (for testing on physical device)
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

## Step-by-Step Setup

### 1. Install Server Dependencies

Open a terminal and navigate to the server directory:

```bash
cd example1/server
npm install
```

This will install:
- express (REST API framework)
- ws (WebSocket server)
- cors (Cross-origin resource sharing)
- body-parser (Request body parsing)

### 2. Install Mobile App Dependencies

Open a **new terminal** and navigate to the mobile app directory:

```bash
cd example1/mobile-app
npm install
```

This will install:
- expo and react-native
- react-navigation (navigation)
- axios (HTTP client)
- @react-native-async-storage/async-storage (local storage)

**Note:** This may take 5-10 minutes depending on your internet connection.

### 3. Start the Server

In the server terminal:

```bash
npm start
```

You should see:
```
Server running on port 2623
REST API: http://localhost:2623
WebSocket: ws://localhost:2623
```

**Keep this terminal running!**

### 4. Start the Mobile App

In the mobile app terminal:

```bash
npm start
```

This will start the Expo development server. You'll see a QR code and options:

```
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press d │ show developer tools
```

### 5. Run on Your Device

#### Option A: Physical Device (Recommended)

1. Install **Expo Go** app on your phone
2. Make sure your phone and computer are on the **same WiFi network**
3. Scan the QR code:
   - **Android**: Use Expo Go app
   - **iOS**: Use Camera app, it will open Expo Go

4. **IMPORTANT**: Update server configuration for physical devices:
   
   Edit `mobile-app/config.js`:
   ```javascript
   // Find your computer's IP address first
   // Windows: Run 'ipconfig' in terminal
   // Mac/Linux: Run 'ifconfig' or 'ip addr'
   
   const API_BASE_URL = 'http://YOUR_IP_ADDRESS:2623';
   const WS_URL = 'ws://YOUR_IP_ADDRESS:2623';
   ```
   
   For example, if your IP is 192.168.1.100:
   ```javascript
   const API_BASE_URL = 'http://192.168.1.100:2623';
   const WS_URL = 'ws://192.168.1.100:2623';
   ```

#### Option B: Android Emulator

1. Install Android Studio
2. Set up an Android Virtual Device (AVD)
3. Press `a` in the Expo terminal

#### Option C: iOS Simulator (Mac only)

1. Install Xcode from App Store
2. Install Command Line Tools
3. Press `i` in the Expo terminal

### 6. Verify Everything Works

1. The app should load and show "My Tickets" screen
2. You should see 5 sample tickets
3. Try adding a new ticket
4. Check the server terminal for log messages
5. Check the Reports and Insights tabs

## Troubleshooting

### Server won't start

**Error: Port 2623 is already in use**
- Close any other instance of the server
- Or change the port in `server/index.js` (line 10)

**Error: Cannot find module 'express'**
- Make sure you ran `npm install` in the server directory

### Mobile app won't start

**Error: Cannot find module**
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

**Error: Expo command not found**
- Install globally: `npm install -g expo-cli`
- Or use: `npx expo start`

### Can't connect to server from phone

**Connection refused or timeout**
1. Verify phone and computer are on **same WiFi**
2. Check your computer's firewall settings (allow port 2623)
3. Make sure you updated `config.js` with your computer's IP address
4. Try disabling VPN if you're using one

**To find your computer's IP address:**

Windows PowerShell:
```powershell
ipconfig
```
Look for "IPv4 Address" under your active network adapter.

Mac/Linux Terminal:
```bash
ifconfig
# or
ip addr show
```
Look for "inet" address (usually starts with 192.168.x.x or 10.x.x.x)

### WebSocket not connecting

1. Check server terminal for "WebSocket client connected" message
2. Restart the mobile app
3. Check firewall isn't blocking WebSocket connections

### App crashes or white screen

1. Restart Expo:
   ```bash
   npm start -- --clear
   ```

2. Clear Expo cache:
   ```bash
   rm -rf .expo
   npm start -- --clear
   ```

3. Reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Assets not found (icon.png, splash.png)

The placeholder text files need to be replaced with actual images:
- Create simple PNG images or use default Expo assets
- Or remove asset references from `app.json` temporarily

## Testing the App

### Test Offline Mode
1. Stop the server (Ctrl+C in server terminal)
2. Try viewing tickets (should show cached data)
3. Try adding a ticket (should show error - "online only")
4. Restart server
5. Pull to refresh in the app

### Test WebSocket Notifications
1. Open app on two devices/emulators
2. Add a ticket from one device
3. Watch for notification on the other device

### Test Reports
1. Add tickets with different dates (different months)
2. Go to Reports tab
3. See monthly totals sorted by amount

### Test Insights
1. Add tickets with different categories
2. Go to Insights tab
3. See top 3 genres

## Development Tips

- **Hot Reload**: Expo automatically reloads when you save files
- **Console Logs**: 
  - Server logs appear in server terminal
  - App logs appear in Expo terminal (or shake device → Debug Remote JS)
- **Debugging**: Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android) for dev menu

## Next Steps

1. Customize the app with your own styling
2. Add more ticket types
3. Implement additional features
4. Replace placeholder assets with real icons

## Need Help?

Common issues and solutions:
- **Clear Expo cache**: `npm start -- --clear`
- **Reinstall packages**: `rm -rf node_modules && npm install`
- **Check Node version**: `node --version` (should be 14+)
- **Update Expo**: `npm install expo@latest`

Good luck with your exam! 🎬🍿
