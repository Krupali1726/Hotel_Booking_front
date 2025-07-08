


// **************************** Card Validation *********************

function formatCardNumber(input) {
  let value = input.value.replace(/\D/g, '');
  let formattedValue = '';

  for (let i = 0; i < value.length; i++) {
    if (i > 0 && i % 4 === 0) {
      formattedValue += ' ';
    }
    formattedValue += value[i];
  }

  input.value = formattedValue;
  validateCardNumber(input);
}

function validateCardNumber(input) {
  const cardNumber = input.value.replace(/\s/g, '');
  const cardNumberError = document.getElementById('cardNumberError');

  if (cardNumber.length < 13 || cardNumber.length > 19) {
    input.classList.add('is-invalid');
    cardNumberError.textContent = 'Card number must be between 13 and 19 digits';
    return false;
  }

  // Luhn algorithm for card number validation
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  if (sum % 10 !== 0) {
    input.classList.add('is-invalid');
    cardNumberError.textContent = 'Invalid card number';
    return false;
  }

  input.classList.remove('is-invalid');
  cardNumberError.textContent = '';
  return true;
}

// // Expiry Date Validation
function formatExpiryDate(input) {
  let value = input.value.replace(/\D/g, '');

  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2);
  }

  input.value = value;
  validateExpiryDate(input);
}

function validateExpiryDate(input) {
  const expiryDateError = document.getElementById('expiryDateError');
  const [month, year] = input.value.split('/');

  if (!month || !year) {
    input.classList.add('is-invalid');
    expiryDateError.textContent = 'Please enter a valid expiry date';
    return false;
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  const expMonth = parseInt(month);
  const expYear = parseInt(year);

  if (expMonth < 1 || expMonth > 12) {
    input.classList.add('is-invalid');
    expiryDateError.textContent = 'Invalid month';
    return false;
  }

  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    input.classList.add('is-invalid');
    expiryDateError.textContent = 'Card has expired';
    return false;
  }

  input.classList.remove('is-invalid');
  expiryDateError.textContent = '';
  return true;
}

// // CVV Validation
function validateCVV(input) {
  const cvv = input.value.replace(/\D/g, '');
  const cvvError = document.getElementById('cvvError');

  if (cvv.length < 3 || cvv.length > 4) {
    input.classList.add('is-invalid');
    cvvError.textContent = 'CVV must be 3 or 4 digits';
    return false;
  }

  input.classList.remove('is-invalid');
  cvvError.textContent = '';
  return true;
}

// Cardholder Name Validation
function validateCardHolderName(input) {
  const name = input.value.trim();
  const cardHolderNameError = document.getElementById('cardHolderNameError');

  if (name.length < 3) {
    input.classList.add('is-invalid');
    cardHolderNameError.textContent = 'Name must be at least 3 characters long';
    return false;
  }

  if (!/^[a-zA-Z\s]*$/.test(name)) {
    input.classList.add('is-invalid');
    cardHolderNameError.textContent = 'Name can only contain letters and spaces';
    return false;
  }

  input.classList.remove('is-invalid');
  cardHolderNameError.textContent = '';
  return true;
}


// ******************************************************************

window.onload = function () {
    let mainDuration = 15 * 60; // Initial timer in seconds
    let mainTimerInterval;

    let extensionDuration = 90; // Extended time (1 min 30 sec)
    let extendedInterval;

    let sessionExpired = false;

    // DOM Elements
    const countdownElement = document.getElementById('countdown');
    const extendedText = document.getElementById('extendedTimerText');

    // Format seconds as "MM min SS sec"
    function formatTime(seconds) {
        const min = String(Math.floor(seconds / 60)).padStart(2, '0');
        const sec = String(seconds % 60).padStart(2, '0');
        return `${min} min ${sec} sec`;
    }

    // Start Main Timer
    function startMainTimer() {
        function updateMainTimer() {
            countdownElement.textContent = `Room(s) held for ${formatTime(mainDuration)}`;

            if (mainDuration > 0) {
                mainDuration--;
            } else {
                clearInterval(mainTimerInterval);
                countdownElement.textContent = "Room(s) held for 00 min 00 sec";

                // Show Running Time Modal (timer paused)
                extendedText.textContent = `Time remaining to complete your booking: ${formatTime(extensionDuration)}`;
                const runningTimeModal = new bootstrap.Modal(document.getElementById('runningtimeModal'), {
                    backdrop: 'static',
                    keyboard: false
                });
                runningTimeModal.show();
            }
        }

        updateMainTimer();
        mainTimerInterval = setInterval(updateMainTimer, 1000);
    }

    // Call main timer on page load
    startMainTimer();

    // Start actual extended timer only when "Continue Booking" is clicked
    function continueBooking() {
        if (sessionExpired) {
            alert("Session expired. Please start over.");
            return;
        }

        // Hide modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('runningtimeModal'));
        if (modal) modal.hide();

        // Start extended timer
        startExtendedTimer(extensionDuration);
    }

    window.continueBooking = continueBooking;

    // Start Extended Timer (after continue)
    function startExtendedTimer(secondsLeft) {
        clearInterval(mainTimerInterval);
        clearInterval(extendedInterval);
        sessionExpired = false;

        function updateExtendedTime() {
            countdownElement.textContent = `Room(s) held for ${formatTime(secondsLeft)}`;

            if (secondsLeft > 0) {
                secondsLeft--;
            } else {
                clearInterval(extendedInterval);
                sessionExpired = true;

                const timeoutModal = new bootstrap.Modal(document.getElementById('timeoutModal'), {
                    backdrop: 'static',
                    keyboard: false
                });
                timeoutModal.show();
            }
        }

        updateExtendedTime();
        extendedInterval = setInterval(updateExtendedTime, 1000);
    }
}

