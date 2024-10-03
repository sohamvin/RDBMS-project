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

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login.html"; // Redirect if not logged in
    }

    const bookings = await apiRequest("/booked_of_me", "GET", null, token);
    const manageBookingsDiv = document.getElementById("manageBookings");
    bookings.myProductsBookedByOthers.forEach(booking => {
        const bookingEl = document.createElement("div");
        bookingEl.innerHTML = `<h3>Product: ${booking.productid}</h3><p>Status: ${booking.status}</p>`;
        manageBookingsDiv.appendChild(bookingEl);
    });
});

