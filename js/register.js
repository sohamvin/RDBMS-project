const API_URL = "http://localhost:3500"; // Your API base URL

async function apiRequest1(path, method = "GET", body = null, token = null) {
    const headers = { "Content-Type": "application/json" };
    // if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    return response.json();
}



document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();  // Prevent form submission

    // Gather form data
    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const pincode = document.getElementById("pincode").value;

    // Call API to register
    const result = await apiRequest1("/register", "POST", { username, password, firstName, lastName, pincode });

    if (result.id) {
        alert("Registration successful! Redirecting to login...");
        window.location.href = "/login.html";  // Redirect to the login page
    } else {
        alert(result.error || "An error occurred during registration");
    }
});