// Bed Choise And Add Guset Modal : Outside Click None
const myModal = new bootstrap.Modal(document.getElementById('editroombed1Modal'), {
    backdrop: 'static',
    keyboard: false
});

// Special Request Modal : Outside Click None
const myModal2 = new bootstrap.Modal(document.getElementById('editroomspecialModal'), {
    backdrop: 'static',
    keyboard: false
});

// Apply Coupen Modal : Outside Click None
const myModal3 = new bootstrap.Modal(document.getElementById('applycouponModal'), {
    backdrop: 'static',
    keyboard: false
});


// Redirect Page On click LOGO
function redirectToRooms() {
    localStorage.removeItem("TotalRooms")
    localStorage.removeItem("TotalAdults")
    localStorage.removeItem("TotalChilds")
    localStorage.removeItem("BookedHotelCity")
    localStorage.removeItem("CheckInDate")
    localStorage.removeItem("CheckOutDate")
    localStorage.removeItem("roomdata")
    localStorage.removeItem("Room_Preference")
    localStorage.removeItem("totalNight")
    localStorage.removeItem("fullDateWithNights")
    localStorage.removeItem("formdata_name")
    localStorage.removeItem("formdata_Email")
    localStorage.removeItem("modalUserData")
    localStorage.removeItem("Discount")

    window.location.href = 'Rooms.html'

}


// *******************  Stay Information ***************************

function stayInformation() {

    let checkIn = localStorage.getItem("CheckInDate");
    let checkOut = localStorage.getItem("CheckOutDate");

    function formatDateWithDay(dateString) {
        if (!dateString) return '';
        let date = new Date(dateString);
        let options = { weekday: 'short', day: '2-digit', month: 'short' };
        return date.toLocaleDateString('en-GB', options).replace(',', '');
    }

    function calculateNights(start, end) {
        let startDate = new Date(start);
        let endDate = new Date(end);

        // Difference in milliseconds
        let diffMs = endDate - startDate;

        // Convert to nights (days)
        let nights = diffMs / (1000 * 60 * 60 * 24);
        return nights;
    }

    let formattedCheckIn = formatDateWithDay(checkIn);
    let formattedCheckOut = formatDateWithDay(checkOut);
    let numberOfNights = calculateNights(checkIn, checkOut);
    localStorage.setItem("totalNight", numberOfNights);

    // Total Night Stay 
    document.getElementById("TotalNight").innerHTML = `( ${numberOfNights} nights )`;

    // Booking Date 
    let BookedDate = formattedCheckIn + ' - ' + formattedCheckOut
    document.getElementById("BookingDate").innerHTML = BookedDate;

    //Date + total night
    let fullDateWithNights = ` ${BookedDate} ( ${numberOfNights} nights )`
    localStorage.setItem("fullDateWithNights", fullDateWithNights);


    // Total Rooms + Total Adults
    let totalRooms = localStorage.getItem("TotalRooms")
    let totalAdults = localStorage.getItem("TotalAdults")
    document.getElementById("roomsAndAdults").innerHTML = ` ${totalRooms} room , ${totalAdults} adults `

    // Room Type ( Only / with breakfast ) 
    let roomPref = localStorage.getItem("Room_Preference")
    // console.log("Prefrence  : " + roomPref)
    document.getElementById("roomChoise").innerHTML = roomPref

    // City 
    let city = localStorage.getItem("BookedHotelCity")
    document.getElementById("bookedHotelCity").innerHTML = city;


}

stayInformation()

// ***************** Apply Coupen ********************

let coupens = [];

