async function load() {

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
        const response = await fetch("GetTicketServlet");
        console.log("wfwf" + response);
        console.log("wfwf" + response);

        if (!response.ok) {
            console.error("No booking data found in session");
            return;
        }

        const selectedTicket = await response.json();
        console.log("Selected booking data:", selectedTicket);
        // Example: display booking on page
        console.log("Selected booking data:",selectedTicket);
//
// Fill Train Route ID
        document.getElementById("StationId").value = selectedTicket.station_from.id;

// Fill Price ID
        document.getElementById("priceId").value = selectedTicket.id;

// Fill First & Second Class prices
        document.getElementById("from_station").value = selectedTicket.station_from.station_id.name;
        document.getElementById("to_station").value = selectedTicket.station_to.name;
        document.getElementById("train_station_price").value = selectedTicket.price;


    } catch (error) {
        console.error("Error loading booking:", error);
    }
}
