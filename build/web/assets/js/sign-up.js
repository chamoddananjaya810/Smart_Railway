/* 
 * Handles user signup with both text fields and file upload.
 * Uses FormData to send multipart/form-data to the SignUp servlet.
 */

async function signUp() {
    try {
      
        const fullName = document.getElementById("fullName").value.trim();
        const nic = document.getElementById("nic").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const dateOfBirth = document.getElementById("dateOfBirth").value;
        const gender = document.getElementById("gender").value;
        const role = document.getElementById("role").value;
        const profilePic = document.getElementById("profilePic").files[0];

      
        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("nic", nic);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("phone", phone);
        formData.append("dateOfBirth", dateOfBirth);
        formData.append("gender", gender);
        formData.append("role", role);
        if (profilePic) {
            formData.append("profilePic", profilePic);
        }

       
        const response = await fetch("SignUp", {
            method: "POST",
            body: formData 
        });

       
        if (response.ok) {
            const json = await response.json();
            console.log("Server Response:", json);

            if (json.status) {
              
                window.location = "verify-account.html";
            } else {
         
                if (json.message === "Email not found") {
                    window.location = "sign-in.html";
                } else {
                    document.getElementById("message").innerHTML = json.message;
                }
            }
        } else {
            document.getElementById("message").innerHTML = "Registration failed. Please try again.";
        }

    } catch (error) {
        console.error("Signup Error:", error);
        document.getElementById("message").innerHTML = "An error occurred. Please try again.";
    }
}
