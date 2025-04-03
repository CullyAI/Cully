const API_URL = "http://127.0.0.1:5000";

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

export const generate_recipe = async(data) => {
    const res = await fetch(`${API_URL}/recipe`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });

    return res;
}