async function applyCoupen() {
    try {
        const response = await fetch("http://localhost:3000/Coupens");
        coupens = await response.json();

        const container = document.getElementById("coupenData");
        container.innerHTML = ""; // Clear any existing coupons

        coupens.map((coupen, index) => {
            const data = `
                <div class="mb-form-check mb-2">
                    <input 
                        class="mb-form-check-input" 
                        type="radio" 
                        name="couponRadio" 
                        id="coupon${index}" 
                        value="${index}"
                    >
                    <label class="mb-form-check-label form-check-label" for="coupon${index}">
                        <span class="mb-new">${coupen.Heading}</span><br>
                        <span class="mb-get">${coupen.Description}</span><br>
                        <span class="mb-save">${coupen.saved}</span>
                    </label>
                </div>
            `;
            container.innerHTML += data;
        });

        // Input Value (Coupen Code) Fill When click radio Button
        const radioButtons = document.querySelectorAll('input[name="couponRadio"]');
        let lastChecked = null;

        radioButtons.forEach(radio => {
            radio.addEventListener('click', function () {
                if (lastChecked === this) {
                    this.checked = false;
                    lastChecked = null;
                    document.getElementById("coupenInput").value = "";
                    localStorage.removeItem("Discount");
                    let finalEl = document.getElementById("finalTotal");
                    console.log(finalEl.innerHTML)
                    // const finalTotal = finalEl.innerHTML;
                    if (finalEl) {
                        finalEl.innerHTML = `$${parseFloat(finalTotal)}`;
                    }
                    discount();
                    discountForPayandConfirm()

                } else {
                    lastChecked = this;
                    const selectedCoupon = coupens[this.value];
                    if (selectedCoupon) {
                        document.getElementById("coupenInput").value = selectedCoupon.Heading;
                    }
                }
            });
        });

        // Apply Button
        document.getElementById("applyCoupen").onclick = function (event) {
            event.preventDefault(); // Stop form submission if inside form

            const selected = document.querySelector('input[name="couponRadio"]:checked');

            if (selected) {
                const selectedIndex = parseInt(selected.value, 10);
                const selectedCoupon = coupens[selectedIndex];

                if (selectedCoupon) {

                    const discountAmount = selectedCoupon.Discount.replace(/\$/g, '');
                    let finalEl = document.getElementById("finalTotal");
                    console.log(finalEl.innerHTML)
                    // const finalTotal = finalEl.innerHTML;
                    if (finalEl) {
                        finalEl.innerHTML = `$${parseFloat(finalTotal) - parseFloat(discountAmount)}`;
                    }
                    localStorage.setItem("Discount", discountAmount);
                    console.log("Discount amount :::", discountAmount);
                    discount();
                    discountForPayandConfirm()
                }
            }
        };

        discount();

    } catch (error) {
        console.log("Error :: " + error);
    }
}
applyCoupen()



// *****************  Add Your Details *****************


// Additional information modal : submit ( data stored in localstorage) 
document.getElementById("saveModalAddDetails").addEventListener("click", function () {


    const code = document.getElementById("countryCode4").value;
    const tripRadio = document.querySelector("input[name='tripPurpose']:checked");
    const trip = tripRadio ? tripRadio.value : "";

    const modalData = {
        firstName: document.getElementById("mFirstName").value,
        lastName: document.getElementById("mLastName").value,
        Email: document.getElementById("mEmail").value,
        MobileNumber: document.getElementById("mMobileNo").value,
        CountryCode: code,
        TripPurpose: trip
    };

    localStorage.setItem("modalUserData", JSON.stringify(modalData));
    // fill data in main form
    fillMainFormFromModal();

});


// Modal data will be fillup in mainform if user fill the modal
function fillMainFormFromModal() {
    const data = JSON.parse(localStorage.getItem("modalUserData"));
    document.getElementById("addFirstName").value = data.firstName || "";
    document.getElementById("addlastName").value = data.lastName || "";
    document.getElementById("addEmail").value = data.Email || "";

}

// Main Form Data 
async function saveMainFormDetails() {
    try {
        const loggedEmail = localStorage.getItem("logedInUserMail");

        const response = await fetch("http://localhost:3000/createAccount");
        const accounts = await response.json();
        const user = accounts.find(acc => acc.Email_id === loggedEmail);

        const userId = user.id;
        const oldData = user.MyBooking || {};

        const modalData = JSON.parse(localStorage.getItem("modalUserData"));


        const finalData = {
            firstName: document.getElementById("addFirstName").value,
            lastName: document.getElementById("addlastName").value,
            Email: document.getElementById("addEmail").value,
            Country: document.getElementById("addCounty").value,
            Gender: document.querySelector("input[name='selectGender']:checked")?.value || modalData.Gender || "",
            TripPurpose: modalData.TripPurpose,
            CountryCode: modalData.CountryCode,
            MobileNumber: modalData.MobileNumber
        };

        const changes = {};
        for (let key in finalData) {
            if (finalData[key] !== oldData[key]) {
                changes[key] = finalData[key];
            }
        }

        if (Object.keys(changes).length > 0) {
            await fetch(`http://localhost:3000/createAccount/${userId}`, {
                method: "PATCH",
                body: JSON.stringify({ MyBooking: { ...oldData, ...changes } })
            });

        }

    } catch (error) {
        console.error("Main form update failed:", error);
    }
}

// Genrate Booking Id
function generateBookingId() {
    return `BKG${Math.floor(Math.random() * 1000)}`;
}

// validation for form and checkboxes
function checkFormValitde() {
    // Form Validation
    const form = document.querySelector("form");
    if (!form.checkValidity()) {
        form.reportValidity();
        return false;
    }

    // Checkbox validation for Privacy Policy and Terms and conditions
    const termsChecked = document.getElementById("termsCheckbox").checked;
    const privacyChecked = document.getElementById("privacyCheckbox").checked;

    if (!termsChecked || !privacyChecked) {
        alert("You must accept the Terms & Conditions and Privacy Policy.");
        return false;
    }

    return true;
}

