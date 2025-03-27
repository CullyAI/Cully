const API_URL = "http://127.0.0.1:5000";

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
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    return await res.json();
}

// curl -i -X POST http://127.0.0.1:5000/signup \
//   -H "Origin: http://localhost:8081" \
//   -H "Content-Type: application/json" \
//   -d '{"username": "test", "email": "test@example.com", "password":"secret" }'

// curl -i -X OPTIONS http://127.0.0.1:5000/signup \
//      -H "Origin: http://localhost:8081" \
//      -H "Access-Control-Request-Method: POST" \
//      -H "Access-Control-Request-Headers: Content-Type"