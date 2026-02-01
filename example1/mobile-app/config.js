// Configuration for the API and WebSocket connection
// IMPORTANT: If testing on physical device, replace 'localhost' with your computer's IP address
// Windows: Run 'ipconfig' | Mac/Linux: Run 'ifconfig'
// Example: const SERVER_HOST = '192.168.1.100';

const SERVER_HOST = '192.168.1.131'; // Change this to 'localhost' for emulator
const SERVER_PORT = '2623';

const API_BASE_URL = `http://${SERVER_HOST}:${SERVER_PORT}`;
const WS_URL = `ws://${SERVER_HOST}:${SERVER_PORT}`;

export { API_BASE_URL, WS_URL, SERVER_HOST };