//  Main Form  + Room data send to json server
async function addDetails(roomBooking, paymentMethod) {

    try {
        const loggedEmail = localStorage.getItem("logedInUserMail");
        const selectedGenderRadio = document.querySelector("input[name='selectGender']:checked");
        const Gender = selectedGenderRadio ? selectedGenderRadio.value : "";

        const firstName = document.getElementById("addFirstName").value;
        const lastName = document.getElementById("addlastName").value;
        const Email = document.getElementById("addEmail").value;
        const Country = document.getElementById("addCounty").value;
        const Date = localStorage.getItem("fullDateWithNights");

        const response = await fetch("http://localhost:3000/createAccount");
        const account_data = await response.json();
        const foundAccount = account_data.find(account => account.Email_id === loggedEmail);
        if (!foundAccount) {
            alert("User not found.");
            return false;
        }

        const userId = foundAccount.id;

        const userRes = await fetch(`http://localhost:3000/createAccount/${userId}`);
        const fullUserData = await userRes.json();
        const existingBookings = fullUserData.MyBooking || [];

        const modalData = JSON.parse(localStorage.getItem("modalUserData"));
        const totalPaid = document.getElementById("finalTotal").innerHTML;


        const newDetails = {
            Id: Math.floor(Math.random() * 10000),
            BookedDate: Date,
            BookingId: generateBookingId(),
            firstName,
            lastName,
            Email,
            Country,
            Gender,
            MobileNumber: modalData?.MobileNumber || "",
            CountryCode: modalData?.CountryCode || "",
            TripPurpose: modalData?.TripPurpose || "",
            TotalGuest: localStorage.getItem("TotalAdults"),
            TotalChild: localStorage.getItem("TotalChilds"),
            TotalPaid: totalPaid,
            PaymentMethod: paymentMethod,
            RoomsChoised: localStorage.getItem("Room_Preference"),
            Location: localStorage.getItem("BookedHotelCity"),
            TotalDays: localStorage.getItem("totalNight")
        };

        const newBooking = {
            Details: newDetails,
            RoomData: roomBooking || {}
        };

        const updatedBookings = [...existingBookings, newBooking];

        const patchResponse = await fetch(`http://localhost:3000/createAccount/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ MyBooking: updatedBookings })
        });

        if (!patchResponse.ok) {
            console.log("Failed to update user booking");
            return false;
        }

        localStorage.removeItem("TotalRooms")
        localStorage.removeItem("TotalAdults")
        localStorage.removeItem("TotalChilds")
        localStorage.removeItem("BookedHotelCity")
        localStorage.removeItem("CheckInDate")
        localStorage.removeItem("CheckOutDate")
        localStorage.removeItem("roomdata")
        localStorage.removeItem("Room_Preference")
        localStorage.removeItem("totalNight")
        localStorage.removeItem("fullDateWithNights")
        localStorage.removeItem("formdata_name")
        localStorage.removeItem("formdata_Email")
        localStorage.removeItem("modalUserData")
        localStorage.removeItem("Discount")

        return true;

    } catch (error) {
        console.log("Error in addDetails:", error);
        return false;
    }
}


//***** Main Form Data : Store in local storage **** 
function formData() {

    let firstName = document.getElementById("addFirstName").value
    let lastName = document.getElementById("addlastName").value
    let Email = document.getElementById("addEmail").value
    let fullName = firstName + " " + lastName;

    localStorage.setItem("formdata_name", fullName)
    localStorage.setItem("formdata_Email", Email)
}


// ********************** Room Choise    asdf ********************
let roomId = 0;
let selectBed = null;

function getRoomData() {
    return JSON.parse(localStorage.getItem("roomdata")) || [];
}

function saveRoomData(data) {
    localStorage.setItem("roomdata", JSON.stringify(data));
}

function bedPref() {
    const roomData = getRoomData();
    let data = roomData[roomId];
    let bedInfo = data.Bed_choise || [];

    // Auto-select first bed if none selected
    if (!data.selectBed && bedInfo.length > 0) {
        data.selectBed = bedInfo[0];
        saveRoomData(roomData);
    }

    selectBed = data.selectBed;
    let container = document.getElementById("roomOpt");
    container.innerHTML = '';

    bedInfo.forEach(bed => {
        const isSelected = data.selectBed && data.selectBed.Bed_Title === bed.Bed_Title;
        let bedDiv = document.createElement("div");
        bedDiv.className = `mb-twin-editroombed2 mt-1 ${isSelected ? 'mb-twin-active' : ''}`;
        bedDiv.onclick = () => {
            selectbedData(bed.Bed_Title, bed.Bed_Details, bed.Bed_icon);
            highlightSelectedBed(bedDiv);
        };
        bedDiv.innerHTML = `
      <img src="${bed.Bed_icon}" alt="Bed Image">
      <p class="mb-twin-beds-editro2">${bed.Bed_Title}</p>
      <p class="mb-non-smoke-editro2">${bed.Bed_Details}</p>
    `;
        container.appendChild(bedDiv);
    });

    document.getElementById("specialrequest").value = data.request || "";
}

function highlightSelectedBed(clickedElement) {
    const allBeds = document.querySelectorAll('.mb-twin-editroombed2');
    allBeds.forEach(bed => bed.classList.remove('mb-twin-active'));
    clickedElement.classList.add('mb-twin-active');
}

function selectbedData(title, details, icon) {
    selectBed = { Bed_Title: title, Bed_Details: details, Bed_icon: icon };
    const roomData = getRoomData();
    roomData[roomId].selectBed = selectBed;
    saveRoomData(roomData);
    renderSelectedBedSummary();
}

function addNewGuest() {
    const roomData = getRoomData();
    roomData[roomId].guest = roomData[roomId].guest || [];

    if (roomData[roomId].guest.length >= 3) {
        alert("You can't add more than 3 guests.");
        return;
    }

    roomData[roomId].guest.push({ firstName: '', lastName: '' });
    saveRoomData(roomData);
    renderGuests();
}

function renderGuests() {
    const container = document.getElementById("addguest");
    container.innerHTML = '';
    const roomData = getRoomData();
    const guests = roomData[roomId].guest || [];

    guests.forEach((g, index) => {
        const guestContainer = document.createElement("div");
        guestContainer.className = "mb-3";

        guestContainer.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <p class="mb-guest_2-editro">Guest ${index + 1}</p>
                <a href="#" class="text-danger fw-bold remove-btn">REMOVE</a>
            </div>
            <div class="d-flex gap-2">
                <div class="w-50">
                <label class="mb-fname mb-2">First Name</label>
                <input type="text" class="form-control" placeholder="First Name" value="${g.firstName || ''}">
                </div>
                <div class="w-50">
                <label class="mb-lname mb-2">Last Name</label>
                <input type="text" class="form-control" placeholder="Last Name" value="${g.lastName || ''}">
                </div>
            </div>
            `;

        const inputs = guestContainer.querySelectorAll("input");
        inputs[0].addEventListener("input", (e) => {
            guests[index].firstName = e.target.value;
            saveRoomData(roomData);
        });
        inputs[1].addEventListener("input", (e) => {
            guests[index].lastName = e.target.value;
            saveRoomData(roomData);
        });

        guestContainer.querySelector(".remove-btn").addEventListener("click", (e) => {
            e.preventDefault();
            guests.splice(index, 1);
            saveRoomData(roomData);
            renderGuests();
        });

        container.appendChild(guestContainer);
        updatePersonAndBedSummary();

    });
}

