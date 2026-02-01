import { WS_URL } from '../config';

class WebSocketService {
    constructor() {
        this.ws = null;
        this.listeners = new Set();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.baseReconnectDelay = 2000;
        this.isIntentionalClose = false;
    }

    connect() {
        try {
            console.log('WebSocket: Attempting to connect to', WS_URL);
            this.isIntentionalClose = false;
            this.ws = new WebSocket(WS_URL);

            this.ws.onopen = () => {
                console.log('WebSocket: Connected successfully');
                this.reconnectAttempts = 0;
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('WebSocket: Message received', data);

                    // Notify all listeners
                    this.listeners.forEach(listener => {
                        try {
                            listener(data);
                        } catch (error) {
                            console.error('WebSocket: Error in listener', error);
                        }
                    });
                } catch (error) {
                    console.error('WebSocket: Error parsing message', error);
                }
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket: Error', error);
            };

            this.ws.onclose = () => {
                console.log('WebSocket: Connection closed');
                this.attemptReconnect();
            };
        } catch (error) {
            console.error('WebSocket: Connection error', error);
            this.attemptReconnect();
        }
    }

    attemptReconnect() {
        if (this.isIntentionalClose) {
            console.log('WebSocket: Intentional close, not reconnecting');
            return;
        }

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            // Exponential backoff: 2s, 4s, 8s, 16s, 32s
            const delay = this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
            console.log(`WebSocket: Reconnecting in ${delay / 1000}s (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

            setTimeout(() => {
                this.connect();
            }, delay);
        } else {
            console.log('WebSocket: Max reconnection attempts reached. Call connect() manually to retry.');
        }
    }

    addListener(callback) {
        this.listeners.add(callback);
        console.log('WebSocket: Listener added, total listeners:', this.listeners.size);
    }

    removeListener(callback) {
        this.listeners.delete(callback);
        console.log('WebSocket: Listener removed, remaining listeners:', this.listeners.size);
    }

    disconnect() {
        if (this.ws) {
            console.log('WebSocket: Disconnecting');
            this.isIntentionalClose = true;
            this.ws.close();
            this.ws = null;
        }
        this.listeners.clear();
        this.reconnectAttempts = 0;
    }

    send(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
            console.log('WebSocket: Message sent', message);
        } else {
            console.warn('WebSocket: Cannot send message, connection not open');
        }
    }
}

export default new WebSocketService();
