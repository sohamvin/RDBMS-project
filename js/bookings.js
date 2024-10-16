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
    // [
    //     {
    //       "id": "4c3e004d-7770-45fb-9c61-9eaf00db2f2b",
    //       "availablefrom": "2024-09-30T03:30:00.000Z",
    //       "availabletill": "2024-10-05T12:30:00.000Z",
    //       "askprice": 1500,
    //       "producttype": "Electronics",
    //       "numberofhours": 1,
    //       "whendate": "2024-10-02T20:52:57.487Z",
    //       "imagelink": "https://example.com/image.jpg",
    //       "pincode": "123456",
    //       "fromuserid": "8ac643e6-2ecb-420f-9ac5-f3277e4a2ad4"
    //     }
    //   ]

    // Fetch products
    const products = await apiRequest("/mybookings", "GET", null, token);

    const productDiv = document.getElementById("bookings");

    console.log(products);
    


    products.forEach(product => {
        // Format the dates
        const availableFrom = new Date(product.availablefrom).toLocaleDateString();
        const availableTill = new Date(product.availabletill).toLocaleDateString();
        const whend = new Date(product.whendate).toLocaleDateString();
    
        // Create a new product element
        const productEl = document.createElement("div");
        productEl.className = "product";
    
        // Display product information with formatted dates and add input for booking
        productEl.innerHTML = `
            <h2>${product.producttype}</h2>
            <h3>${product.description}</h3>
            <p><strong>Price:</strong> $${product.askprice}</p>
            <p><strong>Available From:</strong> ${availableFrom}</p>
            <p><strong>Available Till:</strong> ${availableTill}</p>
            <p><strong>From When:</strong> ${whend}</p>
            <p><strong>Pincode:</strong> ${product.pincode}</p>
            <p><strong>Number of hours:</strong> ${product.numberofhours}</p>
            <img src="${product.imagelink}" alt="Product Image">
            <h5>${product.status}</h5>
        `;
    
        // If the product status is "Accepted", add additional information
        if (product.status === "Accepted") {
            const additionalInfo = document.createElement("div");
            additionalInfo.innerHTML = `
                <p><strong>This product is From:</strong> ${product.firstname}</p>
                <p><strong>And his phone number:</strong> ${product.phonenumber}</p>
            `;
            productEl.appendChild(additionalInfo);
        }
    
        // Append the product element to the container
        productDiv.appendChild(productEl);
    });
    

    // Add event listener to all "Book Product" buttons
});
