async function loadpriceData() {

    try {
        // Use "../LoadRoute" to go up one level from admin folder
        const response = await fetch("../LoadPriceList", {
            method: "GET",
            credentials: "include"
        });



        if (response.ok) {
            const json = await response.json();
//            console.log("Received JSON:", json);

            if (json.status) {
               
//                console.log("route data loaded");
//           
         
                loadSelect("toStation", json.stationList);
                loadSelect("fromStation", json.stationList);
                loadRoueteSelect("trainRoutes",json.routeList)
                 
            } else {
                console.error("Server error:", json.message || "Invalid details");
            }
        } else {
            console.error("Network error, status:", response.status);
            const errorText = await response.text();
            console.error("Error response:", errorText);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}


async function  loadPrices() {

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("id")) {
        const  routeId = searchParams.get("id");

        console.log(routeId);
        const  response = await fetch("../LoadRoutePrice?id=" + routeId);
        if (response.ok) {
            const  json = await response.json();
            if (json.status) {
              





                const tbody = document.querySelector("#routesTable tbody");
                tbody.innerHTML = ""; // Clear existing rows if any

                json.routepriceList.forEach(price => {
                 

                    const row = document.createElement("tr");
                    row.innerHTML = `
        <td><span class="badge bg-danger">${price.id}</span></td>
                                    <td><i class="bi bi-geo-alt text-danger me-1"></i>${price.from.name}</td>
                                    <td><i class="bi bi-geo-alt-fill text-danger me-1"></i>${price.to.name}</td>
                                    
                                    <td><span class="text-success fw-bold">${price.first_class_price}</span></td>
                                    <td><span class="text-info fw-bold">${price.second_class_price}</span></td>
                               
                                  
                                    <td>
                                        <button class="btn btn-sm btn-outline-danger me-1" onclick="editRoute('RT001')">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger" onclick="deleteRoute('RT001')">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </td>
    `;

                    tbody.appendChild(row);
                });

            } else {
//            document.getElementById("massage").innerHTML = json.massage;

                console.log("not" + json);
            }
        } else {
            console.log("else");
//            document.getElementById("massage").innerHTML = "Unable to get product data please try again later";
        }
    }
}

function loadSelect(selectId, list) {
    const select = document.getElementById(selectId);
    list.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id; // Use the nested id property
        option.innerHTML = item.name; // Display the nested name property
        select.appendChild(option);
    });
}
function loadRoueteSelect(selectId, list) {
    const select = document.getElementById(selectId);
    list.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id; // Use the nested id property
        option.innerHTML = item.titile; // Display the nested name property
        select.appendChild(option);
    });
}



async function  savePrice(){
    
     const fromStation = document.getElementById("fromStation").value;
    const toStation = document.getElementById("toStation").value;
    const trainRoutes = document.getElementById("trainRoutes").value;
    const firstClassPrice = document.getElementById("firstClassPrice").value;
    const secondClassPrice = document.getElementById("secondClassPrice").value;
    
    
    
    if (!fromStation || toStation === "0" || trainRoutes === "0"  || !firstClassPrice || !secondClassPrice) {
        showToast('error', 'Validation Error', 'Please fill all fields correctly.');
        return;
    }
    const routePrice = {
        fromStation: fromStation,
        toStation: toStation,
        trainRoutes: trainRoutes,
        firstClassPrice: firstClassPrice,
       secondClassPrice: secondClassPrice
      
      
    };
   
    try {
        // Show loading state
        const submitButton = document.querySelector('button[onclick="saveRoute()"]');
        const originalText = submitButton ? submitButton.textContent : '';
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Saving...';
        }

        const response = await fetch("../AddRoutePrice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(routePrice),
            credentials: "include"
        });
        // Reset button state
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server Response:', response.status, errorText);
            showToast('error', 'Server Error', `Server returned ${response.status}. Please try again.`);
            return;
        }

        const json = await response.json();
        console.log("Server Response:", json);
        if (json.status) {
            showToast('success', 'Success', json.message || 'Schedule saved successfully!');
            // Reset form on success
            document.getElementById("fromStation").value = "0";
            document.getElementById("toStation").value = "0";
            document.getElementById("trainRoutes").value = "0";
            document.getElementById("firstClassPrice").value = "";
            document.getElementById("secondClassPrice").value = "";
           

        } else {
            showToast('error', 'Failed', json.message || 'Could not save schedule.');
        }

    } catch (error) {
        console.error("Error saving schedule:", error);
        // Reset button state on error
        const submitButton = document.querySelector('button[onclick="savePrice()"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }

        showToast('error', 'Network Error', 'Could not connect to server. Please check your connection.');
    }
    
    
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