async function checkout() {
    // Collect form values
    const travel_date = document.getElementById("travel_date").value;
    const class_id = document.getElementById("class_id").value;
    const passengers = document.getElementById("passengers").value;
    const description = document.getElementById("description").value;
    const train_routes_id = document.getElementById("train_routes_id").value;
    const price_id = document.getElementById("price_id").value;
    const total_price = document.getElementById("total_price").value;
    const payment_method = document.getElementById("payment_method").value;

    // ===== Validation =====
    if (!travel_date) {
        alert("Please select a travel date.");
        return;
    }

    // ===== Date validation =====
    const today = new Date();
    today.setHours(0, 0, 0, 0); // ignore time part
    const selectedDate = new Date(travel_date);

    if (selectedDate < today) {
        alert("Travel date cannot be in the past.");
        return;
    }
  
    if (class_id === "0") {
        alert("Please select a travel class.");
        return;
    }
    if (passengers.trim() === "" || isNaN(passengers) || Number(passengers) <= 0) {
        alert("Please enter a valid passenger count.");
        return;
    }
    if (!total_price || Number(total_price) <= 0) {
        alert("Total price is missing. Please select class and passengers first.");
        return;
    }
    if (!payment_method) {
        alert("Please select a payment method.");
        return;
    }

    // Prepare request data
    const data = {
        travel_date: travel_date,
        class_id: class_id,
        passengers: Number(passengers),
        description: description,
        train_routes_id: train_routes_id,
        price_id: price_id,
        total_price: Number(total_price),
        payment_method: payment_method
    };

    try {
        const response = await fetch("CheackOut", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                console.log("Checkout success:", json);
                alert("Proceeding to payment...");
                // payhere.startPayment(json.payhereJson);
            } else {
                console.error("Checkout failed:", json.message);
                alert("Error: " + json.message);
            }
        } else {
            alert("Server error: Unable to process checkout.");
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Network error: Please check your connection.");
    }
}


async function checkout() {

    const params = new URLSearchParams(window.location.search);
    // Get routeID
    let routeID = params.get("routeID");
    let priceID = params.get("priceID");
    console.log(routeID); // should log "1"
    console.log(priceID); // should log "1"

    let data = {
        priceID:priceID,
        routeID:routeID
    };
    let dataJSON = JSON.stringify(data);
    const response = await fetch("CheackOut", {
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: dataJSON
    });
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json);
            //PayHere Process
//            payhere.startPayment(json.payhereJson);
        } else {
            console.log(json);
//            popup.error({
//                message: json.message
//            });
        }
    } else {
        console.log(json.message);
//        popup.error({
//            message: "Somthing went wrong. Please try again!"
//        });
    }
}

