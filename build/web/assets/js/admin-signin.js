async function adminSignIn() {
    console.log("okkkkkk");
    console.log("okkkkkk");
    console.log("okkkkkk");
    console.log("okkkkkk");
    console.log("okkkkkk");
    console.log("okkkkkk");
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;


    const adminSignIn = {
        email: email,
        password: password
    };

    const adminSignInJson = JSON.stringify(adminSignIn);

    const response = await fetch("../AdminSignIn", {
        //../AdminSignIn
        method: "POST",
        body: adminSignInJson,
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.ok) {
        const  json = await response.json();
        console.log(response);
        if (json.status) {


            window.location = "admin-verify-account.html";



        } else {
            showAdvancedAlert('error', 'Error!', json.message, {
                duration: 10000,
                pauseOnHover: true
            });
           
//     essage; 




        }
    } else {
        showAdvancedAlert('error', 'Error!', 'SignIn Filed.', {
            duration: 10000,
            pauseOnHover: true
        });


//        showAdvancedAlert('success', 'Success!', 'You have logged in successfully.')
//        showAdvancedAlert('error', 'Error!', 'Something went wrong.', {
//            duration: 10000,
//            pauseOnHover: true
//        });
//
//        Alert.success('Welcome!', 'Login successful');
//        Alert.quick.info('Settings saved!');

    }
}
