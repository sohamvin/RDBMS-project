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

document.getElementById("productForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const availableFrom = document.getElementById("availableFrom").value;
    const availableTill = document.getElementById("availableTill").value;
    const askPrice = document.getElementById("askPrice").value;
    const imageLink = document.getElementById("imageLink").value;
    const description = document.getElementById("description").value;
    const pincode = document.getElementById("pincode").value;
    const productType = document.getElementById("productType").value;
    const companyName = document.getElementById("companyName").value;
    const taluka = document.getElementById("taluka").value;

    const token = localStorage.getItem("token");
    const result = await apiRequest("/products", "POST", { availableFrom, availableTill, askPrice, imageLink, description, pincode, productType, companyName, taluka }, token);

    if (result.id) {
        alert("Product created successfully!");
        window.location.href = "/products.html";
    } else {
        alert(result.error);
    }
});

