const API_URL = "http://192.168.4.59:8888/";

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


export const get_profile = async(user) => {
    const res = await fetch(`${API_URL}/get_profile`, {
        method: "POST",
        body: JSON.stringify(user),
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    return await res.json();
}


export const set_profile = async(user) => {
    const res = await fetch(`${API_URL}/set_profile`, {
        method: "POST",
        body: JSON.stringify(user),
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    return await res.json();
}