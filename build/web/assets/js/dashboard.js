function dashboard() {
    fetch('dashboard.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('dashboard').innerHTML = html;
            });
}
// Train data storage
let trains = [
    {
        train_id: "T100",
        train_name: "Ruhunu Kumari",
        train_number: "1001",
        speed: "Express",
        days_of_travel: "Every Day",
        train_type: "Reserved",
        total_coaches: "10"
    }
];

let editIndex = null;

// DOM elements
const addTrainBtn = document.getElementById('addTrainBtn');
const trainModal = new bootstrap.Modal(document.getElementById('trainModal'));
const trainFormElement = document.getElementById('trainFormElement');
const modalTitle = document.getElementById('modalTitle');
const submitBtnText = document.getElementById('submitBtnText');
const trainTableBody = document.getElementById('trainTableBody');
const alertContainer = document.getElementById('alertContainer');
const alertMessage = document.getElementById('alertMessage');
const alertText = document.getElementById('alertText');
const loadingSpinner = document.getElementById('loadingSpinner');

// Show loading spinner
function showLoading() {
    loadingSpinner.classList.add('show');
}

// Hide loading spinner
function hideLoading() {
    loadingSpinner.classList.remove('show');
}

// Show alert function with animation
function showAlert(type, message) {
    alertContainer.classList.remove('d-none');
    alertMessage.className = `alert alert-${type} alert-dismissible fade show`;
    alertText.textContent = message;

    // Auto-hide after 3 seconds
    setTimeout(() => {
        alertContainer.classList.add('d-none');
    }, 3000);
}

// Reset form function
function resetForm() {
    trainFormElement.reset();
    editIndex = null;
    modalTitle.textContent = 'Add New Train';
    submitBtnText.textContent = 'Add Train';
}

// Show modal function
function showModal(isEdit = false) {
    if (isEdit) {
        modalTitle.textContent = 'Edit Train';
        submitBtnText.textContent = 'Update Train';
    } else {
        resetForm();
    }
    trainModal.show();
}

// Render table function with animations
function renderTable() {
    trainTableBody.innerHTML = '';

    if (trains.length === 0) {
        trainTableBody.innerHTML = `
                        <tr>
                            <td colspan="8" class="text-center text-muted py-4">
                                <i class="fas fa-train fa-2x mb-2 d-block"></i>
                                No trains added yet.
                            </td>
                        </tr>
                    `;
        return;
    }

    trains.forEach((train, index) => {
        const speedBadge = train.speed === 'Express' ? 'success' :
                train.speed === 'Semi-Express' ? 'warning' : 'secondary';
        const typeBadge = train.train_type === 'Reserved' ? 'primary' : 'info';

        const row = document.createElement('tr');
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        row.innerHTML = `
                        <td>${train.train_id}</td>
                        <td>${train.train_name}</td>
                        <td>${train.train_number}</td>
                        <td><span class="badge bg-${speedBadge}">${train.speed}</span></td>
                        <td>${train.days_of_travel}</td>
                        <td><span class="badge bg-${typeBadge}">${train.train_type}</span></td>
                        <td>${train.total_coaches}</td>
                        <td class="text-center">
                            <button class="btn btn-outline-danger btn-sm btn-animated edit-btn" data-index="${index}">
                                <i class="fas fa-edit me-1"></i>Edit
                            </button>
                        </td>
                    `;

        trainTableBody.appendChild(row);

        // Animate row entrance
        setTimeout(() => {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Edit train function
function editTrain(index) {
    const train = trains[index];
    editIndex = index;

    // Populate form with train data
    document.getElementById('train_id').value = train.train_id;
    document.getElementById('train_name').value = train.train_name;
    document.getElementById('train_number').value = train.train_number;
    document.getElementById('speed').value = train.speed;
    document.getElementById('days_of_travel').value = train.days_of_travel;
    document.getElementById('train_type').value = train.train_type;
    document.getElementById('total_coaches').value = train.total_coaches;

    showModal(true);
}

// Event listeners
addTrainBtn.addEventListener('click', () => {
    showModal(false);
});

trainFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading();

    const formData = new FormData(trainFormElement);
    const trainData = {
        train_id: formData.get('train_id') || `T${Date.now()}`,
        train_name: formData.get('train_name'),
        train_number: formData.get('train_number'),
        speed: formData.get('speed'),
        days_of_travel: formData.get('days_of_travel'),
        train_type: formData.get('train_type'),
        total_coaches: formData.get('total_coaches')
    };

    const isUpdate = editIndex !== null;
    const url = isUpdate
            ? "http://127.0.0.1:8080/SmartRailway/UpdateTrainForm"
            : "http://127.0.0.1:8080/SmartRailway/AddTrainForm";

    try {
        // Simulate network delay for demo
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(trainData),
            credentials: "include"
        });

        hideLoading();

        if (!response.ok) {
            throw new Error("Network error");
        }

        const data = await response.json();

        if (data.status === true) {
            if (isUpdate) {
                trains[editIndex] = trainData;
                showAlert('success', '🚂 Train updated successfully!');
            } else {
                trains.push(trainData);
                showAlert('success', '🚂 Train added successfully!');
            }

            renderTable();
            trainModal.hide();
            resetForm();
        } else {
            showAlert('danger', data.message || 'Server error occurred');
        }
    } catch (error) {
        hideLoading();
        showAlert('danger', '⚠️ Network error occurred');
        console.error('Error:', error);
    }
});

// Event delegation for edit buttons
trainTableBody.addEventListener('click', (e) => {
    if (e.target.closest('.edit-btn')) {
        const index = parseInt(e.target.closest('.edit-btn').dataset.index);
        editTrain(index);
    }
});

// Modal event listeners
document.getElementById('trainModal').addEventListener('hidden.bs.modal', () => {
    resetForm();
});

// Session storage check
const email = sessionStorage.getItem("email");
if (email) {
    console.log("Email from session:", email);
}

// Initial render with animation
setTimeout(() => {
    renderTable();
}, 300);

// Add some particle effects on button hover (optional)
document.querySelectorAll('.btn-animated').forEach(btn => {
    btn.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-2px) scale(1.02)';
    });

    btn.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});