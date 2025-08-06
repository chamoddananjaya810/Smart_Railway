
async function loadData() {
    console.log("ok");

    const response = await fetch("../LoadTrainData");
    if (response.ok) {
        const  json = await response.json();
        console.log(json);
        
        if (json.status) {
            
            
             loadSelect("trainType", json.trainTypes);
             loadSelect("speedType", json.speeds);
             loadSelect("daysOfTravel", json.daysOfTravel);
             loadSelect("trainStatus", json.statuses);
            
           

             console.log("susss");


        } else {
//            document.getElementById("massage").innerHTML = json.massage;

            console.log("no");
        }
    } else {
//        document.getElementById("massage").innerHTML = "Unable to get product data please try again later";
        console.log("response error");
    }
}

async function loadTrainTableData() {
    console.log("ok");

    const response = await fetch("../LoadTrainTable");
    if (response.ok) {
        const  json = await response.json();
        console.log(json);
        
        if (json.status) {
             console.log(json.TrainList); 
           
           
            
           

             console.log("susss");


        } else {
//            document.getElementById("massage").innerHTML = json.massage;

            console.log("no");
        }
    } else {
//        document.getElementById("massage").innerHTML = "Unable to get product data please try again later";
        console.log("response error");
    }
}






function loadSelect(selectId, list, isObject = false, key = "value") {
    const select = document.getElementById(selectId);
    select.innerHTML = `<option value="">Select</option>`; // reset

    list.forEach(item => {
        const option = document.createElement("option");

        if (isObject) {
            const value = item[key];
            option.value = value;
            option.textContent = value ? value.replaceAll("_", " ") : "";
        } else {
            if (item && typeof item === "string") {
                option.value = item;
                option.textContent = item.replaceAll("_", " ");
            }
        }

        select.appendChild(option);
    });
}


function  loadTrainTableData(){
    
    
    
}

async function saveTrain() {
    const trainNumber = document.getElementById("trainNumber").value;
    const trainName = document.getElementById("trainName").value;
    const trainType = document.getElementById("trainType").value;
    const speedType = document.getElementById("speedType").value;
    const daysOfTravel = document.getElementById("daysOfTravel").value;
    const totalCoaches = document.getElementById("totalCoaches").value;
    const trainStatus = document.getElementById("trainStatus").value;
   
    // Use snake_case property names to match Java expectations
    const train = {
        trainNumber: trainNumber,
        trainName: trainName,
        trainType: trainType,
        speedType: speedType,  // Note: Java expects 'speed', not 'speed_type'
        daysOfTravel: daysOfTravel,
        totalCoaches: totalCoaches,
        trainStatus: trainStatus
    };
    
    try {
        // Send request
        
        const trainJson = JSON.stringify(train);
        const response = await fetch("../AddTrainForm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: trainJson
        });
        
        // Handle response
        if (response.ok) {
            const json = await response.json();
            console.log("Server response:", json);  // Fixed: log json, not response
            if (json.status) {
                alert("Train saved successfully!");
                // Optionally clear form
                document.getElementById("trainForm").reset();
            } else {
                alert("Failed to save train: " + (json.message || "Unknown error"));
            }
        } else {
            console.error("Server error:", response.status);
            alert("Failed to communicate with server.");
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("An error occurred while saving the train.");
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