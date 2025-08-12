async function load1() {

    console.log("load");
    console.log("load");
    console.log("load");
    console.log("load");
    console.log("load");
    console.log("load");
    console.log("load");
    console.log("load");
    console.log("load");
    try {
// Fetch booking from backend session
        const response = await fetch("GetBookingServlet");
        console.log("wfwf" + response);
        console.log("wfwf" + response);

        if (!response.ok) {
            console.error("No booking data found in session");
            return;
        }

        const selectedBooking = await response.json();
        console.log("Selected booking data:", selectedBooking);
        // Example: display booking on page
        console.log("Selected booking data:", selectedBooking);

// Fill Train Route ID
        document.getElementById("train_routes_id").value = selectedBooking.train_routes_id.id;

// Fill Price ID
        document.getElementById("price_id").value = selectedBooking.id;

// Fill First & Second Class prices
        document.getElementById("first_class_price").value = selectedBooking.first_class_price;
        document.getElementById("second_class_price").value = selectedBooking.second_class_price;

// If you want to auto-select the class based on booking data
        if (selectedBooking.class_id) {
//            document.getElementById("class_id").value = selectedBooking.class_id;
        }
    } catch (error) {
        console.error("Error loading booking:", error);
    }
}

  