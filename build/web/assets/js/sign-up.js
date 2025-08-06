/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


async  function signUp() {
    
    
    const fullName = document.getElementById("fullName").value;
    const nic = document.getElementById("nic").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const dateOfBirth = document.getElementById("dateOfBirth").value;
    const gender = document.getElementById("gender").value;
    const role = document.getElementById("role").value;
    const profilePic = document.getElementById("profilePic").value;

    const user = {
        fullName: fullName,
        nic: nic,
        email: email,
        password: password,
        phone: phone,
        dateOfBirth: dateOfBirth,
        gender: gender,
        role: role,
        profilePic: profilePic
    };

    const userJson = JSON.stringify(user);

    const response = await fetch("SignUp", {
        method: "POST",
        body: userJson,
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.ok) {
        const  json = await response.json();
        console.log(json.status);
        if (json.status) {
           
            window.location = "verify-account.html";
        } else {
            
            if (json.message==="Email not found"){
                window.location = "sign-in.html";
                
            }else{
                document.getElementById("message").innerHTML = json.message;
             
                
            }
           
        }
    } else {
        document.getElementById("message").innerHTML = "Registation Filed Please try agin"
    }

//    // Optional: parse JSON response

}