function setupRoomButtons() {
    const roomData = getRoomData();
    const roomButtonsContainer = document.getElementById("room-buttons");
    roomButtonsContainer.innerHTML = '';

    roomData.forEach((room, index) => {
        const btn = document.createElement("button");
        btn.textContent = `Room ${index + 1}`;
        btn.className = index === roomId ? "rp-active" : "";
        btn.onclick = () => {
            roomId = index;
            document.querySelectorAll("#room-buttons button").forEach(b => b.classList.remove("rp-active"));
            btn.classList.add("rp-active");
            bedPref();
            renderGuests();
            renderSelectedBedSummary();
            updatePersonAndBedSummary();
        };
        roomButtonsContainer.appendChild(btn);
    });
}

function editRoomById() {
    const roomData = getRoomData();
    const requestInput = document.getElementById("specialrequest");
    const requestValue = requestInput ? requestInput.value : "";

    roomData[roomId].request = requestValue;
    saveRoomData(roomData);

    alert(`Room ${roomId + 1} data saved successfully!`);
}

// This shows the current room's selected bed
function renderSelectedBedSummary() {
    const roomData = getRoomData();
    const summaryContainer = document.getElementById("selected-beds-summary");
    summaryContainer.innerHTML = '';

    const bed = roomData[roomId]?.selectBed;

    const summary = document.createElement("div");
    summary.className = "abc d-flex align-items-center mb-2";

    if (bed) {
        summary.innerHTML = `
      <img src="${bed.Bed_icon}" alt="Bed" class="me-2" style="width: 20px; height: 20px;">
      ${bed.Bed_Title} 
    `;
    } else {
        summary.textContent = `Room ${roomId + 1}: No bed selected`;
    }

    summaryContainer.appendChild(summary);
}

function renderGuestAndBedPerRoom() {
    const roomData = getRoomData();
    const summaryElements = document.querySelectorAll('.tPersonAndBeds');

    summaryElements.forEach((element, index) => {
        const room = roomData[index];
        if (!room) {
            element.textContent = '';
            return;
        }

        const bed = room.selectBed;
        const guestCount = (room.guest || []).length;
        const guestText = `${guestCount} adult${guestCount !== 1 ? 's' : ''}`;
        const bedText = bed ? `, ${bed.Bed_Title} selected` : ', No bed selected';

        element.innerHTML = `
      <img src="${bed?.Bed_icon || 'default-bed-icon.png'}" alt="Bed" style="width: 16px; height: 16px; margin-right: 5px;">
      ${guestText}${bedText}
    `;
    });
}

