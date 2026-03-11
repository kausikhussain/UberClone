import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    autoConnect: false, // We connect manually after authentication
});

export const connectSocket = (token) => {
    if (socket.connected) return;
    socket.auth = { token };
    socket.connect();
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};

export default socket;
