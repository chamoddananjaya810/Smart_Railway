
const stripe = Stripe("pk_test_51PLevYP1GdaOtmzhCdg6VzMZbcOzfYd6vN7rwgizmQHYW9o7zvENmheM5ANOLcfVScPoZRwAw5r6BkD5lkJ7R3YZ00LbT67G5y"); // Your Stripe Publishable Key here
const elements = stripe.elements();
const cardElement = elements.create("card");
cardElement.mount("#card-element");

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
  if (
    passengers.trim() === "" ||
    isNaN(passengers) ||
    Number(passengers) < 1 ||
    Number(passengers) > 20
) {
    alert("Please enter a passenger count between 1 and 20.");
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

   
        const response = await fetch("CheackOut", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const json = await response.json();
            if (json.status && json.clientSecret) {
                console.log("Client Secret:", json.clientSecret);

                const {error, paymentIntent} = await stripe.confirmCardPayment(json.clientSecret, {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: document.getElementById("customerName").value
                        }
                    }
                });

                if (error) {
                    document.getElementById("card-errors").textContent = error.message;
                } else if (paymentIntent && paymentIntent.status === "succeeded") {
                    alert("Payment Successful!");
                    console.log(json);
                    console.log("order Id:::", json.orderId);
                    window.location.reload();
                }
            } else {
                alert(json.message || json.error || "Checkout failed");
                if (json.message === "1") {
                    window.location = "login.html";
                }
            }
        } else {
            alert("Server error: Unable to process checkout.");
        }
   
}



//async function checkout() {
//    let total = document.getElementById("total").textContent.replace(/,/g, "").trim();
//    let subTotal = document.getElementById("totalPrice1").textContent.replace(/,/g, "").trim();
//    let tax = document.getElementById("tax").textContent.replace(/,/g, "").trim();
//
//    try {
//        const response = await fetch("Checkout", {
//            method: "POST",
//            headers: {"Content-Type": "application/json"},
//            body: JSON.stringify({subtotal: subTotal, tax: tax, total: total})
//        });
//
//        const json = await response.json();
//
//
//    } catch (err) {
//        console.error("Error:", err);
//        alert("Something went wrong. Please try again.");
//    }
//}
//async function checkout() {
//
//    const params = new URLSearchParams(window.location.search);
//    // Get routeID
//    let routeID = params.get("routeID");
//    let priceID = params.get("priceID");
//    console.log(routeID); // should log "1"
//    console.log(priceID); // should log "1"
//
//    let data = {
//        priceID:priceID,
//        routeID:routeID
//    };
//    let dataJSON = JSON.stringify(data);
//    const response = await fetch("CheackOut", {
//        method: "POST",
//        header: {
//            "Content-Type": "application/json"
//        },
//        body: dataJSON
//    });
//    if (response.ok) {
//        const json = await response.json();
//        if (json.status) {
//            console.log(json);
//            //PayHere Process
//            payhere.startPayment(json.payhereJson);
//        } else {
//            console.log(json);
////            popup.error({
////                message: json.message
////            });
//        }
//    } else {
//        console.log(json.message);
////        popup.error({
////            message: "Somthing went wrong. Please try again!"
////        });
//    }
//}