function updatePersonAndBedSummary() {
    const roomData = getRoomData();
    const data = roomData[roomId];
    if (!data) return;

    const guestCount = (data.guest || []).length;
    const bed = data.selectBed;
    const guestText = `${guestCount} adult${guestCount !== 1 ? 's' : ''}`;
    const bedText = bed ? bed.Bed_Title : "No bed selected";

    const summaryElement = document.getElementById("personAndAdults");
    if (summaryElement) {
        summaryElement.textContent = `${guestText}, ${bedText}`;
    }
}

function initializeDefaultBeds() {
    const roomData = getRoomData();

    roomData.forEach((room, index) => {
        if (!room.selectBed && Array.isArray(room.Bed_choise) && room.Bed_choise.length > 0) {
            room.selectBed = room.Bed_choise[0];
        }
    });

    saveRoomData(roomData);
}

initializeDefaultBeds();
setupRoomButtons();
bedPref();
renderGuests();
renderSelectedBedSummary();
updatePersonAndBedSummary();


// ********** Send the Room data **********

// async function sendAllCurrentRoomData() {
//     const loggedEmail = localStorage.getItem("logedInUserMail");
//     const response = await fetch("http://localhost:3000/createAccount");
//     const account_data = await response.json();
//     const foundAccount = account_data.find(account => account.Email_id === loggedEmail);

//     if (!foundAccount) {    
//         console.log("User not found for room data.");
//         return null;
//     }

//     const roomData = getRoomData();
//     const storedRooms = JSON.parse(localStorage.getItem("roomdata"));

//     const newBooking = {};

//     roomData.forEach((room, index) => {
//         if (room.selectBed) {
//             const hotelId = storedRooms[index]?.Id || "Unknown";
//             newBooking[`Room${index + 1}`] = {
//                 HotelId: hotelId,
//                 Bed: room.selectBed,
//                 SpecialRequest: room.request || "",
//                 Guests: room.guest || []
//             };
//         }
//     });

//     return newBooking;
// }


async function sendAllCurrentRoomData() {
    const loggedEmail = localStorage.getItem("logedInUserMail");
    const response = await fetch("http://localhost:3000/createAccount");
    const account_data = await response.json();

    const foundAccount = account_data.find(account => account.Email_id === loggedEmail);
    if (!foundAccount) {
        console.log("User not found for room data.");
        return null;
    }

    const roomData = getRoomData();
    const newBooking = {};

    roomData.forEach((room, index) => {
        const bed = room.selectBed;
        const guests = room.guest || [];
        const specialRequest = room.request || "";
        const hotelId = room.Id || null;

        // Only send rooms with valid bed and hotel ID
        if (bed && hotelId) {
            newBooking[`Room${index + 1}`] = {
                HotelId: hotelId,
                Bed: bed,
                SpecialRequest: specialRequest,
                Guests: guests
            };
        }
    });

    return newBooking;
}

// ****************** Price Section *******************

async function fetchTotalRooms() {
    try {

        let raw = localStorage.getItem("roomdata");
        let data = JSON.parse(raw);
        let container = document.getElementById("room-info");

        let Room_Preference = localStorage.getItem("Room_Preference");
        let Day = localStorage.getItem("totalNight")

        if (Array.isArray(data)) {
            let getData = data.map((room, index) => {
                let roomOnlyPrice = parseFloat(room.Room_Only_Price.replace("$", ""));
                let roomWithBreakfast = parseFloat(room.Room_With_Breakfast.replace("$", ""));

                let totalPrice;
                if (Room_Preference === "Room with Breakfast") {
                    totalPrice = (roomOnlyPrice + roomWithBreakfast) * Day;
                } else {
                    totalPrice = (roomOnlyPrice) * Day;
                }

                return `
                    <div class="rp-room-no-price">
                        <h6>Room ${index + 1}</h6>
                        <h6>$${totalPrice}</h6>
                    </div>
                `;
            }).join("");

            container.innerHTML += getData;
        }

    } catch (error) {
        console.error("Error to fetched :: " + error);
    }
}

fetchTotalRooms();

// Tax Count 
function taxes() {

    let EstTaxrRaw = document.getElementById("EstimatedTaxes").innerHTML
    let EstTax = parseFloat(EstTaxrRaw.replace("$", ""));
    let EstFeesRaw = document.getElementById("EstimatedFees").innerHTML
    let EstFees = parseFloat(EstFeesRaw.replace("$", ""));

    let totalTaxes = EstTax + EstFees;
    document.getElementById("totalTax").innerHTML = `$${totalTaxes}`

}
taxes()


function discount() {

    let discount = localStorage.getItem("Discount")
    let fillDiscount = document.getElementById("discountAmt")
    fillDiscount.innerHTML = `$${discount}`;

    let abc = document.getElementById("coupenApplied")

    if (discount === null) {
        abc.style.display = "none";
    } else {
        abc.style.display = "block";
    }

}

