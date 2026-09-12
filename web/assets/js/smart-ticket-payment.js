async function load1() {

    
    try {

        const response = await fetch("GetBookingServlet");
 

        if (!response.ok) {
            console.error("No booking data found in session");
            return;
        }

        const selectedBooking = await response.json();
        console.log("Selected booking data:", selectedBooking);
    
        console.log("Selected booking data:", selectedBooking);


        document.getElementById("train_routes_id").value = selectedBooking.train_routes_id.id;


        document.getElementById("price_id").value = selectedBooking.id;


        document.getElementById("first_class_price").value = selectedBooking.first_class_price;
        document.getElementById("second_class_price").value = selectedBooking.second_class_price;


        if (selectedBooking.class_id) {
//            document.getElementById("class_id").value = selectedBooking.class_id;
        }
    } catch (error) {
        console.error("Error loading booking:", error);
    }
}

  