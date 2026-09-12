
async function loadTrainData() { // Fixed function name
    try {
        console.log("Starting to load train data...");

        const response = await fetch("../LoadTrainData", {
            method: "GET",
            credentials: "include"
        });

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (response.ok) {
            const json = await response.json();
            console.log("Received train data:", json); // Fixed logging

            if (json.status) {
                console.log("Train data loaded successfully");
                console.log("train" + json);
                // Load all the select options
                loadSelect("trainType", json.typeList);
                loadSelect("speedType", json.speeedList);
                loadSelect("daysOfTravel", json.daysofList);
                loadSelect("trainStatus", json.statusList);

                console.log("All selects populated successfully");

            } else {
                console.log("Server returned error status");
                showToast('error', 'Invalid Details', json.message || 'Unknown server error');
            }
        } else {
            console.error("Network error - Response not ok:", response.status);
            testResponse('network_error');
        }
    } catch (error) {
        console.error("Error in loadTrainData:", error);
        testResponse('network_error');
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






async function loadTrainTable() {
    console.log("Loading train table...");

    const response = await fetch("../LoadTrainTable", {
        method: "GET", // Optional, defaults to "GET"
        credentials: "include"      // ✅ This sends cookies/session data
    });
    if (response.ok) {
        const json = await response.json();

        if (json.status) {
            console.log(json);
            const tbody = document.querySelector("#trainsTable tbody");
            tbody.innerHTML = ""; // Clear existing rows if any

            json.TrainList.forEach(train => {
                console.log(train.type_id.name);
                const row = document.createElement("tr");

                row.innerHTML = `
                <td><strong>${train.tarin_id}</strong></td>
                    <td><strong>${train.train_number}</strong></td>
                    <td>${train.train_name}</td>
                    <td><span class="badge bg-secondary">${train.type_id.name}</span></td>
                    <td>${train.speed_id.name}</td>
                    <td>${train.days_of_travel_id.name}</td>
                
                    <td>${train.total_coaches}</td>
                    <td>
                        <span class="badge ${train.status_id.name === 'Active' ? 'bg-success' : 'bg-danger'}">
                            ${train.status_id.name}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="editTrain(${train.tarin_id})" title="Edit">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" title="Delete">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                `;

                tbody.appendChild(row);

            });


        } else {
            console.log("No train data found.");
        }

    } else {
        console.log("Response error: Could not fetch train data.");
    }
}



function alert() {
    showToast('success', 'Login Successful', 'Welcome back! Redirecting to dashboard...');


}

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

//    





async function saveTrain() {
    const trainNumber = document.getElementById("trainNumber").value;
    const trainName = document.getElementById("trainName").value;
    const trainType = document.getElementById("trainType").value;
    const speedType = document.getElementById("speedType").value;
    const daysOfTravel = document.getElementById("daysOfTravel").value;
    const totalCoaches = document.getElementById("totalCoaches").value;
    const trainStatus = document.getElementById("trainStatus").value;


    

    const train = {
        trainNumber: trainNumber,
        trainName: trainName,
        trainType: trainType,
        speedType: speedType, // Note: Java expects 'speed', not 'speed_type'
        daysOfTravel: daysOfTravel,
        totalCoaches: totalCoaches,
        trainStatus: trainStatus

    };


    // Send request

    const trainJson = JSON.stringify(train);
    const response = await fetch("../AddTrainForm", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },
        body: trainJson,
        credentials: "include",
    });

    // Handle response
    if (response.ok) {
        const json = await response.json();

        if (json.status) {

            showToast('success', 'Successful', 'Train saved successfully!');
            document.getElementById("trainForm").reset();
        } else {

            showToast('error', 'Failed to save train', json.message);
        }
    } else {

        showToast('error', 'Server error', 'Failed to communicate with server');

    }

}







