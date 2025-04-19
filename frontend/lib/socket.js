import { io } from "socket.io-client";

const API_URL = "http://10.0.0.242:8888";
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

export const generate_macros = (data, onDone, onError) => {
    socket.emit("generate_macros", data);

    socket.off("macros_complete");
    socket.on("macros_complete", (response) => {
        onDone(response);
    });

    socket.off("error");
    socket.on("error", (err) => {
        onError(err.message);
    });
}


export const send_multimodal = (data, onResponse, onError) => {
    socket.emit("send_multimodal", data);

    socket.off("audio_response")
    socket.on("audio_response", ({ audio }) => {
        onResponse(audio);
    });

    socket.off("error");
    socket.on("error", (err) => {
        onError(err.message);
    });
}


export const send_audio = (data, onResponse, onError) => {
    socket.emit("send_audio", data);

    socket.off("audio_response")
    socket.on("audio_response", ({ audio }) => {
        onResponse(audio);
    });

    socket.off("error");
    socket.on("error", (err) => {
        onError(err.message);
    });
}


export const send_interruption = (user) => {
    socket.emit("send_interruption", user);
}