// Calculate total price
let finalTotal = 0;
function calculateTotal() {
    try {
        // all room prices
        let roomElements = document.querySelectorAll(".rp-room-no-price h6:nth-child(2)");
        let totalRoomPrice = 0;

        roomElements.forEach(el => {
            let priceText = el.textContent.replace("$", "");
            let price = parseFloat(priceText);
            console.log(`Room Price Text: ${el.textContent}, Parsed: ${price}`);
            totalRoomPrice += isNaN(price) ? 0 : price;
        });


        // taxes
        let taxText = document.getElementById("totalTax")?.innerHTML || "$0";
        let totalTaxes = parseFloat(taxText.replace("$", ""));

        // discount
        let discountRaw = localStorage.getItem("Discount") || "$0";
        let discount = parseFloat(discountRaw.replace("$", ""));

        // Calculate final total
        finalTotal = totalRoomPrice + totalTaxes - discount;

        let finalEl = document.getElementById("finalTotal");
        finalEl.innerHTML = `$${finalTotal}`;


    } catch (error) {
        console.error("Error calculating total:", error);
    }
}

calculateTotal();

// ****************** Make Payment Button ********************
// nav and tabs conditions
let yourBookingTab, yourDetailsTab, payConfirmTab, allTabs;
document.addEventListener("DOMContentLoaded", function () {
    yourBookingTab = document.getElementById("Your-booking-tab");
    yourDetailsTab = document.getElementById("Your-Details-tab");
    payConfirmTab = document.getElementById("Pay-Confirm-tab");

    allTabs = [yourBookingTab, yourDetailsTab, payConfirmTab];

    // Always disable "Your Booking"
    yourBookingTab.disabled = true;

    // Disable "Pay and Confirm" initially
    payConfirmTab.disabled = true;

    // Remove tab click behavior
    allTabs.forEach(tab => {
        tab.addEventListener("click", function (e) {
            e.preventDefault();
        });
    });

    // Make sure the correct tab is shown initially
    new bootstrap.Tab(yourDetailsTab).show();
    yourDetailsTab.classList.add("rp-stage-active");

});


// Payment Button
function setupPaymentOptionListeners() {
    const radios = document.getElementsByName('paymentOption');
    const paymentButton = document.getElementById('paymentButton');

    updateButtonLabel();

    radios.forEach(radio => {
        radio.addEventListener('change', updateButtonLabel);
    });

    // Function to update button 
    function updateButtonLabel() {
        const selected = document.querySelector('input[name="paymentOption"]:checked');

        if (selected.value === 'guarantee') {
            paymentButton.textContent = 'Make Payment';
            runAndNavigate();
        } else {
            paymentButton.textContent = 'Book Now';
            runAndNavigate();
        }
    }
}

setupPaymentOptionListeners();


async function runAndNavigate() {

    let buttonLabel = document.getElementById("paymentButton").innerHTML

    if (buttonLabel === "Make Payment") {
        // Make Payment - Button 
        // console.log("make payment ::", buttonLabel);

        document.getElementById("paymentButton").onclick = function () {

            let formValidate = checkFormValitde();

            if (formValidate) {

                // Disable earlier tabs
                yourDetailsTab.disabled = true;

                // Enable and show "Pay and Confirm"
                payConfirmTab.disabled = false;

                // Show Pay and Confirm tab programmatically
                new bootstrap.Tab(payConfirmTab).show();

                // Update active class
                allTabs.forEach(tab => tab.classList.remove("rp-stage-active"));
                payConfirmTab.classList.add("rp-stage-active");

                getDataForPayAndConfirm()
                getPayAmount()

            }

        }

    }
    else {

        // Book Now - Buttton 
        console.log("book now ::", buttonLabel);

        // Submit room data and details 
        document.getElementById("paymentButton").onclick = async function () {
            // alert("Hotel Booked")'
            let formValidate = checkFormValitde()

            if (formValidate) {
                submitBookedDateInHotel()

                let paymentMethod = "On Arrival"
                const roomBooking = await sendAllCurrentRoomData();
                await addDetails(roomBooking, paymentMethod);
                window.location.href = 'R-Payement_done.html';

                bookingDetails()
                getDataForPayAndConfirm()
                getPayAmount()
            }
        }
    }

}

// *** Pay and confirm :: Pay Button  ***
// async function payNow() {
//     submitBookedDateInHotel();
//     const roomBooking = await sendAllCurrentRoomData();
//     let paymentMethod = "Online Pay"
//     await addDetails(roomBooking, paymentMethod);
//     window.location.href = 'R-Payement_done.html';
// }


