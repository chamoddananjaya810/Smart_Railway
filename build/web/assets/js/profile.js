

async function loadProfile() {
    console.log("load profile");
    const response = await fetch("Profile", {
        method: "GET",
        credentials: "include"
    });

    if (response.ok) {
        const json = await response.json();
        console.log(json);

        if (json.status) {

            document.getElementById("profileImage").src = "product-images/" + json.id + "/image1.png";

            document.getElementById("nic").value = json.nic;
            document.getElementById("email").value = json.email;
            document.getElementById("fullName").value = json.fullName;
            document.getElementById("phone").value = json.poneNumber;
            document.getElementById("dateOfBirth").value = json.dob;
            document.getElementById("role").value = json.role;




        }
    } else {
        console.log("Response error");
    }
}
