async function loadStaionData() {


    const response = await fetch("../LoadStationData", {
        method: "GET", // Optional, defaults to "GET"
        credentials: "include"      // ✅ This sends cookies/session data
    });
    if (response.ok) {
        const  json = await response.json();

        console.log(json.routeList);


        if (json.status) {
            console.log(json.routeList);
            console.log(json.routeList.route_id);


            loadSelect("route", json.routeList, "titile");
            loadSelect("station", json.sList, "name");


        } else {


            showToast('error', 'Invalid Details', json.message);
        }
    } else {

        testResponse('network_error');
    }
}

function loadTrainSelect(selectId, list, textKey) {
    const select = document.getElementById(selectId);
    if (!select) {
        console.error(`Select element with ID "${selectId}" not found`);
        return;
    }

    // Default option එක reset කරන්න
    select.innerHTML = '<option value="0">Choose Route</option>';

    list.forEach(item => {
        const option = document.createElement("option");
        option.value = item.tarin_id ?? ""; // Value → tarin_id
        option.textContent = item[textKey] ?? ""; // Text → train_name
        select.appendChild(option);
    });
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
async function saveSchedule() {
    // Get form values
    const route = document.getElementById("route").value;
    const station = document.getElementById("station").value;
    const stopPlatform = document.getElementById("stopPlatform").value;
    const arrivalTime = document.getElementById("arrivalTime").value;
    const departureTime = document.getElementById("departureTime").value;

    // Convert 24-hour to AM/PM format for display
    function convertToAMPM(time24) {
        if (!time24) return '';
        
        const [hours, minutes] = time24.split(':');
        let hour = parseInt(hours, 10);
        const ampm = hour < 12 ? 'AM' : 'PM';
        hour = hour % 12 || 12; // Convert 0 to 12, 13+ to 1-11
        const hourStr = hour.toString().padStart(2, '0');
        const minuteStr = minutes.padStart(2, '0');
        
        return `${hourStr}:${minuteStr} ${ampm}`;
    }

    // Convert 24-hour to MySQL TIME format (HH:MM:SS)
    function convertToMySQLTime(time24) {
        if (!time24) return '';
        return `${time24}:00`; // Add seconds for MySQL TIME format
    }

    // Validation
    if (route === "0" || station === "0" || !stopPlatform || !arrivalTime || !departureTime) {
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
    
    if (departureMinutes <= arrivalMinutes) {
        showToast('error', 'Time Error', 'Departure time must be after arrival time.');
        return;
    }

    // Log formatted times for debugging
    console.log("Raw Arrival Time:", arrivalTime);
    console.log("Raw Departure Time:", departureTime);
    console.log("Formatted Arrival (AM/PM):", convertToAMPM(arrivalTime));
    console.log("Formatted Departure (AM/PM):", convertToAMPM(departureTime));
    console.log("MySQL Arrival Time:", convertToMySQLTime(arrivalTime));
    console.log("MySQL Departure Time:", convertToMySQLTime(departureTime));

    // Prepare schedule object for backend
    const schedule = {
        route: route,
        station_id: station,
        stop_platform: stopPlatform,
        arrival_time: convertToMySQLTime(arrivalTime), // HH:MM:SS format for MySQL
        departure_time: convertToMySQLTime(departureTime) // HH:MM:SS format for MySQL
    };

    console.log("Schedule Object:", schedule);

    try {
        // Show loading state
        const submitButton = document.querySelector('button[onclick="saveSchedule()"]');
        const originalText = submitButton ? submitButton.textContent : '';
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Saving...';
        }

        const response = await fetch("../AddStationSchedule", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(schedule),
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
            document.getElementById("route").value = "0";
            document.getElementById("station").value = "0";
            document.getElementById("stopPlatform").value = "";
            document.getElementById("arrivalTime").value = "";
            document.getElementById("departureTime").value = "";
            
            // Optional: Refresh schedule list or redirect
            // loadScheduleList();
            
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
