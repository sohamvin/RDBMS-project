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
        return;
    }

    // Fetch user details
    const user = await apiRequest("/getUser?self=true", "GET", null, token);
    console.log(user);

    const userDetailsDiv = document.getElementById("userDetails");

    if (user && user.username) {
        userDetailsDiv.innerHTML = `
            <img src="${user.imageProfile || 'default-profile.png'}" alt="Profile Image" class="profile-image">
            <span>${user.firstName} ${user.lastName} (${user.username})</span>
        `;
    }

    // Fetch products
    const products = await apiRequest("/products", "GET", null, token);

    const productDiv = document.getElementById("products");

    products.forEach(product => {
        // Format the dates
        const availableFrom = new Date(product.availablefrom);
        const availableTill = new Date(product.availabletill);

        // Create a new product element
        const productEl = document.createElement("div");
        productEl.className = "product";

        // Display product information with formatted dates
        productEl.innerHTML = `
            <h2>${product.producttype}</h2>
            <h3>${product.description}</h3>
            <p><strong>Price:</strong> $${product.askprice}</p>
            <p><strong>Available From:</strong> ${availableFrom.toLocaleDateString()}</p>
            <p><strong>Available Till:</strong> ${availableTill.toLocaleDateString()}</p>
            <label for="whenDate-${product.id}">When would you like to book?</label>
            <input type="date" id="whenDate-${product.id}" class="when-date" min="${availableFrom.toISOString().split('T')[0]}" max="${availableTill.toISOString().split('T')[0]}" required>
            <label for="hours-${product.id}">Number of Hours:</label>
            <input type="number" id="hours-${product.id}" class="hours-input" min="1" value="1">
            <button class="book-btn" data-product-id="${product.id}">Book Product</button>
            <img src="${product.imagelink}" alt="Product Image">
        `;

        productDiv.appendChild(productEl);
    });

    // Add event listener to all "Book Product" buttons
    document.querySelectorAll(".book-btn").forEach(button => {
        button.addEventListener("click", async (e) => {
            const productId = e.target.getAttribute("data-product-id");
            const hoursInput = document.getElementById(`hours-${productId}`);
            const whenDateInput = document.getElementById(`whenDate-${productId}`);
            const numberOfHours = parseInt(hoursInput.value, 10);
            const whenDate = new Date(whenDateInput.value);

            if (!whenDate) {
                alert("Please select a valid date for booking.");
                return;
            }

            // Fetch the product's availableFrom and availableTill dates for validation
            const product = products.find(p => p.id === productId);
            const availableFrom = new Date(product.availablefrom);
            const availableTill = new Date(product.availabletill);

            // Validate if the selected whenDate is within the valid range
            if (whenDate < availableFrom || whenDate > availableTill) {
                alert(`Please select a date between ${availableFrom.toLocaleDateString()} and ${availableTill.toLocaleDateString()}.`);
                return;
            }

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
                whenDate: whenDate.toISOString() // Send the selected whenDate in ISO format
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
