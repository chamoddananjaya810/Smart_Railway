async function loadCoachesData() {

    const response = await fetch("../LoadCoachesData", {
        method: "GET", // Optional, defaults to "GET"
        credentials: "include"      // ✅ This sends cookies/session data
    });
    if (response.ok) {
        const  json = await response.json();


        if (json.status) {


            loadTrainSelect("trains", json.trianList, "train_name");
            loadSelect("class", json.classList, "classes");


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
    select.innerHTML = '<option value="0">Choose Train</option>';

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


async function saveCoach1() {
    const coachName = document.getElementById("coach").value.trim();
    const totalSeats = document.getElementById("seat").value.trim();
    const trainSelect = document.getElementById("trains").value;
    const classSelect = document.getElementById("class").value;

//    console.log(coachName);
//    console.log(totalSeats);
    console.log(trainSelect);
//    console.log(classSelect);

    // Validation
    if (!coachName || !totalSeats || trainSelect === "0" || classSelect === "0") {
        showToast('error', 'Validation Error', 'Please fill all fields correctly.');
        return;
    }

    const coach = {
        coach_name: coachName,
        total_seats: totalSeats,
        train_id: trainSelect,
        class_id: classSelect
    };

    try {
        const response = await fetch("../AddCoaches", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(coach),
            credentials: "include"
        });

        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                showToast('success', 'Successful', 'Coach saved successfully!');
//                document.getElementById("coachForm").reset();
            } else {
                showToast('error', 'Failed', json.message || 'Could not save coach.');
            }
        } else {
            showToast('error', 'Server Error', 'Failed to communicate with server.');
        }
    } catch (error) {
        console.error(error);
        showToast('error', 'Network Error', 'An error occurred while saving the coach.');
    }
}



function resetCoach() {
    // Clear hidden ID
    document.getElementById("coachId").value = "";

    // Clear text/number fields
    document.getElementById("coach").value = "";
    document.getElementById("seat").value = "";

    // Reset selects to first option
    document.getElementById("trains").selectedIndex = 0;
    document.getElementById("class").selectedIndex = 0;

    // Reset modal title to "Add New Coach"
    const modalTitle = document.querySelector('#addCoachModal .modal-title');
    if (modalTitle) {
        modalTitle.innerHTML = '<i class="bi bi-plus-circle me-2"></i>Add New Coach';
    }

    // Reset Save button text and onclick
    const modalFooterButtons = document.querySelectorAll('#addCoachModal .modal-footer .btn-danger');
    modalFooterButtons.forEach(btn => {
        if (btn.getAttribute('onclick')?.includes("updateCoach(")) {
            btn.textContent = 'Save Coach';
            btn.setAttribute('onclick', 'saveCoach1();');
        }
    });

    // Optional: reset global edit ID if you use one
    if (typeof editingCoachId !== "undefined") {
        editingCoachId = null;
    }
}




async function loadCoachTable() {
    console.log("Loading train table...");

    const response = await fetch("../loadCoachTable", {
        method: "GET", // Optional, defaults to "GET"
        credentials: "include"      // ✅ This sends cookies/session data
    });
    if (response.ok) {
        const json = await response.json();

        if (json.status) {


//            console.log(json.coachList);

////            <tr>
//        <th>ID</th>
//        <th>Coach Name</th>
//        <th>Total Seats</th>
//        <th>Train</th>
//        <th>Class</th>
//        <th>Actions</th>
//        </tr>
            const tbody = document.querySelector("#coachesTable tbody");
            tbody.innerHTML = ""; // Clear existing rows if any

            json.coachList.forEach(coach => {

                const row = document.createElement("tr");

                row.innerHTML = `
                <td><strong>${coach.id}</strong></td>
                    <td><strong>${coach.box_name}</strong></td>
                    <td>${coach.total_seats}</td>
                    <td><span class="badge bg-secondary">${coach.train_id.train_name}</span></td>
                    <td>${coach.class_id.classes}</td>
                    
                    
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="editCoach(${coach.id})" title="Edit">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" title="Delete">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                `;

                tbody.appendChild(row);

            });

            console.log("Train table loaded successfully.");
        } else {
            console.log("No train data found.");
        }

    } else {
        console.log("Response error: Could not fetch train data.");
    }
}




async function editCoach(coachId) {
    console.log("Editing coach:", coachId);

    const requestBody = {id: coachId};

    try {
        const response = await fetch("../SingelcoachData", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(requestBody),
            credentials: "include"
        });

        const json = await response.json();

        if (json.status && json.coachList && json.coachList.length > 0) {
            const coachData = json.coachList[0];



            // Store the ID for update action
            editingcoachId = coachId;

            // Fill modal fields
            document.getElementById("coachId").value = coachData.id;
            document.getElementById("coach").value = coachData.box_name;
            document.getElementById("seat").value = coachData.total_seats;
            document.getElementById("trains").value = coachData.train_id.tarin_id;
            document.getElementById("class").value = coachData.class_id.id;

            // Change modal title
            const modalTitle = document.querySelector('#addCoachModal .modal-title');
            if (modalTitle) {
                modalTitle.innerHTML = '<i class="bi bi-pencil me-2"></i>Edit Coach';
            }

            // Change Save button to Update button
            const saveBtn = document.querySelector('#addCoachModal .modal-footer .btn-danger');
            if (saveBtn) {
                saveBtn.textContent = 'Update Coach';
                saveBtn.setAttribute('onclick', `updateCoach(${coachData.id});`);
            }

            // Show coach modal
            const modalElement = document.getElementById('addCoachModal');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();

        } else {
            console.log("No coach data found.");
        }

    } catch (error) {
        console.error("Fetch error:", error);
        alert("An error occurred while loading coach data.");
    }
}








async function updateCoach(coachId) {

    console.log("coachId" + coachId);


    const coachName = document.getElementById("coach").value.trim();
    const totalSeats = document.getElementById("seat").value.trim();
    const trainSelect = document.getElementById("trains").value;
    const classSelect = document.getElementById("class").value;

//    console.log(coachName);
//    console.log(totalSeats);
    console.log(trainSelect);
//    console.log(classSelect);

    // Validation
    if (!coachName || !totalSeats || trainSelect === "0" || classSelect === "0") {
        showToast('error', 'Validation Error', 'Please fill all fields correctly.');
        return;
    }

    const coach = {
        coach_Id: coachId,
        coach_name: coachName,
        total_seats: totalSeats,
        train_id: trainSelect,
        class_id: classSelect
    };

    try {
        const response = await fetch("../UpdateCoaches", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(coach),
            credentials: "include"
        });

        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                showToast('success', 'Successful', 'Coach update successfully!');
                resetCoach();
//                document.getElementById("coachForm").reset();
            } else {
                showToast('error', 'Failed', json.message || 'Could not save coach.');
            }
        } else {
            showToast('error', 'Server Error', 'Failed to communicate with server.');
        }
    } catch (error) {
        console.error(error);
        showToast('error', 'Network Error', 'An error occurred while saving the coach.');
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