async function adminSignIn() {
 
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


            window.location = `admin-verify-account.html?email=${encodeURIComponent(email)}`;



        } else {
         
            showToast('error', 'Invalid Details', json.message);
           
//     essage; 




        }
    } else {
       testResponse('network_error');




    }
}
function ok() {
    testResponse('success');

}
function error() {
    testResponse('error');

}
function verification() {
    testResponse('verification');

}
function network_error() {
    testResponse('network_error');

}
// Toast function
function showToast(type, title, message) {
    const toast = document.getElementById('liveToast');
    const toastIcon = document.getElementById('toastIcon');
    const toastTitle = document.getElementById('toastTitle');
    const toastBody = document.getElementById('toastBody');

    const configs = {
        success: {icon: 'bi-check-circle-fill', class: 'text-success'},
        error: {icon: 'bi-x-circle-fill', class: 'text-danger'},
        warning: {icon: 'bi-exclamation-triangle-fill', class: 'text-warning'},
        info: {icon: 'bi-info-circle-fill', class: 'text-info'}
    };

    const config = configs[type] || configs.info;
    toastIcon.className = `bi ${config.icon} ${config.class} me-2`;
    toastTitle.textContent = title;
    toastBody.textContent = message;

    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}




// Test functions for demonstration
function testResponse(type) {
    const responses = {
        success: {
            status: true,
            message: "Login successful"
        },
        error: {
            status: false,
            message: "Invalid email or password"
        },
        verification: {
            status: true,
            message: "1"
        },
        network_error: null
    };

    const json = responses[type];

    if (type === 'network_error') {
        showToast('error', 'Network Error', 'Failed to connect to server');
        return;
    }

    if (json.status) {
        if (json.message === "1") {
            showToast('warning', 'Verification Required', 'Please verify your account to continue.');
        } else {
            showToast('success', 'Login Successful', 'Welcome back! Login successful.');
        }
    } else {
        showToast('error', 'Login Failed', json.message);
    }
}