async function editTrain(trainId) {
    console.log("Train ID:", trainId);

    const requestBody = {
        id: trainId
    };

    try {
        const response = await fetch("../SingelTrainData", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody),
            credentials: "include"
        });



        const json = await response.json();

        if (json.status) {

//            console.log(json);

            editingTrainId = trainId;


            console.log(json.trianList[0]);

            //singel  product end

            document.getElementById("trainNumber").value = json.trianList[0].train_number;
            document.getElementById("trainName").value = json.trianList[0].train_name;
            document.getElementById("trainType").value = json.trianList[0].type_id.id;
            document.getElementById("speedType").value = json.trianList[0].speed_id.id;
            document.getElementById("daysOfTravel").value = json.trianList[0].days_of_travel_id.id;
            document.getElementById("totalCoaches").value = json.trianList[0].total_coaches;
            document.getElementById("trainStatus").value = json.trianList[0].status_id.id;


// Change modal title
            const modalTitle = document.querySelector('#addTrainModal .modal-title');
            if (modalTitle) {
                modalTitle.innerHTML = '<i class="bi bi-pencil me-2"></i>Edit Train';
            }

// Change "Save Train" button to "Update Train" with new onclick
            const modalFooterButtons = document.querySelectorAll('#addTrainModal .modal-footer .btn-danger');
            modalFooterButtons.forEach(btn => {
                if (btn.getAttribute('onclick') === 'saveTrain();') {
                    btn.textContent = 'Update Train';
                    btn.setAttribute('onclick', `updateTrain(${trainId});`);
                }
            });

// Check if modal exists before trying to show it
            const modalElement = document.getElementById('addTrainModal');
            if (!modalElement) {
                console.error("Modal element 'addTrainModal' not found.");
                alert("Edit modal not found. Please ensure the modal HTML is loaded.");
                return;
            }

            // Show modal
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


    } catch (error) {
        console.error("Fetch error:", error);
        alert("An error occurred while loading train data.");
    }


}

function resetTrain() {

    document.getElementById("trainNumber").value = "";
    document.getElementById("trainName").value = "";
    document.getElementById("totalCoaches").value = "";


    document.getElementById("trainType").selectedIndex = 0;
    document.getElementById("speedType").selectedIndex = 0;
    document.getElementById("daysOfTravel").selectedIndex = 0;
    document.getElementById("trainStatus").selectedIndex = 0;


    const modalTitle = document.querySelector('#addTrainModal .modal-title');
    if (modalTitle) {
        modalTitle.innerHTML = '<i class="bi bi-plus-circle me-2"></i>Add New Train';
    }

    // Reset Save button text and onclick
    const modalFooterButtons = document.querySelectorAll('#addTrainModal .modal-footer .btn-danger');
    modalFooterButtons.forEach(btn => {
        if (btn.getAttribute('onclick')?.includes("updateTrain(")) {
            btn.textContent = 'Save Train';
            btn.setAttribute('onclick', 'saveTrain();');
        }
    });

    // Optional: reset global edit ID
    if (typeof editingTrainId !== "undefined") {
        editingTrainId = null;
    }
}

