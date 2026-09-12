// Function to calculate travel duration
function calculateDuration(departure, arrival) {
    // Extract time from datetime string if needed
    let depTime = departure;
    let arrTime = arrival;

    // If these are full datetime strings, extract just the time part
    if (departure.includes('T') || departure.includes(' ')) {
        depTime = new Date(departure).toTimeString().slice(0, 5); // Extract HH:MM
        arrTime = new Date(arrival).toTimeString().slice(0, 5);   // Extract HH:MM
    }

    // Construct Date objects for a fixed date with the given times
    const dep = new Date(`2024-01-01T${depTime}:00`);
    const arr = new Date(`2024-01-01T${arrTime}:00`);

    // Calculate difference in milliseconds
    let diff = arr - dep;

    // If arrival is before departure, it means arrival is on next day
    if (diff < 0) {
        diff += 24 * 60 * 60 * 1000; // Add 24 hours in milliseconds
    }

    // Calculate hours and minutes from difference
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
}

// Alternative function if your times are already in HH:MM format
function calculateDurationSimple(departureTime, arrivalTime) {
    const [depHours, depMinutes] = departureTime.split(':').map(Number);
    const [arrHours, arrMinutes] = arrivalTime.split(':').map(Number);

    let depTotalMinutes = depHours * 60 + depMinutes;
    let arrTotalMinutes = arrHours * 60 + arrMinutes;

    // If arrival is next day
    if (arrTotalMinutes < depTotalMinutes) {
        arrTotalMinutes += 24 * 60; // Add 24 hours
    }

    const diffMinutes = arrTotalMinutes - depTotalMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours}h ${minutes}m`;
}

// Function to book train


async function loadRoute() {
    const response = await fetch("LoadRouteHome", {
        method: "GET",
        credentials: "include"
    });

    if (response.ok) {
        const json = await response.json();

        if (json.status) {
            console.log(json.routeList);

            // Get route container element
            const routeContainer = document.getElementById('routeContainer');

            // Clear existing content
            routeContainer.innerHTML = '';

            json.routeList.forEach(route => {
                console.log(route);
                console.log(route.titile); // Fixed: route.title instead of route.titile
                console.log(route.destination_id.name);
                console.log(route.source_id.name);
                console.log(route.arrival_time);
                console.log(route.departure_time);
                console.log(route.train_id.speed);
                console.log(route.train_id.days_of_travel);

                // Calculate duration for this route
                const duration = calculateDuration(route.departure_time, route.arrival_time);

                // Format times for display
                const formatTime = (timeString) => {
                    const date = new Date(timeString);
                    return date.toLocaleTimeString('en-US', {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                };

                const departureDisplay = formatTime(route.departure_time);
                const arrivalDisplay = formatTime(route.arrival_time);

                const cardHTML = `
        <div class="col-sm-6 col-lg-4 mb-4">
            <div class="card red-card bg-white text-dark shadow-sm h-100">
                <div class="card-header border-0 py-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="fw-bold">
                            <i class="fas fa-train me-1"></i> ${route.titile}
                        </small>
                        <span class="badge bg-light text-dark">Express</span>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title text-center fw-bold mb-3">
                        <i class="fas fa-route me-2"></i> ${route.source_id.name} ➜ ${route.destination_id.name}
                    </h5>
                    <div class="row mb-3">
                        <div class="col-5 text-center">
                            <div class="bg-success-subtle rounded-3 p-2">
                                <i class="fas fa-play-circle text-success"></i>
                                <div class="fw-bold text-success">
                                    ${departureDisplay}
                                </div>
                                <small class="text-muted">පිටත් වීම</small>
                            </div>
                        </div>
                        <div class="col-2 text-center">
                            <div class="mt-2">
                                <i class="fas fa-arrow-right text-danger"></i>
                                <div class="small text-muted">${duration}</div>
                            </div>
                        </div>
                        <div class="col-5 text-center">
                            <div class="bg-danger-subtle rounded-3 p-2">
                                <i class="fas fa-stop-circle text-danger"></i>
                                <div class="fw-bold text-danger">
                                    ${arrivalDisplay}
                                </div>
                                <small class="text-muted">පැමිණීම</small>
                            </div>
                        </div>
                    </div>
                    <div class="small text-muted mb-2">
                        <i class="fas fa-tachometer-alt me-1"></i> Speed: ${route.train_id.speed_id.name}
                        <br>
                        <i class="fas fa-calendar-alt me-1"></i> ${route.train_id.days_of_travel_id.name}
                    </div>
                </div>
                <div class="card-footer border-0 bg-transparent">
                    <div class="d-grid gap-2">
                        <button class="btn btn-danger" onclick="bookTrain(${route.id})">
                            <i class="fas fa-ticket-alt me-2"></i> Book Now
                        </button>
                        <button class="btn btn-outline-secondary btn-sm">
                            <i class="fas fa-info-circle me-1"></i> More Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

                routeContainer.innerHTML += cardHTML;
            });

            console.log("Routes loaded successfully");

        } else {
            console.log("No routes found");
        }
    } else {
        console.log("Response error");
    }
}

function bookTrain(routeId) {
    window.location.href = `smart-booking.html?id=${routeId}`;
}