async function payNow() {
  const cardInput = document.getElementById('cardNumber');
  const expiryInput = document.getElementById('expiryDate');
  const cvvInput = document.getElementById('cvv');
  const nameInput = document.getElementById('cardHolder');

  const isCardValid = validateCardNumber(cardInput);
  const isExpiryValid = validateExpiryDate(expiryInput);
  const isCVVValid = validateCVV(cvvInput);
  const isNameValid = validateCardHolderName(nameInput);

  if (!isCardValid || !isExpiryValid || !isCVVValid || !isNameValid) {
    return; 
  }

  // All inputs are valid Then it will proceed
  submitBookedDateInHotel();
  const roomBooking = await sendAllCurrentRoomData();
  let paymentMethod = "Online Pay";
  await addDetails(roomBooking, paymentMethod);
  window.location.href = 'R-Payement_done.html';
}


// Send Booked Date In Json server for Hotel API 
function submitBookedDateInHotel() {
    const storedRooms = JSON.parse(localStorage.getItem("roomdata"));
    const roomIds = [...new Set(storedRooms.map(room => room.Id))];
    console.log("Hotel Id :: ", roomIds);

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    }

    let InDate = localStorage.getItem("CheckInDate");
    let OutDate = localStorage.getItem("CheckOutDate");

    let checkInDate = formatDate(InDate);
    let checkOutDate = formatDate(OutDate);

    const bookingData = {
        checkIn: checkInDate,
        checkOut: checkOutDate
    };

    roomIds.forEach(roomId => {
        (async () => {
            try {
                const response = await fetch(`http://localhost:3000/Hotels/${roomId}`);
                const hotelData = await response.json();
                const sendNewBookingDate = [...(hotelData.Booked_Date || []), bookingData];

                const patchResponse = await fetch(`http://localhost:3000/Hotels/${roomId}`, {
                    method: "PATCH",
                    body: JSON.stringify({ Booked_Date: sendNewBookingDate })
                });

                if (!patchResponse.ok) {
                    console.log("Failed to send data ::  patchResponse");
                }



            } catch (error) {
                console.log(`Error in send data on particular hotel id ::`, error);
            }
        })();
    });
}



// ************************************************************
// ******************** Pay and Confirm tabs ****************
// ************************************************************

// get Data Of Users of Booking Details
function getDataForPayAndConfirm() {

    let formdataName = localStorage.getItem("formdata_name");
    document.getElementById("bookedName").innerHTML = formdataName;


    let formdataEmail = localStorage.getItem("formdata_Email");
    document.getElementById("bookedEmail").innerHTML = formdataEmail;

    let modalData = JSON.parse(localStorage.getItem("modalUserData"));
    if (modalData) {
        document.getElementById("bookedMoNo").innerHTML = modalData.CountryCode + " " + modalData.MobileNumber;
    }

}


// ********* Price Section :: pay and confirm ************
async function fetchTotalRoomsForPay() {
    try {

        let raw = localStorage.getItem("roomdata");
        let data = JSON.parse(raw);
        let container = document.getElementById("room-info2");

        let Room_Preference = localStorage.getItem("Room_Preference");
        let Day = localStorage.getItem("totalNight")

        if (Array.isArray(data)) {
            let getData = data.map((room, index) => {
                let roomOnlyPrice = parseFloat(room.Room_Only_Price.replace("$", ""));
                let roomWithBreakfast = parseFloat(room.Room_With_Breakfast.replace("$", ""));

                let totalPrice;
                if (Room_Preference === "Room with Breakfast") {
                    totalPrice = (roomOnlyPrice + roomWithBreakfast) * Day;
                } else {
                    totalPrice = (roomOnlyPrice) * Day;
                }

                return `
                    <div class="rp-room-no-price2">
                        <h6>Room ${index + 1}</h6>
                        <h6>$${totalPrice}</h6>
                    </div>
                `;
            }).join("");

            container.innerHTML += getData;
        }

    } catch (error) {
        console.error("Error to fetched :: " + error);
    }
}

fetchTotalRoomsForPay();

// Tax
function taxForPayandConfirm() {

    let EstTaxrRaw = document.getElementById("estTax").innerHTML
    let EstTax = parseFloat(EstTaxrRaw.replace("$", ""));
    let EstFeesRaw = document.getElementById("estFees").innerHTML
    let EstFees = parseFloat(EstFeesRaw.replace("$", ""));

    let totalTaxes = EstTax + EstFees;
    document.getElementById("totalTaxforPay").innerHTML = `$${totalTaxes}`

}
taxForPayandConfirm()

// Discount
function discountForPayandConfirm() {

    let discount = localStorage.getItem("Discount")
    let fillDiscountforPay = document.getElementById("fillDiscountforPay")
    fillDiscountforPay.innerHTML = `$${discount}`;

    let discountTagShow = document.getElementById("discountForPay")

    if (discount === null) {
        discountTagShow.style.display = "none";
    } else {
        discountTagShow.style.display = "flex";
    }
}
discountForPayandConfirm()

// Total Payamount
function getPayAmount() {
    let PayAmount = document.getElementById("PayAmount")
    let totalAmt = document.getElementById("finalTotal").innerHTML
    PayAmount.innerHTML = totalAmt

    // Pay Button (Amount Store)
    let payBtn = document.getElementById("payNow")
    payBtn.innerHTML = ` Pay ${totalAmt} `;
}
getPayAmount()





