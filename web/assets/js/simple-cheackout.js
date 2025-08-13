
async function simplePayment() {
    // Collect form values
    const booking_date = document.getElementById("booking_date").value;
    const station_id = document.getElementById("StationId").value;
    const price_id = document.getElementById("priceId").value;
    const from_station = document.getElementById("from_station").value;
    const to_station = document.getElementById("to_station").value;
    const train_station_price = document.getElementById("train_station_price").value;
    const passengers = document.getElementById("passengers").value;
    const total = document.getElementById("total").value;
    const payment_method = 1; // fixed value

    // ===== Validation =====
    if (!booking_date) {
        alert("Please select a booking date.");
        return;
    }

    // Date validation (no past dates)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(booking_date);

    if (selectedDate < today) {
        alert("Booking date cannot be in the past.");
        return;
    }

    if (!station_id || station_id === "0") {
        alert("Please select a station.");
        return;
    }

    if (!price_id || price_id === "0") {
        alert("Please select a price option.");
        return;
    }

    if (!from_station.trim()) {
        alert("From station is missing.");
        return;
    }

    if (!to_station.trim()) {
        alert("To station is missing.");
        return;
    }

    if (!train_station_price || isNaN(train_station_price) || Number(train_station_price) <= 0) {
        alert("Invalid train station price.");
        return;
    }

    if (!passengers || isNaN(passengers) || Number(passengers) <= 0) {
        alert("Please enter a valid passenger count.");
        return;
    }

    if (!total || isNaN(total) || Number(total) <= 0) {
        alert("Total amount is invalid.");
        return;
    }

    // Prepare data object
    const data = {
        booking_date: booking_date,
        station_id: station_id,
        price_id: price_id,
        from_station: from_station,
        to_station: to_station,
        train_station_price: Number(train_station_price),
        passengers: Number(passengers),
        total: Number(total),
        payment_method: payment_method
    };

    try {
        const response = await fetch("SimplePaymentCheckOut", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                console.log("Payment success:", json);
                alert("Proceeding to payment...");
                // Example: payhere.startPayment(json.paymentDetails);
            } else {
                console.error("Payment failed:", json.message);
                alert("Error: " + json.message);
            }
        } else {
            alert("Server error: Unable to process payment.");
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Network error: Please check your internet connection.");
    }
}
