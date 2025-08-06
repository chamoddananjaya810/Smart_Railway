async function adminVerifyAccount() {
    const code1 = document.getElementById("code1").value.trim();
    const code2 = document.getElementById("code2").value.trim();
    const code3 = document.getElementById("code3").value.trim();
    const code4 = document.getElementById("code4").value.trim();
    const code5 = document.getElementById("code5").value.trim();

    const vcode = code1 + code2 + code3 + code4 + code5;
    console.log(vcode);
    const verification = {
        vcode: vcode
    };
    const  verificationJson = JSON.stringify(verification);

    const response = await fetch("../AdminVerifyAccount", {
        method: "POST",
        body: verificationJson,
        headers: {
            "Content-Type": "application/json"
        }
        // Ensure you send a stringified JSON object
    });
    if (response.ok) {
        const  json = await response.json();
        if (json.status) {
            window.location = "dashboard.html";
        } else {

            if (json.massage === "1") {
                window.location = "admin-signin.html";
            } else
            {

                document.getElementById("message").innerHTML = json.massage;
            }




        }
    } else {

        document.getElementById("massage").innerHTML = "Verification failed"
    }
}