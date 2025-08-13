

async   function loadProfile() {
   console.log("load poroi");
    const response = await fetch("Profile", {
        method: "GET",
        credentials: "include"
    });
    
    if (response.ok) {
        const json = await response.json();
        console.log(json);
        if (json.status) {
             document.getElementById("nic").value = json.nic;
        document.getElementById("email").value = json.email;
             document.getElementById("fullName").value = json.fullName;
        document.getElementById("phone").value = json.poneNumber;
             document.getElementById("dateOfBirth").value = json.dob;
        document.getElementById("role").value = json.role;
//        document.getElementById("profile").value = json.lastName;
           
            
        } else {
            
            
        }
        
        
        
    } else {
        console.log("Response error");
    }
    
    
    
}