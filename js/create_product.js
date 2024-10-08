const API_URL = "http://localhost:3500"; // Your API base URL

async function apiRequest(path, method = "POST", body = null, token = null) {
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers, 
        body
    });

    return response.json();
}

document.getElementById("productForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Gather the form data
    const availableFrom = document.getElementById("availableFrom").value;
    const availableTill = document.getElementById("availableTill").value;
    const askPrice = document.getElementById("askPrice").value;
    const imageFile = document.getElementById("imageFile").files[0]; // Get the image file
    const description = document.getElementById("description").value;
    const pincode = document.getElementById("pincode").value;
    const productType = document.getElementById("productType").value;
    const companyName = document.getElementById("companyName").value;
    const taluka = document.getElementById("taluka").value;

    const formData = new FormData(); // Create FormData object

    // Append form fields to the FormData object
    formData.append("availableFrom", availableFrom);
    formData.append("availableTill", availableTill);
    formData.append("askPrice", askPrice);
    formData.append("image", imageFile); // Appending the file here
    formData.append("description", description);
    formData.append("pincode", pincode);
    formData.append("productType", productType);
    formData.append("companyName", companyName);
    formData.append("taluka", taluka);

    const token = localStorage.getItem("token");
    const result = await apiRequest("/products", "POST", formData, token);

    if (result.id) {
        alert("Product created successfully!");
        window.location.href = "/products.html";
    } else {
        alert(result.error);
    }
});
