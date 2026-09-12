function formatTime(timeString) {
    if (!timeString)
        return 'N/A';

    try {
        let date;

        // Check if it's a timestamp (number)
        if (typeof timeString === 'number' || !isNaN(Number(timeString))) {
            date = new Date(Number(timeString));
        }
        // Check if it's already a Date object
        else if (timeString instanceof Date) {
            date = timeString;
        }
        // Check if it's a date string
        else if (timeString.includes('-') || timeString.includes('/')) {
            date = new Date(timeString);
        }
        // Check if it's in HH:MM format
        else if (timeString.includes(':') && timeString.split(':').length === 2) {
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours);
            const minute = parseInt(minutes) || 0;

            // Validate hour and minute
            if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
                return 'N/A';
            }

            const formattedMinute = minute.toString().padStart(2, '0');

            if (hour === 0)
                return `12:${formattedMinute} AM`;
            if (hour < 12)
                return `${hour}:${formattedMinute} AM`;
            if (hour === 12)
                return `12:${formattedMinute} PM`;
            return `${hour - 12}:${formattedMinute} PM`;
        } else {
            // Try to parse as a date string
            date = new Date(timeString);
        }

        // If we have a valid date object, format the time
        if (date && !isNaN(date.getTime())) {
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }

        return 'N/A';

    } catch (error) {
        console.log('Time formatting error:', error);
        return 'N/A';
    }
}

function formatDate(dateString) {
    if (!dateString)
        return 'N/A';

    try {
        let date;

        // Check if it's a timestamp (number)
        if (typeof dateString === 'number' || !isNaN(Number(dateString))) {
            date = new Date(Number(dateString));
        }
        // Check if it's already a Date object
        else if (dateString instanceof Date) {
            date = dateString;
        }
        // Parse as date string
        else {
            date = new Date(dateString);
        }

        // Check if date is valid and not the Unix epoch (1970)
        if (date && !isNaN(date.getTime()) && date.getFullYear() > 1970) {
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            return date.toLocaleDateString('en-US', options);
        }

        return 'N/A';

    } catch (error) {
        console.log('Date formatting error:', error);
        return 'N/A';
    }
}

function formatPrice(price) {
    if (!price && price !== 0)
        return 'Rs. 0';

    // Convert to number if it's a string
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;

    // Format with commas for thousands
    return `Rs. ${numPrice.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })}`;
}

async function loadWachlist() {
    console.log("load profile");
    const response = await fetch("WatchList", {
        method: "GET",
        credentials: "include"
    });

    if (response.ok) {
        const json = await response.json();
        console.log(json);

        if (json.status) {
            const routeContainer = document.getElementById('watchlist');
            // Clear existing content
            routeContainer.innerHTML = '';

            json.watchList.forEach(list => {
                // Format the data
                const departureTime = formatTime(list.train_routes_id?.departure_time);
                const arrivalTime = formatTime(list.train_routes_id?.arrival_time);
                const travelDate = formatDate(list.travel_date);
                const totalPrice = formatPrice(list.total_price);

                const cardHTML = `
                    <div class="card-header bg-danger text-white py-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <h6 class="mb-0 fw-semibold">
                                <i class="fas fa-ticket-alt me-2"></i>Booking #${list.qr_code || 'N/A'}
                            </h6>
                        </div>
                    </div>
                    <div class="card-body p-4">
                        <!-- Route Info -->
                        <div class="bg-light rounded p-3 mb-3">
                            <div class="row align-items-center text-center">
                                <div class="col-4">
                                    <h5 class="fw-bold text-danger mb-1">${list.train_routes_id?.source_id?.name || 'N/A'}</h5>
                                    <small class="text-muted">${departureTime}</small>
                                </div>
                                <div class="col-4">
                                    <i class="fas fa-arrow-right text-danger fs-4"></i>
                                    <div class="small text-muted mt-1">Journey</div>
                                </div>
                                <div class="col-4">
                                    <h5 class="fw-bold text-danger mb-1">${list.train_routes_id?.destination_id?.name || 'N/A'}</h5>
                                    <small class="text-muted">${arrivalTime}</small>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Booking Details -->
                        <div class="row g-3 mb-3">
                            <div class="col-6">
                                <small class="text-muted d-block">Date</small>
                                <span class="fw-semibold">${travelDate}</span>
                            </div>
                            <div class="col-6">
                                <small class="text-muted d-block">Train</small>
                                <span class="fw-semibold">${list.train_routes_id?.title || list.train_routes_id?.titile || 'N/A'}</span>
                            </div>
                            <div class="col-6">
                                <small class="text-muted d-block">Class</small>
                                <span class="fw-semibold">${list.class_id?.classes || 'N/A'}</span>
                            </div>
                            <div class="col-6">
                                <small class="text-muted d-block">Passengers</small>
                                <span class="fw-semibold">${list.passengers || 0}</span>
                            </div>
                        </div>
                        
                        <!-- Price and Actions -->
                        <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                            <div>
                                <span class="text-danger fw-bold fs-5">${totalPrice}</span>
                                <small class="text-muted d-block">Total Price</small>
                            </div>
                           
                        </div>
                    </div>
                `;

                routeContainer.innerHTML += cardHTML;
            });
        } else {
            // Handle case when json.status is false
            const routeContainer = document.getElementById('watchlist');
            routeContainer.innerHTML = `
                <div class="alert alert-info text-center" role="alert">
                    <i class="fas fa-info-circle me-2"></i>
                    No bookings found in your watchlist.
                </div>
            `;
        }
    } else {
        console.log("Response error");
        // Handle API error
        const routeContainer = document.getElementById('watchlist');
        routeContainer.innerHTML = `
            <div class="alert alert-danger text-center" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Failed to load watchlist. Please try again later.
            </div>
        `;
    }
}