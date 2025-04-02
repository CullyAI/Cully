const API_URL = "https://cully.onrender.com/";

export const signup = async(user) => {
    console.log("API_URL:", API_URL)
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
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    });

    return res;
}