async function updateTrain(trainId) {

    console.log("update" + trainId);



    const trainNumber = document.getElementById("trainNumber").value;
    const trainName = document.getElementById("trainName").value;
    const trainType = document.getElementById("trainType").value;
    const speedType = document.getElementById("speedType").value;
    const daysOfTravel = document.getElementById("daysOfTravel").value;
    const totalCoaches = document.getElementById("totalCoaches").value;
    const trainStatus = document.getElementById("trainStatus").value;


  

    const train = {
        trainId: trainId,
        trainNumber: trainNumber,
        trainName: trainName,
        trainType: trainType,
        speedType: speedType, // Note: Java expects 'speed', not 'speed_type'
        daysOfTravel: daysOfTravel,
        totalCoaches: totalCoaches,
        trainStatus: trainStatus

    };


    // Send request

    const trainJson = JSON.stringify(train);
    const response = await fetch("../UpdateTrainForm", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },
        body: trainJson,
        credentials: "include"
    });

    // Handle response
    if (response.ok) {
        const json = await response.json();

        if (json.status) {

            showToast('success', 'Successful', 'Train saved successfully!');
            document.getElementById("trainForm").reset();
        } else {

            showToast('error', 'Failed to save train', json.message);
        }
    } else {

        showToast('error', 'Server error', 'Failed to communicate with server');

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
//}
//let trains = [
//    {
//        id: 1,
//        trainNumber: "12001",
//        trainName: "Shatabdi Express",
//        trainType: "Express",
//        speed: 130,
//        daysOfTravel: "Daily",
//        totalCoaches: 20,
//        status: "Active"
//    },
//    {
//        id: 2,
//        trainNumber: "12002",
//        trainName: "Rajdhani Express",
//        trainType: "Express",
//        speed: 140,
//        daysOfTravel: "Daily",
//        totalCoaches: 22,
//        status: "Active"
//    },
//    {
//        id: 3,
//        trainNumber: "15001",
//        trainName: "Passenger Local",
//        trainType: "Passenger",
//        speed: 80,
//        daysOfTravel: "Mon-Fri",
//        totalCoaches: 12,
//        status: "Active"
//    },
//    {
//        id: 4,
//        trainNumber: "18001",
//        trainName: "Freight Express",
//        trainType: "Freight",
//        speed: 60,
//        daysOfTravel: "Daily",
//        totalCoaches: 40,
//        status: "Active"
//    },
//    {
//        id: 5,
//        trainNumber: "22001",
//        trainName: "Vande Bharat",
//        trainType: "High-Speed",
//        speed: 180,
//        daysOfTravel: "Daily",
//        totalCoaches: 16,
//        status: "Active"
//    },
//    {
//        id: 6,
//        trainNumber: "11001",
//        trainName: "Mail Express",
//        trainType: "Express",
//        speed: 110,
//        daysOfTravel: "Alternate Days",
//        totalCoaches: 18,
//        status: "Maintenance"
//    },
//    {
//        id: 7,
//        trainNumber: "16001",
//        trainName: "Intercity Express",
//        trainType: "Intercity",
//        speed: 95,
//        daysOfTravel: "Daily",
//        totalCoaches: 14,
//        status: "Active"
//    },
//    {
//        id: 8,
//        trainNumber: "13001",
//        trainName: "Suburban Local",
//        trainType: "Local",
//        speed: 70,
//        daysOfTravel: "Daily",
//        totalCoaches: 9,
//        status: "Out of Service"
//    }
//];
//
//let editingTrainId = null;
//let editIndex = null;
//
//// Initialize page
//document.addEventListener('DOMContentLoaded', function () {
//    renderTrainsTable();
//    updateStatistics();
//    setupEventListeners();
//    initializeSidebar();
//});
//
//function initializeSidebar() {
//    const offcanvasElement = document.getElementById('offcanvasSidebar');
//    const hamburgerBtn = document.getElementById('hamburgerBtn');
//
//    // Add event listeners for offcanvas events
//    offcanvasElement.addEventListener('show.bs.offcanvas', function () {
//        hamburgerBtn.classList.add('active');
//    });
//
//    offcanvasElement.addEventListener('hide.bs.offcanvas', function () {
//        hamburgerBtn.classList.remove('active');
//    });
//}
//
//function setupEventListeners() {
//    // Search functionality
//    document.getElementById('searchInput').addEventListener('input', function () {
//        renderTrainsTable();
//    });
//
//    // Filter functionality
//    document.getElementById('statusFilter').addEventListener('change', function () {
//        renderTrainsTable();
//    });
//
//    document.getElementById('typeFilter').addEventListener('change', function () {
//        renderTrainsTable();
//    });
//
//    // Enhanced form submission with API integration
//    const trainFormElement = document.getElementById('trainForm');
//    if (trainFormElement) {
//        trainFormElement.addEventListener('submit', handleFormSubmission);
//    }
//
//    // Keyboard shortcuts
//    document.addEventListener('keydown', function (e) {
//        // Ctrl + M to toggle sidebar
//        if (e.ctrlKey && e.key === 'm') {
//            e.preventDefault();
//            const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasSidebar'));
//            offcanvas.toggle();
//        }
//
//        // Escape to close sidebar
//        if (e.key === 'Escape') {
//            const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasSidebar'));
//            if (offcanvas) {
//                offcanvas.hide();
//            }
//        }
//    });
//}
//
//// Enhanced form submission handler with API integration
//async function handleFormSubmission(e) {
//    e.preventDefault();
//    console.log("submit");
//    const form = e.target;
//    if (!form.checkValidity()) {
//        form.reportValidity();
//        return;
//    }
//
//    showLoading();
//    
//    const formData = new FormData(form);
//    console.log("submit");
//    const trainData = {
//        train_id: formData.get('train_id') || formData.get('trainNumber') || `T${Date.now()}`,
//        train_name: formData.get('train_name') || formData.get('trainName'),
//        train_number: formData.get('train_number') || formData.get('trainNumber'),
//        speed: parseInt(formData.get('speed') || formData.get('trainSpeed')),
//        days_of_travel: formData.get('days_of_travel') || formData.get('daysOfTravel'),
//        train_type: formData.get('train_type') || formData.get('trainType'),
//        total_coaches: parseInt(formData.get('total_coaches') || formData.get('totalCoaches')),
//        status: formData.get('status') || formData.get('trainStatus') || 'Active'
//        
//    };
//
//    const isUpdate = editingTrainId !== null || editIndex !== null;
//    const url = isUpdate
//        ? "http://127.0.0.1:8080/SmartRailway/UpdateTrainForm"
//        : "http://127.0.0.1:8080/SmartRailway/AddTrainForm";
//
//    try {
//        // Simulate network delay for demo
//        await new Promise(resolve => setTimeout(resolve, 1000));
//        
//        const response = await fetch(url, {
//            method: "POST",
//            headers: {"Content-Type": "application/json"},
//            body: JSON.stringify(trainData),
//            credentials: "include"
//        });
//
//        hideLoading();
//
//        if (!response.ok) {
//            throw new Error("Network error");
//        }
//
//        const data = await response.json();
//        
//        if (data.status === true) {
//            if (isUpdate) {
//                // Update existing train in local array
//                const index = editIndex !== null ? editIndex : trains.findIndex(t => t.id === editingTrainId);
//                if (index !== -1) {
//                    trains[index] = {
//                        ...trains[index],
//                        id: trains[index].id,
//                        trainNumber: trainData.train_number,
//                        trainName: trainData.train_name,
//                        trainType: trainData.train_type,
//                        speed: trainData.speed,
//                        daysOfTravel: trainData.days_of_travel,
//                        totalCoaches: trainData.total_coaches,
//                        status: trainData.status
//                    };
//                }
//                showAlert('success', '🚂 Train updated successfully!');
//            } else {
//                // Add new train to local array
//                const newTrain = {
//                    id: Math.max(...trains.map(t => t.id)) + 1,
//                    trainNumber: trainData.train_number,
//                    trainName: trainData.train_name,
//                    trainType: trainData.train_type,
//                    speed: trainData.speed,
//                    daysOfTravel: trainData.days_of_travel,
//                    totalCoaches: trainData.total_coaches,
//                    status: trainData.status
//                };
//                trains.push(newTrain);
//                showAlert('success', '🚂 Train added successfully!');
//            }
//            
//            renderTrainsTable();
//            updateStatistics();
//            
//            // Close modal and reset form
//            const modal = bootstrap.Modal.getInstance(document.getElementById('addTrainModal'));
//            if (modal) {
//                modal.hide();
//            }
//            resetForm();
//            
//        } else {
//            showAlert('danger', data.message || 'Server error occurred');
//        }
//    } catch (error) {
//        hideLoading();
//        showAlert('danger', '⚠️ Network error occurred');
//        console.error('Error:', error);
//    }
//}
//
//function showLoading() {
//    const saveBtn = document.querySelector('#addTrainModal .btn-danger');
//    if (saveBtn) {
//        saveBtn.classList.add('btn-loading');
//        saveBtn.disabled = true;
//        saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Saving...';
//    }
//}
//
//function hideLoading() {
//    const saveBtn = document.querySelector('#addTrainModal .btn-danger');
//    if (saveBtn) {
//        saveBtn.classList.remove('btn-loading');
//        saveBtn.disabled = false;
//        saveBtn.innerHTML = editingTrainId ? 'Update Train' : 'Save Train';
//    }
//}
//
//function resetForm() {
//    const form = document.getElementById('trainForm');
//    if (form) {
//        form.reset();
//    }
//    editingTrainId = null;
//    editIndex = null;
//    
//    // Reset modal title
//    const modalTitle = document.querySelector('#addTrainModal .modal-title');
//    if (modalTitle) {
//        modalTitle.innerHTML = '<i class="bi bi-plus-circle me-2"></i>Add New Train';
//    }
//}
//
//function showAlert(type, message) {
//    // Remove existing alerts
//    const existingAlerts = document.querySelectorAll('.alert.position-fixed');
//    existingAlerts.forEach(alert => alert.remove());
//
//    // Create new alert
//    const alert = document.createElement('div');
//    alert.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
//    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
//    alert.innerHTML = `
//        <div class="d-flex align-items-center">
//            <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
//            ${message}
//        </div>
//        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
//    `;
//
//    document.body.appendChild(alert);
//
//    // Auto remove after 4 seconds
//    setTimeout(() => {
//        if (alert.parentNode) {
//            alert.remove();
//        }
//    }, 4000);
//}
//
//function setActiveNav(element) {
//    // Remove active class from all nav links
//    document.querySelectorAll('.offcanvas .nav-link').forEach(link => {
//        link.classList.remove('active');
//    });
//    // Add active class to clicked link
//    element.classList.add('active');
//
//    // Close offcanvas on mobile after selection
//    const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasSidebar'));
//    if (offcanvas && window.innerWidth < 992) {
//        offcanvas.hide();
//    }
//}
//
//function renderTrainsTable() {
//    const tbody = document.getElementById('trainsTable').querySelector('tbody');
//    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
//    const statusFilter = document.getElementById('statusFilter').value;
//    const typeFilter = document.getElementById('typeFilter').value;
//
//    // Filter trains
//    let filteredTrains = trains.filter(train => {
//        const matchesSearch = train.trainName.toLowerCase().includes(searchTerm) ||
//                train.trainNumber.toLowerCase().includes(searchTerm);
//        const matchesStatus = !statusFilter || train.status === statusFilter;
//        const matchesType = !typeFilter || train.trainType === typeFilter;
//
//        return matchesSearch && matchesStatus && matchesType;
//    });
//
//    tbody.innerHTML = '';
//
//    filteredTrains.forEach(train => {
//        const row = document.createElement('tr');
//        row.innerHTML = `
//            <td><strong>${train.trainNumber}</strong></td>
//            <td>${train.trainName}</td>
//            <td><span class="badge bg-secondary">${train.trainType}</span></td>
//            <td>${train.speed} km/h</td>
//            <td>${train.daysOfTravel}</td>
//            <td>${train.totalCoaches}</td>
//            <td>${getStatusBadge(train.status)}</td>
//            <td>
//                <button class="btn btn-sm btn-outline-danger me-1" onclick="editTrain(${train.id})" title="Edit">
//                    <i class="bi bi-pencil"></i>
//                </button>
//                <button class="btn btn-sm btn-danger" onclick="deleteTrain(${train.id})" title="Delete">
//                    <i class="bi bi-trash"></i>
//                </button>
//            </td>
//        `;
//        tbody.appendChild(row);
//    });
//}
//
//function getStatusBadge(status) {
//    const statusClasses = {
//        'Active': 'bg-success',
//        'Maintenance': 'bg-warning',
//        'Out of Service': 'bg-danger',
//        'Scheduled': 'bg-info'
//    };
//    return `<span class="badge ${statusClasses[status] || 'bg-secondary'}">${status}</span>`;
//}
//
//function updateStatistics() {
//    const total = trains.length;
//    const active = trains.filter(t => t.status === 'Active').length;
//    const maintenance = trains.filter(t => t.status === 'Maintenance').length;
//    const outOfService = trains.filter(t => t.status === 'Out of Service').length;
//
//    document.getElementById('totalTrains').textContent = total;
//    document.getElementById('activeTrains').textContent = active;
//    document.getElementById('maintenanceTrains').textContent = maintenance;
//    document.getElementById('outOfServiceTrains').textContent = outOfService;
//}
//
//function editTrain(id) {
//    const train = trains.find(t => t.id === id);
//    if (!train) return;
//
//    editingTrainId = id;
//    editIndex = trains.findIndex(t => t.id === id);
//
//    // Populate form with current train data
//    const form = document.getElementById('trainForm');
//    if (form) {
//        // Handle different possible field names
//        const fields = {
//            'trainNumber': train.trainNumber,
//            'train_number': train.trainNumber,
//            'trainName': train.trainName,
//            'train_name': train.trainName,
//            'trainType': train.trainType,
//            'train_type': train.trainType,
//            'trainSpeed': train.speed,
//            'speed': train.speed,
//            'daysOfTravel': train.daysOfTravel,
//            'days_of_travel': train.daysOfTravel,
//            'totalCoaches': train.totalCoaches,
//            'total_coaches': train.totalCoaches,
//            'trainStatus': train.status,
//            'status': train.status
//        };
//
//        Object.keys(fields).forEach(fieldName => {
//            const field = form.querySelector(`[name="${fieldName}"], #${fieldName}`);
//            if (field) {
//                field.value = fields[fieldName];
//            }
//        });
//    }
//
//    // Update modal title
//    const modalTitle = document.querySelector('#addTrainModal .modal-title');
//    if (modalTitle) {
//        modalTitle.innerHTML = '<i class="bi bi-pencil me-2"></i>Edit Train';
//    }
//
//    // Update save button text
//    const saveBtn = document.querySelector('#addTrainModal .btn-danger');
//    if (saveBtn) {
//        saveBtn.textContent = 'Update Train';
//    }
//
//    // Show modal
//    const modal = new bootstrap.Modal(document.getElementById('addTrainModal'));
//    modal.show();
//}
//
//function deleteTrain(id) {
//    const train = trains.find(t => t.id === id);
//    if (!train) return;
//
//    if (confirm(`Are you sure you want to delete train "${train.trainName}" (${train.trainNumber})?`)) {
//        trains = trains.filter(t => t.id !== id);
//        renderTrainsTable();
//        updateStatistics();
//        showAlert('success', '🗑️ Train deleted successfully!');
//    }
//}
//
//// Navigation functions
//function loadTrains() {
//    showAlert('info', 'Loading trains...');
//    // Here you would typically load train data from an API
//}
//
//function loadRoutes() {
//    showAlert('info', 'Loading routes...');
//    // Here you would typically load route data from an API
//}
//
//function loadStaff() {
//    showAlert('info', 'Loading staff...');
//    // Here you would typically load staff data from an API
//}
//
//function loadSettings() {
//    showAlert('info', 'Loading settings...');
//    // Here you would typically load settings
//}
//
//function logout() {
//    if (confirm('Are you sure you want to logout?')) {
//        showAlert('info', 'Logging out...');
//        // Here you would typically handle logout
//        setTimeout(() => {
//            showAlert('success', 'Logged out successfully!');
//        }, 1000);
//    }
//}
//
//// Reset modal when closed
//document.addEventListener('DOMContentLoaded', function() {
//    const modal = document.getElementById('addTrainModal');
//    if (modal) {
//        modal.addEventListener('hidden.bs.modal', function () {
//            resetForm();
//        });
//    }
//});
//
//// Legacy function for backward compatibility
//function saveTrain() {
//    const form = document.getElementById('trainForm');
//    if (form) {
//        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
//        form.dispatchEvent(submitEvent);
//    }
//}