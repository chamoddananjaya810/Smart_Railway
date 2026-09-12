async function loadStaionData() {


    // Get ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id"); // "3"

// Send ID to the servlet
    const response = await fetch(`../LoadStationPriceData?id=${encodeURIComponent(id)}`, {
        method: "GET",
        credentials: "include"
    });
    if (response.ok) {
        const  json = await response.json();
        if (json.status) {

            console.log(json);
            loadSelectlist("stationFrom", json.trainsStList, "station_id.id", "station_id.name");
//            loadSelect("stationFrom", json.trainsStList.station_id, "name");
            loadSelect("stationTo", json.station, "name");
        } else {


            showToast('error', 'Invalid Details', json.message);
        }
    } else {

        testResponse('network_error');
    }
}


function  loadSelect(selectId, list, Property) {
    const select = document.getElementById(selectId);
    list.forEach(item => {
        const  option = document.createElement("option");
        option.value = item.id;
        option.innerHTML = item[Property];
        select.appendChild(option);
    });
}




function loadSelectlist(selectId, list, valueProp, labelProp) {
    const select = document.getElementById(selectId);
    if (!select)
        return;

    const get = (obj, path) =>
        path.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);

    select.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "-- Select station --";
    select.appendChild(placeholder);

    if (!Array.isArray(list))
        return;

    list.forEach(item => {
        const value = get(item, valueProp);
        const label = get(item, labelProp);
        if (value === undefined || label === undefined)
            return; // skip bad rows

        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        select.appendChild(option);
    });
}

async function loadStaionPriceTable() {


    // Get ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id"); // "3"

// Send ID to the servlet
    const response = await fetch(`../LoadStationPriceTable?id=${encodeURIComponent(id)}`, {
        method: "GET",
        credentials: "include"
    });
    if (response.ok) {
        const  json = await response.json();
        if (json.status) {

            console.log(json.priceStList);
            const tbody = document.querySelector("#stationPricesTable tbody");
            tbody.innerHTML = ""; // Clear existing rows if any

            json.priceStList.forEach(price => {

                const row = document.createElement("tr");

                row.innerHTML = `
                <td><span class="badge bg-danger">${price.id}</span></td>
                                  
                                    <td><i class="bi bi-geo-alt-fill text-danger me-1"></i>${price.station_from.station_id.name}</td>
                                    <td><span class="fw-bold">${price.station_to.name}</span></td>
                                    <td><span class="text-success fw-bold">${price.price}</span></td>
                                 
                               
                                    <td>
                                        <button class="btn btn-sm btn-outline-danger me-1" onclick="editStationPrice('SP001')">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                      
                                    </td>
                `;

                tbody.appendChild(row);

            });
        } else {


            showToast('error', 'Invalid Details', json.message);
        }
    } else {

        testResponse('network_error');
    }
}

async function saveStationPrice() {
    // read form values
    const stationFrom = document.getElementById("stationFrom").value; // select
    const stationTo = document.getElementById("stationTo").value;     // select
    const stationPrice = document.getElementById("stationPrice").value.trim();

    // basic validation
    if (!stationFrom) {
        showToast('error', 'Validation', 'Please select source station.');
        return;
    }
    if (!stationTo) {
        showToast('error', 'Validation', 'Please select destination station.');
        return;
    }
    if (stationFrom === stationTo) {
        showToast('error', 'Validation', 'Source and destination cannot be the same.');
        return;
    }
    if (!stationPrice) {
        showToast('error', 'Validation', 'Please enter a price.');
        return;
    }
    // ensure price is a positive number
    const priceNum = Number(stationPrice);
    if (Number.isNaN(priceNum) || priceNum < 0) {
        showToast('error', 'Validation', 'Price must be a valid non-negative number.');
        return;
    }

    // build payload
    const payload = {
        stationFrom: stationFrom,
        stationTo: stationTo,
        stationPrice: priceNum
    };


    const response = await fetch("../SaveStationPrice", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include", // include cookies/session if needed
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        showToast('error', 'Server error', `HTTP ${response.status}`);
        return;
    }

    const json = await response.json();

    if (json.status) {
        showToast('success', 'Saved', 'Station price saved successfully!');
        // reset the form (adjust form id if different)
        const form = document.getElementById("stationPriceForm");
        if (form)
            form.reset();

        // optionally reload table or update UI
        // loadStaionPriceTable(); // call your table refresh function if you have one
    } else {
        // server returned an error message
        showToast('error', 'Failed to save', json.message || 'Unknown error');
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