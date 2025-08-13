

let ticketData = null;

async function  loadSimpleBookingPrices() {

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("id")) {
        const  statinId = searchParams.get("id");

        const  response = await fetch("LoadStaionPrice?id=" + statinId);
        if (response.ok) {
            const  json = await response.json();
            if (json.status) {
                console.log(json.priceList);

                ticketData = json;



                const tbody = document.querySelector("#priceTable tbody");
                tbody.innerHTML = ""; // Clear existing rows if any

                json.priceList.forEach(stationPrice => {
                    console.log(stationPrice.id);
                    console.log(stationPrice.station_from.name);
                    console.log(stationPrice.station_to.name);

                    console.log(stationPrice.price);


                    const row = document.createElement("tr");
                    row.innerHTML = `
        <td><span class="badge bg-primary fs-6">${stationPrice.id}</span></td>
            <td class="fw-semibold">${stationPrice.station_from.station_id.name}</td>
            <td><span class="badge bg-info text-dark">${stationPrice.station_to.name}</span></td>
            <td class="text-success fw-bold text-nowrap">${stationPrice.price}</td>
         
            <td>
                <!-- Responsive button group: vertical on mobile, horizontal on desktop -->
                <div class="btn-group-vertical btn-group-sm " role="group">
                    <button class="btn btn-outline-primary btn-sm mb-1" title="payment" onclick="bookTicket(${stationPrice.id});">payment</button>
                  
                </div>
            </td>
    `;

                    tbody.appendChild(row);
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
async function bookTicket(selectedId) {
    const selectedData = ticketData.priceList.find(item => item.id === selectedId);
    if (!selectedData)
        return;

    // Store in session
    await fetch("StoreSimpleTicketServlet", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(selectedData)
    });

    // Redirect to payment page
    window.location.href = "simple-ticket payment.html";
}
