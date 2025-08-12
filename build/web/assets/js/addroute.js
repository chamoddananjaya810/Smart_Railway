async function loadRouteData() {
    console.log("loadData");
    try {
        // Use "../LoadRoute" to go up one level from admin folder
        const response = await fetch("../LoadRoute", {
            method: "GET",
            credentials: "include"
        });

        console.log("Response status:", response.status);
        console.log("Response URL:", response.url);

        if (response.ok) {
            const json = await response.json();
            console.log("Received JSON:", json);

            if (json.status) {
                console.log(json);
                console.log("route data loaded");
                loadTrainSelect("modalTrain", json.trainList, "train_name");
                loadSelect("sourceStation", json.stationList);
                loadSelect("destinationStation", json.stationList);
            } else {
                console.error("Server error:", json.message || "Invalid details");
            }
        } else {
            console.error("Network error, status:", response.status);
            const errorText = await response.text();
            console.error("Error response:", errorText);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

function loadSelect(selectId, list) {
    const select = document.getElementById(selectId);
    list.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id; // Use the nested id property
        option.innerHTML = item.name; // Display the nested name property
        select.appendChild(option);
    });
}

function loadTrainSelect(selectId, list, textKey) {
    const select = document.getElementById(selectId);
    if (!select) {
        console.error(`Select element with ID "${selectId}" not found`);
        return;
    }

    // Default option එක reset කරන්න
    select.innerHTML = '<option value="0">Choose Train</option>';

    list.forEach(item => {
        const option = document.createElement("option");
        option.value = item.tarin_id ?? ""; // Value → tarin_id
        option.textContent = item[textKey] ?? ""; // Text → train_name
        select.appendChild(option);
    });
}