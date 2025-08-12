

async function  loadSimpleBookingPrices() {

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("id")) {
        const  statinId = searchParams.get("id");

        const  response = await fetch("LoadStaionPrice?id=" + statinId);
        if (response.ok) {
            const  json = await response.json();
            if (json.status) {
                console.log(json.stationList);





//                const tbody = document.querySelector("#stationTable tbody");
//                tbody.innerHTML = ""; // Clear existing rows if any
//
//                json.stationList.forEach(station => {
//                    console.log(station.id);
//                    console.log(station.stop_platform);
//                    console.log(station.train_routes_id.title);
//                    console.log(station.arrival_time);
//                    console.log(station.departure_time);
//                    console.log(station.station_id.name);
//
//                    const row = document.createElement("tr");
//                    row.innerHTML = `
//        <td><span class="badge bg-primary fs-6">${station.id}</span></td>
//            <td class="fw-semibold">${station.station_id.name}</td>
//            <td><span class="badge bg-info text-dark">${station.stop_platform}</span></td>
//            <td class="text-success fw-bold text-nowrap">${station.arrival_time}</td>
//            <td class="text-danger fw-bold text-nowrap">${station.departure_time}</td>
//            <td><span class="badge bg-secondary fs-6">${station.train_routes_id.id}</span></td>
//            <td>
//                <!-- Responsive button group: vertical on mobile, horizontal on desktop -->
//                <div class="btn-group-vertical btn-group-sm d-sm-none" role="group">
//                    <button class="btn btn-outline-primary btn-sm mb-1" title="View Details">View</button>
//                    <button class="btn btn-outline-secondary btn-sm mb-1" title="Edit">Edit</button>
//                    <button class="btn btn-outline-danger btn-sm" title="Delete">Del</button>
//                </div>
//                <div class="btn-group btn-group-sm d-none d-sm-flex" role="group">
//                    <button class="btn btn-outline-primary btn-sm" title="View Details">View</button>
//                   
//                </div>
//            </td>
//    `;
//
//                    tbody.appendChild(row);
//                });

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
