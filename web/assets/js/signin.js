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

// FIXED VERSION - Your corrected signIn function
async function signIn(event) {
    if (event)
        event.preventDefault(); // Prevent form submission if called from form

    // Show loading state
    const signInBtn = document.getElementById("signInBtn");
    const originalBtnText = signInBtn.innerHTML;
    signInBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Signing in...';
    signInBtn.disabled = true;

    try {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        console.log(email);
        console.log(password);

        const signInData = {
            email: email,
            password: password,
        };

        const signInJson = JSON.stringify(signInData);

        const response = await fetch("SignIn", {
            method: "POST",
            body: signInJson,
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const json = await response.json();

            if (json.status) {
                // Success cases
                if (json.message === "1") {
                    showToast('warning', 'Verification Required', 'Please verify your account to continue.');
                    setTimeout(() => {
                        window.location = "verify-account.html";
                    }, 2000);
                } else {
                    showToast('success', 'Login Successful', 'Welcome back! Redirecting to dashboard...');
                    setTimeout(() => {
                        window.location = "index.html";
                    }, 2000);
                }
            } else {
                // Error from server
                // Fixed: json.massage → json.message
                const errorMessage = json.message || 'Login failed. Please try again.';
                showToast('error', 'Login Failed', errorMessage);

                // Fallback: still update the message div
                const messageDiv = document.getElementById("message");
                messageDiv.className = "alert alert-danger";
                messageDiv.innerHTML = errorMessage;
                messageDiv.classList.remove('d-none');
            }
        } else {
            // Network/HTTP error
            const errorMsg = "Sign in failed. Please check your connection.";
            showToast('error', 'Connection Error', errorMsg);

            // Fallback message
            const messageDiv = document.getElementById("message");
            messageDiv.className = "alert alert-danger";
            messageDiv.innerHTML = errorMsg;
            messageDiv.classList.remove('d-none');
        }
    } catch (error) {
        // JavaScript/Network error
        console.error('SignIn error:', error);
        showToast('error', 'Unexpected Error', 'An unexpected error occurred. Please try again.');

        const messageDiv = document.getElementById("message");
        messageDiv.className = "alert alert-danger";
        messageDiv.innerHTML = "An unexpected error occurred.";
        messageDiv.classList.remove('d-none');
    } finally {
        // Reset button state
        signInBtn.innerHTML = originalBtnText;
        signInBtn.disabled = false;
    }
}

// ALTERNATIVE VERSION - With loading modal
async function signInWithModal(event) {
    if (event)
        event.preventDefault();

    // Show loading modal
    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
    loadingModal.show();

    try {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const response = await fetch("SignIn", {
            method: "POST",
            body: JSON.stringify({email, password}),
            headers: {"Content-Type": "application/json"}
        });

        const json = await response.json();

        // Hide loading modal
        loadingModal.hide();

        if (response.ok && json.status) {
            if (json.message === "1") {
                showToast('warning', 'Verification Required', 'Redirecting to verification page...');
                setTimeout(() => window.location = "verify-account.html", 1500);
            } else {
                showToast('success', 'Welcome Back!', 'Login successful. Redirecting...');
                setTimeout(() => window.location = "index.html", 1500);
            }
        } else {
            showToast('error', 'Login Failed', json.message || 'Invalid credentials');
        }
    } catch (error) {
        loadingModal.hide();
        showToast('error', 'Connection Error', 'Unable to connect to server');
    }
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

// Form validation
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('signInForm').addEventListener('submit', function (e) {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            e.preventDefault();
            showToast('warning', 'Missing Information', 'Please fill in all required fields.');
            return false;
        }
    });
});
