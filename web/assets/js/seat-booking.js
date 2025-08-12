function formatSimpleDate(dateString) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const parts = dateString.split("-");
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parts[2];

    return `${day} ${months[monthIndex]} ${year}`;
}

async function verifyBooking() {

    const travelDateInput = document.getElementById('travelDate').value;
    const formattedDate = formatSimpleDate(travelDateInput);
    console.log(travelDateInput);



    const date = {
        travelDateInput: travelDateInput

    };
//
    try {
        const response = await fetch("Booking", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(date),
            credentials: "include"
        });

        if (response.ok) {
            
            const json = await response.json();
            if (json.status) {
                console.log(json);
                showToast('success', 'Successful', 'Coach saved successfully!');
//                document.getElementById("coachForm").reset();
            } else {
                showToast('error', 'Failed', json.message || 'Could not save coach.');
            }
        } else {
            showToast('error', 'Server Error', 'Failed to communicate with server.');
        }
    } catch (error) {
        console.error(error);
        showToast('error', 'Network Error', 'An error occurred while saving the coach.');
    }
}


