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

    // Fetch products
    const products = await apiRequest("/products", "GET", null, token);

    const productDiv = document.getElementById("products");

    products.forEach(product => {
        // Format the dates
        const availableFrom = new Date(product.availablefrom).toLocaleDateString();
        const availableTill = new Date(product.availabletill).toLocaleDateString();

        // Create a new product element
        const productEl = document.createElement("div");
        productEl.className = "product";

        // Display product information with formatted dates
        productEl.innerHTML = `
            <h2>${product.producttype}</h2>
            <h3>${product.description}</h3>
            <p><strong>Price:</strong> $${product.askprice}</p>
            <p><strong>Available From:</strong> ${availableFrom}</p>
            <p><strong>Available Till:</strong> ${availableTill}</p>
            <label for="hours-${product.id}">Number of Hours:</label>
            <input type="number" id="hours-${product.id}" class="hours-input" min="1" value="1">
            <button class="book-btn" data-product-id="${product.id}">Book Product</button>
        `;

        productDiv.appendChild(productEl);
    });

    // Add event listener to all "Book Product" buttons
    document.querySelectorAll(".book-btn").forEach(button => {
        button.addEventListener("click", async (e) => {
            const productId = e.target.getAttribute("data-product-id");
            const hoursInput = document.getElementById(`hours-${productId}`);
            const numberOfHours = parseInt(hoursInput.value, 10);

            if (isNaN(numberOfHours) || numberOfHours <= 0) {
                alert("Please enter a valid number of hours.");
                return;
            }

            const bookingData = {
                productId: productId,
                numberOfHours: numberOfHours,
                status: "Pending",
                bookerSign: false,
                lenderSign: false,
                whenDate: new Date().toISOString()
            };

            const response = await apiRequest("/bookings", "POST", bookingData, token);

            if (response.id) {
                alert("Booking successful!");
            } else {
                alert(response.error || "Booking failed.");
            }
        });
    });
});
