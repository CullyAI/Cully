import socket from "./socket";

const API_URL = "http://10.0.0.242:8888";

export const signup = async(user) => {
    const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    return await res.json();
}

export const login = async(user) => {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        body: JSON.stringify(user),
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    return await res.json();
}

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