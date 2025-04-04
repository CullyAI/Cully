import { io } from "socket.io-client";

const API_URL = "http://10.0.0.242:8888";  // your Flask server
const socket = io(API_URL, {
  transports: ['websocket'],  // force WebSocket only (skip long-polling)
  withCredentials: true       // allows cookie/session-based auth
});

export default socket;