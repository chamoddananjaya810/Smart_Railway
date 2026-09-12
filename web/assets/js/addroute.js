async function loadRouteData() {

    try {
        // Use "../LoadRoute" to go up one level from admin folder
        const response = await fetch("../LoadRoute", {
            method: "GET",
            credentials: "include"
        });



        if (response.ok) {
            const json = await response.json();
//            console.log("Received JSON:", json);

            if (json.status) {
//                console.log(json);
//                console.log("route data loaded");
                loadTrainSelect("modalTrain", json.trainList, "train_name");
                loadSelect("sourceStation", json.stationList);
                loadSelect("destinationStation", json.stationList);
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
async function routeTo(rName) {

    if (!rName.trim()) {
        loadRouteTable();
        return;
    }

    try {
        const response = await fetch("../LoadRouteSearch?name=" + encodeURIComponent(rName));
        if (response.ok) {
            const json = await response.json();
            console.log(json.routeSearchList);
            const tbody = document.querySelector("#routesTable tbody");
            tbody.innerHTML = ""; // Clear existing rows if any

            // Helper: normalize & format various time formats to "h:mm:ss AM/PM"
            function formatTo12Hour(timeVal) {
                if (!timeVal && timeVal !== 0)
                    return '';

                // If it's already a number (timestamp)
                if (typeof timeVal === 'number') {
                    const d = new Date(timeVal);
                    if (!isNaN(d)) {
                        return d.toLocaleTimeString(undefined, {hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true});
                    }
                }

                // If it's a plain time like "09:57" or "9:57" or "09:57:39"
                if (typeof timeVal === 'string') {
                    const timeOnly = timeVal.trim();
                    // matches H:M or H:MM or HH:MM(:SS)
                    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeOnly)) {
                        // ensure full seconds
                        const withSeconds = timeOnly.length === 5 ? timeOnly + ':00' : timeOnly;
                        // create a date anchored to 1970 so Date parsing works consistently
                        const d = new Date(`1970-01-01T${withSeconds}`);
                        if (!isNaN(d)) {
                            return d.toLocaleTimeString(undefined, {hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true});
                        }
                    }

                    // Try parsing other common string formats (e.g. "Jan 1, 1970 9:57:39 AM" or ISO)
                    const parsed = new Date(timeOnly);
                    if (!isNaN(parsed)) {
                        return parsed.toLocaleTimeString(undefined, {hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true});
                    }

                    // If everything fails, return original string
                    return timeOnly;
                }

                // fallback
                return String(timeVal);
            }

            json.routeSearchList.forEach(toute => {
                const row = document.createElement("tr");

                // Pre-format times so we don't call functions inside template literal
                const depFormatted = formatTo12Hour(toute.departure_time);
                const arrFormatted = formatTo12Hour(toute.arrival_time);

                row.innerHTML = `
            <td><span class="badge bg-primary">${toute.id}</span></td>
            <td>
                <strong>${toute.titile}</strong>
                <small class="text-muted d-block">Premium Route</small>
            </td>
            <td>
                <div>
                    <strong>${toute.train_id.train_number}</strong>
                    <small class="text-muted d-block">${toute.train_id.train_name}</small>
                </div>
            </td>
            <td>
                <i class="bi bi-geo-alt text-success me-1"></i>
                ${toute.source_id.name}
                <small class="text-muted d-block">NDLS</small>
            </td>
            <td>
                <i class="bi bi-geo-alt-fill text-danger me-1"></i>
                ${toute.destination_id.name}
                <small class="text-muted d-block">BCT</small>
            </td>
            <td><span class="badge bg-info">${depFormatted}</span></td>
            <td><span class="badge bg-warning text-dark">${arrFormatted}</span></td>
            <td><span class="">${toute.train_id.admin_id.first_name}</span></td>
        
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" data-bs-toggle="modal"  onclick="editRoute(${toute.id})" title="Edit">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-info" title="View Train" onclick="viewroute(${toute.id})">
                    <i class="bi bi-train-front"></i>
                </button>
                <button class="btn btn-sm btn-outline-info" title="View Station" onclick="viewStation(${toute.id})">
                    <i class="bi bi-geo-alt"></i>
                </button>
            </td>
        `;

                tbody.appendChild(row);
            });



        } else {
            console.error("Error fetching data");
        }
    } catch (error) {
        console.error("Fetch failed:", error);
    }
}
async function saveRoute() {
    // Get form values
    const routeTitle = document.getElementById("routeTitle").value;
    const modalTrain = document.getElementById("modalTrain").value;
    const sourceStation = document.getElementById("sourceStation").value;
    const destinationStation = document.getElementById("destinationStation").value;
    const departureTime = document.getElementById("departureTime").value;

    const arrivalTime = document.getElementById("arrivalTime").value;

    function convertToAMPM(time24) {
        if (!time24)
            return '';
        const [hours, minutes] = time24.split(':');
        let hour = parseInt(hours, 10);
        const ampm = hour < 12 ? 'AM' : 'PM';
        hour = hour % 12 || 12;
        const hourStr = hour.toString().padStart(2, '0');
        const minuteStr = minutes.padStart(2, '0');
        return `${hourStr}:${minuteStr} ${ampm}`;
    }


    function convertToMySQLTime(time24) {
        if (!time24)
            return '';
        return `${time24}:00`;
    }

    // Validation
    if (!routeTitle || modalTrain === "0" || sourceStation === "0" || destinationStation === "0" || !departureTime || !arrivalTime) {
        showToast('error', 'Validation Error', 'Please fill all fields correctly.');
        return;
    }

    // Validate time format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(arrivalTime) || !timeRegex.test(departureTime)) {
        showToast('error', 'Invalid Time Format', 'Please enter valid time in HH:MM format.');
        return;
    }

    // Check if departure time is after arrival time
    const arrivalMinutes = parseInt(arrivalTime.split(':')[0]) * 60 + parseInt(arrivalTime.split(':')[1]);
    const departureMinutes = parseInt(departureTime.split(':')[0]) * 60 + parseInt(departureTime.split(':')[1]);
    if (departureMinutes >= arrivalMinutes) {
        showToast('error', 'Time Error', 'Departure time must be after arrival time.');
        return;
    }

    const route = {
        routeTitle: routeTitle,
        modalTrain: modalTrain,
        sourceStation: sourceStation,
        destinationStation: destinationStation,
        arrival_time: convertToMySQLTime(arrivalTime), // HH:MM:SS format for MySQL
        departure_time: convertToMySQLTime(departureTime) // HH:MM:SS format for MySQL
    };
    console.log("Schedule Object:", route);
    try {
        // Show loading state
        const submitButton = document.querySelector('button[onclick="saveRoute()"]');
        const originalText = submitButton ? submitButton.textContent : '';
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Saving...';
        }

        const response = await fetch("../AddRoute", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(route),
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
            document.getElementById("modalTrain").value = "0";
            document.getElementById("sourceStation").value = "0";
            document.getElementById("destinationStation").value = "";
            document.getElementById("arrivalTime").value = "";
            document.getElementById("departureTime").value = "";
            document.getElementById("routeTitle").value = "";

        } else {
            showToast('error', 'Failed', json.message || 'Could not save schedule.');
        }

    } catch (error) {
        console.error("Error saving schedule:", error);
        // Reset button state on error
        const submitButton = document.querySelector('button[onclick="saveSchedule()"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }

        showToast('error', 'Network Error', 'Could not connect to server. Please check your connection.');
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

function loadTrainSelect(selectId, list, textKey) {
    const select = document.getElementById(selectId);
    if (!select) {
        console.error(`Select element with ID "${selectId}" not found`);
        return;
    }

    // Default option එක reset කරන්න
    select.innerHTML = '<option value="0">Choose Train</option>';

    list.forEach(item => {
        const option = document.createElement("option");
        option.value = item.tarin_id ?? ""; // Value → tarin_id
        option.textContent = item[textKey] ?? ""; // Text → train_name
        select.appendChild(option);
    });
}

async function loadRouteTable() {
    console.log("loadRouteData");
    const response = await fetch("../LoadRouteTable", {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok) {
        console.log("Response error: Could not fetch train data.");
        return;
    }

    const json = await response.json();


    if (!json.status) {
        console.log("No train data found.");
        return;
    }

    const tbody = document.querySelector("#routesTable tbody");
    tbody.innerHTML = ""; // Clear existing rows if any

    // Helper: normalize & format various time formats to "h:mm:ss AM/PM"
    function formatTo12Hour(timeVal) {
        if (!timeVal && timeVal !== 0)
            return '';

        // If it's already a number (timestamp)
        if (typeof timeVal === 'number') {
            const d = new Date(timeVal);
            if (!isNaN(d)) {
                return d.toLocaleTimeString(undefined, {hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true});
            }
        }

        // If it's a plain time like "09:57" or "9:57" or "09:57:39"
        if (typeof timeVal === 'string') {
            const timeOnly = timeVal.trim();
            // matches H:M or H:MM or HH:MM(:SS)
            if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeOnly)) {
                // ensure full seconds
                const withSeconds = timeOnly.length === 5 ? timeOnly + ':00' : timeOnly;
                // create a date anchored to 1970 so Date parsing works consistently
                const d = new Date(`1970-01-01T${withSeconds}`);
                if (!isNaN(d)) {
                    return d.toLocaleTimeString(undefined, {hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true});
                }
            }

            // Try parsing other common string formats (e.g. "Jan 1, 1970 9:57:39 AM" or ISO)
            const parsed = new Date(timeOnly);
            if (!isNaN(parsed)) {
                return parsed.toLocaleTimeString(undefined, {hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true});
            }

            // If everything fails, return original string
            return timeOnly;
        }

        // fallback
        return String(timeVal);
    }

    json.routeList.forEach(toute => {
        const row = document.createElement("tr");

        // Pre-format times so we don't call functions inside template literal
        const depFormatted = formatTo12Hour(toute.departure_time);
        const arrFormatted = formatTo12Hour(toute.arrival_time);

        row.innerHTML = `
            <td><span class="badge bg-primary">${toute.id}</span></td>
            <td>
                <strong>${toute.titile}</strong>
                <small class="text-muted d-block">Premium Route</small>
            </td>
            <td>
                <div>
                    <strong>${toute.train_id.train_number}</strong>
                    <small class="text-muted d-block">${toute.train_id.train_name}</small>
                </div>
            </td>
            <td>
                <i class="bi bi-geo-alt text-success me-1"></i>
                ${toute.source_id.name}
                <small class="text-muted d-block">NDLS</small>
            </td>
            <td>
                <i class="bi bi-geo-alt-fill text-danger me-1"></i>
                ${toute.destination_id.name}
                <small class="text-muted d-block">BCT</small>
            </td>
            <td><span class="badge bg-info">${depFormatted}</span></td>
            <td><span class="badge bg-warning text-dark">${arrFormatted}</span></td>
            <td><span class="">${toute.train_id.admin_id.first_name}</span></td>
        
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" data-bs-toggle="modal"  onclick="editRoute(${toute.id})" title="Edit">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-info" title="View Train" onclick="viewroute(${toute.id})">
                    <i class="bi bi-train-front"></i>
                </button>
                <button class="btn btn-sm btn-outline-info" title="View Station" onclick="viewStation(${toute.id})">
                    <i class="bi bi-geo-alt"></i>
                </button>
            </td>
        `;

        tbody.appendChild(row);
    });
}
function formatTime(value) {
    if (!value)
        return ""; // Prevent null/undefined

    if (typeof value === "number") {
        // Convert seconds to ms if needed
        if (value < 10000000000) {
            value *= 1000;
        }
        let date = new Date(value);
        return String(date.getHours()).padStart(2, '0') + ":" +
                String(date.getMinutes()).padStart(2, '0');
    }

    // Already HH:MM
    if (/^\d{2}:\d{2}$/.test(value)) {
        return value;
    }

    // Date string
    let date = new Date(value);
    if (!isNaN(date)) {
        return String(date.getHours()).padStart(2, '0') + ":" +
                String(date.getMinutes()).padStart(2, '0');
    }

    return "";
}


async function editRoute(routeId) {
    console.log("routeId:", routeId);

    const requestBody = {id: routeId};

    const response = await fetch("../SingelRouteData", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(requestBody),
        credentials: "include"
    });

    const json = await response.json();

    if (json.status) {
        console.log(json);
        editingRouteId = json.routeList[0].id;
        console.log("edit" + editingRouteId);
        console.log("Raw departure_time:", json.routeList[0].departure_time);
        console.log("Raw arrival_time:", json.routeList[0].arrival_time);

        document.getElementById("routeTitle").value = json.routeList[0].titile;
        document.getElementById("modalTrain").value = json.routeList[0].train_id.tarin_id;
        document.getElementById("sourceStation").value = json.routeList[0].source_id.id;
        document.getElementById("destinationStation").value = json.routeList[0].destination_id.id;
        document.getElementById("departureTime").value = formatTime(json.routeList[0].departure_time);
        document.getElementById("arrivalTime").value = formatTime(json.routeList[0].arrival_time);

        const modalTitle = document.querySelector('#addRouteModal .modal-title');
        if (modalTitle) {
            modalTitle.innerHTML = '<i class="bi bi-pencil me-2"></i>Edit Route';
        }

        const modalFooterButtons = document.querySelectorAll('#addRouteModal .modal-footer .btn-danger');
        modalFooterButtons.forEach(btn => {
            btn.textContent = 'Update route';
            btn.setAttribute('onclick', `updateRoute(${routeId});`);
        });


        const modalElement = document.getElementById('addRouteModal');
        if (!modalElement) {
            console.error("Modal element 'addRouteModal' not found.");
            alert("Edit modal not found. Please ensure the modal HTML is loaded.");
            return;
        }

        try {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        } catch (error) {
            console.error("Error showing modal:", error);
            alert("Error opening edit modal. Please check console for details.");
        }

    } else {
        console.log("No train data found.");
    }
}

function resetRoute() {

    document.getElementById("routeTitle").value = "";
    document.getElementById("modalTrain").selectedIndex = 0;
    document.getElementById("sourceStation").selectedIndex = 0;
    document.getElementById("destinationStation").selectedIndex = 0;
    document.getElementById("departureTime").value = "";
    document.getElementById("arrivalTime").value = "";








    const modalTitle = document.querySelector('#addRouteModal .modal-title');
    if (modalTitle) {
        modalTitle.innerHTML = '<i class="bi bi-plus-circle me-2"></i>Add Route';
    }

    // Reset Save button text and onclick
    const modalFooterButtons = document.querySelectorAll('#addRouteModal .modal-footer .btn-danger');
    modalFooterButtons.forEach(btn => {
        if (btn.getAttribute('onclick')?.includes("updateRoute(")) {
            btn.textContent = 'update Route';
            btn.setAttribute('onclick', 'updateRoute();');
        }
    });

    // Optional: reset global edit ID
    if (typeof editingRouteId !== "undefined") {
        editingRouteId = null;
    }
}
async function updateRoute() {
    const id = editingRouteId; // <-- get from global
    console.log("route " + id);

    const routeTitle = document.getElementById("routeTitle").value;
    const modalTrain = document.getElementById("modalTrain").value;
    const sourceStation = document.getElementById("sourceStation").value;
    const destinationStation = document.getElementById("destinationStation").value;
    const departureTime = document.getElementById("departureTime").value;
    const arrivalTime = document.getElementById("arrivalTime").value;

    function convertToMySQLTime(time24) {
        if (!time24)
            return '';
        return `${time24}:00`;
    }

    // Validation
    if (!routeTitle || modalTrain === "0" || sourceStation === "0" || destinationStation === "0" || !departureTime || !arrivalTime) {
        showToast('error', 'Validation Error', 'Please fill all fields correctly.');
        return;
    }

    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(arrivalTime) || !timeRegex.test(departureTime)) {
        showToast('error', 'Invalid Time Format', 'Please enter valid time in HH:MM format.');
        return;
    }

    const arrivalMinutes = parseInt(arrivalTime.split(':')[0]) * 60 + parseInt(arrivalTime.split(':')[1]);
    const departureMinutes = parseInt(departureTime.split(':')[0]) * 60 + parseInt(departureTime.split(':')[1]);
    if (departureMinutes >= arrivalMinutes) {
        showToast('error', 'Time Error', 'Departure time must be after arrival time.');
        return;
    }

    const route = {
        id: id,
        routeTitle: routeTitle,
        modalTrain: modalTrain,
        sourceStation: sourceStation,
        destinationStation: destinationStation,
        arrival_time: convertToMySQLTime(arrivalTime),
        departure_time: convertToMySQLTime(departureTime)
    };

    try {
        const submitButton = document.querySelector('#addRouteModal .modal-footer .btn-danger');
        const originalText = submitButton ? submitButton.textContent : '';
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Saving...';
        }

        const response = await fetch("../updateRoute", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(route),
            credentials: "include"
        });

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
            document.getElementById("modalTrain").value = "0";
            document.getElementById("sourceStation").value = "0";
            document.getElementById("destinationStation").value = "";
            document.getElementById("arrivalTime").value = "";
            document.getElementById("departureTime").value = "";
            document.getElementById("routeTitle").value = "";
        } else {
            showToast('error', 'Failed', json.message || 'Could not save schedule.');
        }
    } catch (error) {
        console.error("Error saving schedule:", error);
    }
}











function  viewroute(routeid) {
    window.location.href = `train-routes-price.html?id=${routeid}`;




}


function  viewStation(routeid) {

    window.location.href = `train-stations.html?id=${routeid}`;


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