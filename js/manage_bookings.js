const API_URL = "http://localhost:3500"; // Your API base URL

async function apiRequest(path, method = "GET", body = null, token = null) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        
        return { error: errorData.message || "Request failed" };
    }

    return response.json();
}

// Function to handle status update
async function updateBookingStatus(bookingId, newStatus) {
    const token = localStorage.getItem("token");
    const response = await apiRequest(`/update_booking_status?bookingId=${bookingId}`, "PUT", { status: newStatus }, token);
    if (response.error) {
        alert(response.error);
    } else {
        alert("Booking status updated successfully!");
        window.location.reload(); // Reload the page to show updated status
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login.html"; // Redirect if not logged in
        return;
    }

    const bookings = await apiRequest("/booked_of_me", "GET", null, token);
    const manageBookingsDiv = document.getElementById("manageBookings");

    bookings.myProductsBookedByOthers.forEach(booking => {
        const bookingEl = document.createElement("div");
        bookingEl.classList.add("booking-item");

        // Format dates for display
        const availableFrom = new Date(booking.availablefrom).toLocaleString();
        const availableTill = new Date(booking.availabletill).toLocaleString();
        const whenDate = new Date(booking.whendate).toLocaleString();
        const bookingDate = new Date(booking.bookingdate).toLocaleString();

        // Create dropdown for status update
        const statusDropdown = `
            <select class="status-dropdown" data-booking-id="${booking.bid}">
                <option value="Pending" ${booking.status === "Pending" ? "selected" : ""}>Pending</option>
                <option value="Accepted" ${booking.status === "Accepted" ? "selected" : ""}>Accepted</option>
                <option value="Rejected" ${booking.status === "Rejected" ? "selected" : ""}>Rejected</option>
            </select>
        `;

        console.log(booking.bid);
        

        // Create booking element with product details and status dropdown
        bookingEl.innerHTML = `
            <h3>Product: ${booking.producttype} - ${booking.companyname}</h3>
            <img src="${booking.imagelink}" alt="${booking.description}" class="product-image">
            <p><strong>Description:</strong> ${booking.description}</p>
            <p><strong>Price:</strong> $${booking.askprice}</p>
            <p><strong>Available From:</strong> ${availableFrom}</p>
            <p><strong>Available Till:</strong> ${availableTill}</p>
            <p><strong>When Date:</strong> ${whenDate}</p>
            <p><strong>Booking Date:</strong> ${bookingDate}</p>
            <p><strong>Status:</strong> ${statusDropdown}</p>
            <button class="update-status-btn" data-booking-id="${booking.bid}">Update Status</button>
        `;

        manageBookingsDiv.appendChild(bookingEl);
    });

    // Add event listeners to handle status updates
    document.querySelectorAll(".update-status-btn").forEach(button => {
        button.addEventListener("click", async (e) => {
            const bookingId = e.target.getAttribute("data-booking-id");
            const newStatus = document.querySelector(`.status-dropdown[data-booking-id="${bookingId}"]`).value;
            await updateBookingStatus(bookingId, newStatus);
        });
    });
});
