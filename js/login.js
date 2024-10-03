const API_URL = "http://localhost:3500"; // Your API base URL

async function apiRequest(path, method = "GET", body = null, token = null) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    return response.json();
}


document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const result = await apiRequest("/login", "POST", { username, password });
    if (result.token) {
        localStorage.setItem("token", result.token);
        alert("Login successfull");
        window.location.href = "/products.html"; // Redirect after successful login
    } else {
        alert(result.error);
    }
});


