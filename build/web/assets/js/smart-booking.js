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

let bookingData = null;
async function  loadSmartBooking() {

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("id")) {
        const  routeId = searchParams.get("id");

        const  response = await fetch("loadSamrtBooking?id=" + routeId);
        if (response.ok) {
            const  json = await response.json();
            if (json.status) {
                bookingData = json;
                console.log(json);
                const routeContainer = document.getElementById('routeContainer2');
                // store globally

                // Clear existing content
                routeContainer.innerHTML = '';
                json.pList.forEach(price => {
                    console.log(price.train_routes_id.id);
                    console.log(price.first_class_price);
                    console.log(price.second_class_price);
                    console.log(price.to.name);
                    console.log(price.from.name);

                    // Calculate duration for this route
                    const duration = calculateDuration(
                            price.train_routes_id.departure_time,
                            price.train_routes_id.arrival_time
                            );


                    // Format times for display
                    const formatTime = (timeString) => {
                        const date = new Date(timeString);
                        return date.toLocaleTimeString('en-US', {
                            hour12: false,
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    };

                    const departureDisplay = formatTime(price.train_routes_id.departure_time);
                    const arrivalDisplay = formatTime(price.train_routes_id.arrival_time);

                    const cardHTML = `
    <div class="col-sm-6 col-lg-4 mb-4">
        <div class="card red-card bg-white text-dark shadow-sm h-100">
            <div class="card-header border-0 py-2">
                <div class="d-flex justify-content-between align-items-center">
                    <small class="fw-bold">
                        <i class="fas fa-train me-1"></i> ${price.train_routes_id.titile}
                    </small>
                    <span class="badge bg-light text-dark">Express</span>
                </div>
            </div>
            <div class="card-body">
                <h5 class="card-title text-center fw-bold mb-3">
                    <i class="fas fa-route me-2"></i> ${price.from.name} ➜ ${price.to.name}
                </h5>
                
                <!-- Pricing Section -->
                <div class="row mb-3">
                    <div class="col-6">
                        <div class="bg-primary-subtle rounded-3 p-2 text-center">
                            <i class="fas fa-crown text-primary"></i>
                            <div class="fw-bold text-primary">
                                Rs. ${price.first_class_price}
                            </div>
                            <small class="text-muted">First Class</small>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="bg-info-subtle rounded-3 p-2 text-center">
                            <i class="fas fa-chair text-info"></i>
                            <div class="fw-bold text-info">
                                Rs. ${price.second_class_price}
                            </div>
                            <small class="text-muted">Second Class</small>
                        </div>
                    </div>
                </div>
                

                <div class="small text-muted mb-2">
                    <i class="fas fa-tachometer-alt me-1"></i> Speed: ${price.train_routes_id.train_id.speed_id.name}
                    <br>
                    <i class="fas fa-calendar-alt me-1"></i> ${price.train_routes_id.train_id.days_of_travel_id.name}
                    <br>
                    <i class="fas fa-hashtag me-1"></i> Route ID: ${price.train_routes_id.id}
                </div>
            </div>
            <div class="card-footer border-0 bg-transparent">
                <div class="d-grid gap-2">
                    <button class="btn btn-danger" onclick="bookTrain(${price.id});">
                        <i class="fas fa-ticket-alt me-2"  ></i> Book Now
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



async function bookTrain(selectedId) {
    const selectedData = bookingData.pList.find(item => item.id === selectedId);
    if (!selectedData) return;

    // Store in session
    await fetch("StoreBookingServlet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedData)
    });

    // Redirect to payment page
    window.location.href = "smart-ticket-payment.html";
}

