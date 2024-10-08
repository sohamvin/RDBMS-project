const API_URL = "http://localhost:3500"; // Your API base URL

async function apiRequest1(path, method = "POST", formData) {
    const response = await fetch(`${API_URL}${path}`, {
        method,
        body: formData // Using FormData instead of JSON
    });
    
    return response.json();
}

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();  // Prevent form submission

    // Get the phone number
    const phoneNumber = document.getElementById("phoneNumber").value;

    // Validate phone number (should be exactly 10 digits)
    const phoneNumberPattern = /^\d{10}$/;  // Regular expression to check for exactly 10 digits
    if (!phoneNumberPattern.test(phoneNumber)) {
        alert("Please enter a valid 10-digit phone number.");
        return;  // Exit the function if the phone number is invalid
    }

    // Gather form data
    const formData = new FormData();
    formData.append("username", document.getElementById("regUsername").value);
    formData.append("password", document.getElementById("regPassword").value);
    formData.append("firstName", document.getElementById("firstName").value);
    formData.append("lastName", document.getElementById("lastName").value);
    formData.append("pincode", document.getElementById("pincode").value);
    formData.append("phoneNumber", phoneNumber);  // Add validated phone number to form data

    // Append the image file (if any)
    const imageFile = document.getElementById("image").files[0];
    if (imageFile) {
        formData.append("image", imageFile);
    }

    // Call API to register
    const result = await apiRequest1("/register", "POST", formData);

    if (result.id) {
        alert("Registration successful! Redirecting to login...");
        window.location.href = "/login.html";  // Redirect to the login page
    } else {
        alert(result.error || "An error occurred during registration");
    }
});
