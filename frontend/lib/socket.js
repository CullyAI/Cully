import { io } from "socket.io-client";

const API_URL = "http://10.0.0.242:8888";  // your Flask server
const socket = io(API_URL, {
  transports: ['websocket'],  // force WebSocket only (skip long-polling)
  withCredentials: true       // allows cookie/session-based auth
});

export const generate_recipe = (data, onChunk, onDone, onError) => {
  socket.emit("generate_recipe", data);

  socket.off("recipe_chunk");
  socket.on("recipe_chunk", (msg) => {
      onChunk(msg.chunk);
  });

  socket.off("recipe_complete");
  socket.on("recipe_complete", () => {
      onDone();
  });

  socket.off("error");
  socket.on("error", (err) => {
      onError(err.message);
  });
};