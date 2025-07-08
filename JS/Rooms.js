// ******** For Locations Popup - closes on any click *********
function toggleCityPopup(event) {
  event.stopPropagation();

  const widget = event.currentTarget;
  const popup = widget.querySelector(".rp-city-popup-main");
  const icon = widget.querySelector("i");

  const isOpen = popup.style.display === "block";
  if (isOpen) {
    closePopup();
  } else {
    openPopup();
  }

  function openPopup() {
    popup.style.display = "block";
    icon.classList.add("fa-angle-up");
    icon.classList.remove("fa-angle-down");

    document.addEventListener("click", outsideClickListener);
  }

  function closePopup() {
    popup.style.display = "none";
    icon.classList.remove("fa-angle-up");
    icon.classList.add("fa-angle-down");

    document.removeEventListener("click", outsideClickListener);
  }

  // Close if we can click outside / in popup click
  function outsideClickListener(e) {
    closePopup();
  }

}

// ******* For Roooms & Gusets Popup **********
function toggleRoomsGuestPopup(event) {
  event.stopPropagation();

  const widget = event.currentTarget;
  const popup = document.querySelector(".rp-person-popup-main");
  const icon = widget.querySelector("i");

  const isOpen = popup.style.display === "block";
  if (isOpen) {
    closePopup();
  } else {
    openPopup();
  }

  function openPopup() {
    popup.style.display = "block";
    icon.classList.add("fa-angle-up");
    icon.classList.remove("fa-angle-down");

    popup.addEventListener("click", stopPopupClose);

    document.addEventListener("click", outsideClickListener);
  }

  function closePopup() {
    popup.style.display = "none";
    icon.classList.remove("fa-angle-up");
    icon.classList.add("fa-angle-down");

    popup.removeEventListener("click", stopPopupClose);
    document.removeEventListener("click", outsideClickListener);
  }

  function stopPopupClose(e) {
    e.stopPropagation();
  }

  function outsideClickListener(e) {
    if (
      !e.target.closest(".rp-person-popup-main") &&
      !e.target.closest(".rp-search-widget4")
    ) {
      closePopup();
    }
  }

}

let selectedCheckInDate = null;
let selectedCheckOutDate = null;

// ******* Checkin Poopup *********
const checkinWidget = document.getElementById('rp-checkin-widget');
const dateCheckInInput = document.getElementById('rp-native-date-input');
const valueCheckInDisplay = document.getElementById('rp-checkin-value');

// Trigger calendar on click
checkinWidget.addEventListener('click', () => {
  if (dateCheckInInput.showPicker) {
    dateCheckInInput.showPicker();
  } else {
    dateCheckInInput.focus();
    dateCheckInInput.click();
  }
});

dateCheckInInput.addEventListener('change', () => {
  const date = new Date(dateCheckInInput.value);

  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit'
  }).replace(/ /g, ' ');

  valueCheckInDisplay.textContent = formattedDate;
  selectedCheckInDate = formattedDate;

  const minCheckoutDate = new Date(date);
  minCheckoutDate.setDate(minCheckoutDate.getDate() + 1);

  const minISODate = minCheckoutDate.toISOString().split('T')[0];
  dateCheckOutInput.min = minISODate;

  if (new Date(dateCheckOutInput.value) <= date) {
    dateCheckOutInput.value = '';
    valueCheckOutDisplay.textContent = 'Select Date';
    selectedCheckOutDate = null;
  }
});

// -------------- 



// ********** CheckOut  Poopup *********** 
const checkOutWidget = document.getElementById('rp-checkout-widget');
const dateCheckOutInput = document.getElementById('rp-native-out-date-input');
const valueCheckOutDisplay = document.getElementById('rp-checkout-value');

// Trigger calendar on click
checkOutWidget.addEventListener('click', () => {
  if (dateCheckOutInput.showPicker) {
    dateCheckOutInput.showPicker();
  } else {
    dateCheckOutInput.focus();
    dateCheckOutInput.click();
  }
});

dateCheckOutInput.addEventListener('change', () => {
  const date = new Date(dateCheckOutInput.value);
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit'
  }).replace(/ /g, ' ');

  valueCheckOutDisplay.textContent = formattedDate;
  selectedCheckOutDate = formattedDate;

  // Call selectDate with updated check-out date
  // selectDate();
});
// ----------


// ********************

// option select and unselect in choise of rooms
hotelCardOpt = () => {
  const buttons = document.querySelectorAll('.rp-card-option-button');

  buttons.forEach((button) => {
    const radio = button.querySelector('.rp-rooms-radio');

    button.addEventListener('click', (e) => {
      e.preventDefault();

      if (radio.checked) {
        radio.checked = false;
        button.classList.remove('rp-card-option-button-active');
      } else {
        buttons.forEach((btn) => {
          btn.querySelector('.rp-rooms-radio').checked = false;
          btn.classList.remove('rp-card-option-button-active');
        });

        radio.checked = true;
        button.classList.add('rp-card-option-button-active');
      }
    });
  });
}
hotelCardOpt()


// ************

// === GLOBAL VALUES ===
let roomsValue = 1;
let adultsValue = 1;
let childrenValue = 0;

// === UPDATE DISPLAY ===
function updateDisplay() {
  document.getElementById("valueRooms").innerHTML = roomsValue;
  document.getElementById("valueAdults").innerHTML = adultsValue;
  document.getElementById("valueChild").innerHTML = childrenValue;

  totalRoom(); // Always keep localStorage & display in sync
}

// === ROOMS ===
function roomsval() {
  let minusBtn = document.getElementById("roomsMinusBtn");
  let plusBtn = document.getElementById("roomsPlusBtn");

  minusBtn.onclick = () => {
    if (roomsValue > 1) {
      roomsValue--;
      adjustAdultsAndChildrenLimits();
      updateDisplay();
    }
  };

  plusBtn.onclick = () => {
    if (roomsValue < 3) {
      roomsValue++;
      adjustAdultsAndChildrenLimits();
      updateDisplay();
    }
  };
}

// === ADJUST LIMITS WHEN ROOMS CHANGE ===
function adjustAdultsAndChildrenLimits() {
  const maxAdults = roomsValue * 3;
  const maxChildren = roomsValue * 3;

  if (adultsValue > maxAdults) adultsValue = maxAdults;
  if (childrenValue > maxChildren) childrenValue = maxChildren;

  if (adultsValue < 1) adultsValue = 1;
}

// === ADULTS ===
function adultsVal() {
  let minAdults = document.getElementById("minusAdults");
  let addAdults = document.getElementById("plusAdults");

  minAdults.onclick = () => {
    if (adultsValue > 1) {
      adultsValue--;
      updateDisplay();
    }
  };

  addAdults.onclick = () => {
    let maxAdults = roomsValue * 3;
    if (adultsValue < maxAdults) {
      adultsValue++;
      updateDisplay();
    }
  };
}

// === CHILDREN ===
function childVal() {
  let minChild = document.getElementById("minusChild");
  let addChild = document.getElementById("plusChild");

  minChild.onclick = () => {
    if (childrenValue > 0) {
      childrenValue--;
      updateDisplay();
    }
  };

  addChild.onclick = () => {
    let maxChildren = roomsValue * 3;
    if (childrenValue < maxChildren) {
      childrenValue++;
      updateDisplay();
    }
  };
}

// === STORE IN LOCALSTORAGE & SHOW IN SEARCHBAR ===
function totalRoom() {
  // Show selected Rooms
  document.getElementById("roomSelected").innerHTML = roomsValue;
  localStorage.setItem("TotalRooms", roomsValue);

  // Show selected Adults
  document.getElementById("adultsSelected").innerHTML = adultsValue;
  localStorage.setItem("TotalAdults", adultsValue);

  // Store Children too
  localStorage.setItem("TotalChilds", childrenValue);
}

// === INIT ===
roomsval();
adultsVal();
childVal();
updateDisplay();



// City Print On Seachbar
getCityPrint = () => {

  const allCity = document.querySelectorAll('#city-container h5');

  allCity.forEach(city => {
    city.addEventListener('click', function () {

      const cityName = this.innerHTML;

      document.getElementById("cityPrint").innerHTML = cityName;
      // update city name for rooms
      // fetchRooms()
    });
  });
}
getCityPrint()

// Diable Date Selction From today 
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(input => {
    input.min = today;
  });
});

// **************************************
// Display LoggedIn UserName On Header 
window.onload = function () {
  const userMail = localStorage.getItem("logedInUserMail");
  const profileTitles = document.querySelectorAll(".LoggedIn");

  if (userMail && profileTitles.length) {
    async function getUserName() {
      const response = await fetch("http://localhost:3000/createAccount");
      const user_data = await response.json();

      const userMailId = user_data.find(name => name.Email_id == userMail);
      let userName = userMailId?.FullName || "Profile";

      // console.log("UserName :::: " + userName);

      profileTitles.forEach(el => {
        el.innerHTML = userName;
        el.removeAttribute("data-bs-toggle");
        el.removeAttribute("data-bs-target");

        el.onclick = function (e) {
          e.preventDefault();
          window.location.href = "Profile.html";
        };
      });
    }

    getUserName();
  }
};

// Card : BookNow Button Not Work If Usernot Log In 
function userLogOrNot() {
  let userLogged = localStorage.getItem("logedInUserMail")

  if (!userLogged) {
    document.querySelectorAll(".rp-card-book-button").forEach(button => {
      button.removeAttribute("onclick");
      button.setAttribute("data-bs-toggle", "modal");
      button.setAttribute("data-bs-target", "#signinModal");
    });
  } else {
    console.log("User Logged In")
  }

}


//  Filter : Print Selected checkbox 

// ***************************************************************

// ***************************************************************

// Global variables
let fullFilteredHotels = []; // This needs to be populated with hotel data
let currentFilteredHotels = []; // Track currently filtered hotels

// APPLY button clicked ( Milan 09-06 Filter Apply Combined Filter )
document.querySelector('.mb-apply').addEventListener('click', function () {
  const selectedCheckboxes = document.querySelectorAll('#Filters input[type="checkbox"]:checked');
  const selectedCount = selectedCheckboxes.length;

  // Show count only on apply
  document.getElementById("filteredItemResults").innerText = selectedCount > 0 ? `( ${selectedCount} )` : "";

  // Apply combined filter instead of separate filters
  applyCombinedFilter();

});


// CLEAR ALL button clicked
const defaultMinValue = 50;
const defaultMaxValue = 1000;

document.querySelector(".mb-cleall").addEventListener("click", function () {

  // Clear all checkboxes
  document.querySelectorAll('#Filters input[type="checkbox"]').forEach(cb => cb.checked = false);

  // Reset slider values
  minSlider.value = defaultMinValue;
  maxSlider.value = defaultMaxValue;

  // Update price text and slider track visually
  updateTrack();

  // Reset hotel list
  renderHotelCards(fullFilteredHotels);

  // Clear filter results count
  document.getElementById("filteredItemResults").innerHTML = "";

});


document.getElementById("searchButton").addEventListener("click", fetchRooms);


document.querySelectorAll('#city-container h5').forEach(city => {
  city.addEventListener('click', () => {
    const cityName = city.innerText.trim();
    document.getElementById('cityPrint').innerText = cityName;
  });
});

let rooms = 1
const selectRoom = [];

// Room Selection Display 
function roomSelections() {
  rooms = parseInt(document.getElementById("roomSelected").innerText.trim());
  const roomButtons = document.querySelectorAll('.rp-room-selection button');

  roomButtons.forEach((button, index) => {
    if (rooms === 1) {
      button.style.display = 'none';
    } else {
      if (index < rooms) {
        button.style.display = 'inline-block';
      } else {
        button.style.display = 'none';
      }
    }
    roomButtons.forEach(btn => btn.classList.remove('rp-active'));
  });
  roomButtons[selectRoom.length].classList.add('rp-active');
}


function selectRoomData(hotel) {
  console.log(hotel);
  if (hotel) {
    selectRoom.push(hotel);
    if (selectRoom.length != rooms)
      roomSelections();
    console.log(selectRoom.length, rooms - 1);
    if (selectRoom.length == rooms - 1) {
      var btn = document.getElementsByClassName('rp-card-book-button');
      for (i = 0; i < btn.length; i++) {
        btn[i].innerHTML = 'Book Now';
      }
    }
    else if (selectRoom.length >= rooms) {
      localStorage.setItem('roomdata', [JSON.stringify(selectRoom)])
      window.location.href = 'R-Payments.html'
    }
    else {
      var btn = document.getElementsByClassName('rp-card-book-button');
      for (i = 0; i < btn.length; i++) {
        btn[i].innerHTML = 'Select Room';
      }
    }
    if (selectRoom.length > 0) {
      var selectbtn = document.getElementsByClassName('rp-card-option-button');
      for (i = 0; i < selectbtn.length; i++) {
        selectbtn[i].classList.add('d-none');
      }
    }
  }
  else {
    if (selectRoom.length == rooms - 1) {
      var btn = document.getElementsByClassName('rp-card-book-button');
      for (i = 0; i < btn.length; i++) {
        btn[i].innerHTML = 'Book Now';
      }
    }
    else {
      var btn = document.getElementsByClassName('rp-card-book-button');
      for (i = 0; i < btn.length; i++) {
        btn[i].innerHTML = 'Select Room';
      }
    }
  }

  // Room Option : Room Only / Room With Breakfast 
  const selectedRadio = document.querySelector(`input[name="option_${hotel.Id}"]:checked`);

  if (!selectedRadio) {
    // alert("Default Selected : Room Only");
    return;
  }

  const selectedRoomOption = selectedRadio.value;

  // console.log("Booking Hotel:", hotel.Hotel_Name);

  // console.log("Selected Room Option:", selectedRoomOption);
  localStorage.setItem("Room_Preference", selectedRoomOption)

}

roomSelections()


// _____________________________________________



// Rooms Show On Searches 
async function fetchRooms() {
  try {
    const selectedCity = document.getElementById("cityPrint").innerText.trim();
    localStorage.setItem("BookedHotelCity", selectedCity);
    const checkInElem = document.getElementById("rp-native-date-input");
    const checkOutElem = document.getElementById("rp-native-out-date-input");

    if (!checkInElem || !checkOutElem) {
      console.error("Check-in or Check-out input element not found");
      return;
    }

    const selectedCheckInDate = checkInElem.value;
    const selectedCheckOutDate = checkOutElem.value;


    if (!selectedCity || !selectedCheckInDate || !selectedCheckOutDate) {
      alert("Please select a city, check-in and check-out dates.");
      return;
    }

    // Helper function to parse and normalize dates
    function parseDate(dateString) {
      const date = dateString.includes('-') && dateString.length === 10
        ? new Date(dateString + 'T00:00:00')
        : new Date(dateString);
      date.setHours(0, 0, 0, 0); // Normalize to midnight
      return date;
    }

    const selectedCheckIn = parseDate(selectedCheckInDate);
    const selectedCheckOut = parseDate(selectedCheckOutDate);


    localStorage.setItem("CheckInDate", selectedCheckIn)
    localStorage.setItem("CheckOutDate", selectedCheckOut)



    console.log('Selected Check-in:', selectedCheckIn);
    console.log('Selected Check-out:', selectedCheckOut);

    const response = await fetch("http://localhost:3000/Hotels");
    const hotels = await response.json();

    const filteredHotels = hotels.filter(hotel => {
      if (hotel.City !== selectedCity) return false;

      const bookings = hotel.Booked_Date;
      if (!Array.isArray(bookings)) return true;

      const hasConflict = bookings.some(booked => {
        const bookedCheckIn = parseDate(booked.checkIn);
        const bookedCheckOut = parseDate(booked.checkOut);


        const isSameDayBooking = bookedCheckIn.getTime() === bookedCheckOut.getTime();

        let conflict;

        if (isSameDayBooking) {
          // Conflict if selected range includes that exact date
          conflict =
            selectedCheckIn.getTime() <= bookedCheckIn.getTime() &&
            selectedCheckOut.getTime() >= bookedCheckOut.getTime();
        } else {
          // Normal overlap check
          conflict = selectedCheckIn < bookedCheckOut && selectedCheckOut > bookedCheckIn;
        }


        return conflict;
      });

      return !hasConflict;
    });

    // Store the filtered hotels globally for filter operations
    fullFilteredHotels = filteredHotels;
    currentFilteredHotels = [...filteredHotels];

    const container = document.getElementById("hotelContainer");
    container.innerHTML = "";

    if (filteredHotels.length > 0) {
      filteredHotels.map(hotel => {
        const hotelCard = `
            <div class="row rp-card-main mx-0 mt-3">
              <div class="col-lg-4 rp-card-left">
                <img src="${hotel.Rooms_Image}" alt="Hotel">
                <div class="rp-card-badge">
                  <div class="rp-card-badge-content">
                    <img src="${hotel.Badges_icon}" alt="Popular">
                    <span>${hotel.Badges}</span>
                  </div>
                </div>
              </div> 

              <div class="col-lg-8 rp-card-right">
                <div class="rp-card-heading d-flex justify-content-between align-items-center">
                  <h5>${hotel.Hotel_Name}</h5>
                  <p>${hotel.Room_Only_Price} <span>/night</span></p>
                </div>

                <div class="rp-card-info">${hotel.Description}</div>

                <div class="rp-room-facilities">
                  <div class="rp-card-services">
                    <img src="${hotel.Wifi_icon}" alt="wifi_icon"> <span>${hotel.Wifi_text}</span>
                  </div>
                  <div class="rp-card-services">
                    <img src="${hotel.Person_icon}" alt="Guest_icon"> <span>${hotel.Person_Total}</span>
                  </div>
                  <div class="rp-card-services">
                    <img src="${hotel.Ac_icon}" alt="Ac_icon"> <span>${hotel.Ac_text}</span>
                  </div>
                </div>

                <div class="rp-card-view-details">
                  <span class="view-details-btn" data-id="${hotel.Id}" data-bs-toggle="modal" data-bs-target="#viewdetailsModal" onclick="viewDetails(this)">View Details</span>
                </div>

                <div class="rp-card-all-btn my-3">
                  <div class="rp-card-offer-btn">
                    <button class="rp-card-option-button">
                      <input type="radio" class="rp-rooms-radio" value="Room Only" name="option_${hotel.Id}">
                      <div class="rp-card-option-content">
                        <div class="rp-card-option-title">Room Only</div>
                        <div class="rp-card-option-price">${hotel.Room_Only_Price} /night</div>
                      </div>
                    </button>

                    <button class="rp-card-option-button">
                      <input type="radio" class="rp-rooms-radio" value="Room with Breakfast" name="option_${hotel.Id}">
                      <div class="rp-card-option-content">
                        <div class="rp-card-option-title">Room with Breakfast</div>
                        <div class="rp-card-option-price">${hotel.Room_With_Breakfast}</div>
                      </div>
                    </button>
                  </div>

                  <button class="rp-card-book-button"  onclick='selectRoomData(${JSON.stringify(hotel)})'></button>
                </div>
              </div>
            </div>`;

        container.innerHTML += hotelCard;
      });
    } else {
      container.innerHTML = `
          <div class="container">
            <div class="rp-NoRoomsFound">
              <p>You searched for <span> "${selectedCity}"</span> </p>
              <img src="./IMAGE/NoRoomsFund.png" alt="Search Icon">
              <p>We couldn't find any bookings matching your search.</p>
              <p>Please Modifying your filters.</p>
            </div>
          </div>
        `;
    }

    hotelCardOpt();
    userLogOrNot();
    roomSelections();
    selectRoomData();

  } catch (error) {
    console.error("Error fetching rooms:", error);
  }
}


// Render hotels cards
function renderHotelCards(hotelsArray) {
  const container = document.getElementById("hotelContainer");
  container.innerHTML = "";

  if (hotelsArray.length > 0) {
    hotelsArray.forEach(hotel => {
      const hotelCard = `
        <div class="row rp-card-main mx-0 mt-3">
          <div class="col-lg-4 rp-card-left">
            <img src="${hotel.Rooms_Image}" alt="Hotel">
            <div class="rp-card-badge">
              <div class="rp-card-badge-content">
                <img src="${hotel.Badges_icon}" alt="Popular">
                <span>${hotel.Badges}</span>
              </div>
            </div>
          </div>

          <div class="col-lg-8 rp-card-right">
            <div class="rp-card-heading d-flex justify-content-between align-items-center">
              <h5>${hotel.Hotel_Name}</h5>
              <p>${hotel.Room_Only_Price} <span>/night</span></p>
            </div>

            <div class="rp-card-info">${hotel.Description}</div>

            <div class="rp-room-facilities">
              <div class="rp-card-services">
                <img src="${hotel.Wifi_icon}" alt="wifi_icon"> <span>${hotel.Wifi_text}</span>
              </div>
              <div class="rp-card-services">
                <img src="${hotel.Person_icon}" alt="Guest_icon"> <span>${hotel.Person_Total}</span>
              </div>
              <div class="rp-card-services">
                <img src="${hotel.Ac_icon}" alt="Ac_icon"> <span>${hotel.Ac_text}</span>
              </div>
            </div>

            <div class="rp-card-view-details">
              <span class="view-details-btn" data-id="${hotel.Id}" data-bs-toggle="modal" data-bs-target="#viewdetailsModal" onclick="viewDetails(this)">View Details</span>
            </div>

            <div class="rp-card-all-btn my-3">
              <div class="rp-card-offer-btn">
                <button class="rp-card-option-button">
                  <input type="radio" class="rp-rooms-radio" name="option_${hotel.Id}">
                  <div class="rp-card-option-content">
                    <div class="rp-card-option-title">Room Only</div>
                    <div class="rp-card-option-price">${hotel.Room_Only_Price} /night</div>
                  </div>
                </button>

                <button class="rp-card-option-button">
                  <input type="radio" class="rp-rooms-radio" name="option_${hotel.Id}">
                  <div class="rp-card-option-content">
                    <div class="rp-card-option-title">Room with Breakfast</div>
                    <div class="rp-card-option-price">${hotel.Room_With_Breakfast}</div>
                  </div>
                </button>
              </div>

              <button class="rp-card-book-button" onclick="window.location.href='R-Payments.html'">Book Now</button>
            </div>
          </div>
        </div>`;

      container.innerHTML += hotelCard;
    });
  } else {
    container.innerHTML = `
      <div class="container">
        <div class="rp-NoRoomsFound">
          <p>No rooms match the selected filters.</p>
          <img src="./IMAGE/NoRoomsFund.png" alt="Search Icon">
          <p>Please try changing your filters.</p>
        </div>
      </div>`;
  }

  // Update result count text
  document.querySelector(".rp-results-text").innerText = `Showing ${hotelsArray.length} Results`;

  hotelCardOpt?.();
  userLogOrNot?.();
}


// Sorting handler ( Sort By : )
document.getElementById("sortSelect").addEventListener("change", function () {
  const sortValue = this.value;
  let sortedHotels = [...currentFilteredHotels];

  if (sortValue === "low") {
    sortedHotels.sort((a, b) =>
      parseFloat(a.Room_Only_Price.replace(/[^\d.]/g, '')) - parseFloat(b.Room_Only_Price.replace(/[^\d.]/g, ''))
    );
  } else if (sortValue === "high") {
    sortedHotels.sort((a, b) =>
      parseFloat(b.Room_Only_Price.replace(/[^\d.]/g, '')) - parseFloat(a.Room_Only_Price.replace(/[^\d.]/g, ''))
    );
  }

  renderHotelCards(sortedHotels);
});


// View Details
async function viewDetails(element) {
  const hotelId = element.getAttribute("data-id");
  console.log("View details clicked for hotel ID:", hotelId);

  try {
    const res = await fetch("http://localhost:3000/Hotels");
    const hotels = await res.json();
    const selectedHotel = hotels.find(h => h.Id == hotelId);

    console.log("Found hotel:", selectedHotel);

    if (selectedHotel && selectedHotel.View_Details && selectedHotel.View_Details.length > 0) {
      const d = selectedHotel.View_Details[0];

      // Modal Title
      const modalTitle = document.querySelector("#viewdetailsModal .modal-title");
      if (modalTitle) modalTitle.innerText = d.V_Title;

      // Room Details
      const roomDetails = document.querySelector("#viewdetailsModal .mb-room-details");
      if (roomDetails) {
        roomDetails.innerHTML = `
          <div><img class="mb-room-img" src="./IMAGE/house_door.svg" alt="">80m2</div>
          <div><img class="mb-room-img" src="./IMAGE/person.svg" alt="">${d.V_Guest} Guests</div>
          <div><img class="mb-room-img" src="./IMAGE/bed.svg" alt="">${d.Bed}</div>
          <div><img class="mb-room-img" src="./IMAGE/Bathroom.svg" alt="">${d.Bathroom} Bathroom</div>
        `;
      }

      // Description
      const description = document.querySelector("#viewdetailsModal .mb-sub-viewdetails p:nth-of-type(1)");
      if (description) description.innerText = d.V_Description;

      // Amenities
      const amenities = document.querySelector("#viewdetailsModal .mb-room-amenities");
      if (amenities) {
        amenities.innerHTML = `
          ${d.Ac === true ? `<div class="col-6 col-md-4 mb-amenities-img mb-4"><img src="${d.Ac_icon}" alt=""> ${d.Ac_text}</div>` : ''}
          ${d.CableTv === true ? `<div class="col-6 col-md-4 mb-amenities-img mb-4"><img src="${d.CableTv_icon}" alt=""> ${d.cableTv_text}</div>` : ''}
          ${d.Wifi === true ? `<div class="col-6 col-md-4 mb-amenities-img mb-4"><img src="${d.Wifi_icon}" alt=""> ${d.Wifi_text}</div>` : ''}
          ${d.slipper === true ? `<div class="col-6 col-md-4 mb-amenities-img mb-4"><img src="${d.slipper_icon}" alt=""> ${d.slipper_text}</div>` : ''}
          ${d.towel === true ? `<div class="col-6 col-md-4 mb-amenities-img mb-4"><img src="${d.towel_icon}" alt=""> ${d.towel_text}</div>` : ''}
          ${d.hairDryer === true ? `<div class="col-6 col-md-4 mb-amenities-img mb-4"><img src="${d.hairDryer_icon}" alt=""> ${d.hairDryer_text}</div>` : ''}
          ${d.shampoo === true ? `<div class="col-6 col-md-4 mb-amenities-img mb-4"><img src="${d.shampoo_icon}" alt=""> ${d.shampoo_text}</div>` : ''}
          ${d.safeBox === true ? `<div class="col-6 col-md-4 mb-amenities-img mb-4"><img src="${d.safeBox_icon}" alt=""> ${d.safeBox_text}</div>` : ''}
          ${d.welcome === true ? `<div class="col-6 col-md-4 mb-amenities-img mb-4"><img src="${d.welcome_icon}" alt=""> ${d.welcome_text}</div>` : ''}
          ${d.pet === true ? `<div class="col-6 col-md-4 mb-amenities-img mb-4"><img src="${d.pet_icon}" alt=""> ${d.pet_text}</div>` : ''}
          ${d.machine === true ? `<div class="col-6 col-md-4 mb-amenities-img mb-4"><img src="${d.machine_icon}" alt=""> ${d.machine_text}</div>` : ''}
          ${d.ref === true ? `<div class="col-6 col-md-4 mb-amenities-img mb-4"><img src="${d.ref_icon}" alt=""> ${d.ref_text}</div>` : ''}
        `;
      }

      // Carousel Images
      const carouselInner = document.querySelector("#carouselExampleCaptions .carousel-inner");
      if (carouselInner) {
        carouselInner.innerHTML = `
          <div class="carousel-item active">
            <img src="${d.V_imag1}" class="d-block w-100 mb-img-fluid" alt="Room Image 1">
          </div>
          <div class="carousel-item">
            <img src="${d.V_imag2}" class="d-block w-100 mb-img-fluid" alt="Room Image 2">
          </div>
          <div class="carousel-item">
            <img src="${d.V_imag3}" class="d-block w-100 mb-img-fluid" alt="Room Image 2">
          </div>
        `;
      }

      console.log("Modal content updated successfully");
    } else {
      console.error("Hotel not found or no View_Details available");
    }
  } catch (err) {
    console.error("Failed to load View Details:", err);
  }
}



// Combined filter function that applies Room Types,guests,Room Amenities,Room Types,Price Range filters ( Milan 09-06 Filter )

function applyCombinedFilter() {

  // Get selected Room Types
  const selectedTypes = Array.from(document.querySelectorAll('input[name="room1"]:checked'))
    .map(cb => cb.value);

  // Get selected guests
  const selectedGuests = Array.from(document.querySelectorAll('input[name="room2"]:checked'))
    .map(cb => cb.value);

  // Get selected Room Amenities
  const selectedAmenities = Array.from(document.querySelectorAll('input[name="room3"]:checked'))
    .map(cb => cb.nextSibling.textContent.trim().toLowerCase().replace(/[^a-z]/gi, ''));

  // Get selected Room Types
  const selectedViews = Array.from(document.querySelectorAll('input[name="room4"]:checked'))
    .map(cb => cb.value);



  let filteredHotels = fullFilteredHotels;

  // 1. Apply Room Type filter if any room types are selected
  if (selectedTypes.length > 0) {
    const roomTypeMap = {
      single: "singleroom",
      double: "doubleroom",
      twin: "twinroom",
      triple: "tripleroom",
      deluxe: "deluxeroom",
      executive: "executiveroom",
      family: "familyroom",
      connecting: "connectingrooms"
    };

    filteredHotels = filteredHotels.filter(hotel => {
      const roomTypeObj = hotel.Room_Types?.[0];
      if (!roomTypeObj) return false;

      return selectedTypes.some(type => {
        const key = roomTypeMap[type];
        return key && roomTypeObj[key] === true;
      });
    });
  }

  // 2. Apply Guest filter if any guests are selected
  if (selectedGuests.length > 0) {
    filteredHotels = filteredHotels.filter(hotel => {
      const guestCounts = hotel.View_Details?.map(d => String(d.V_Guest).trim());
      if (!guestCounts || guestCounts.length === 0) return false;

      // Show hotel if at least ONE selected guest count is available
      return selectedGuests.some(g => guestCounts.includes(g));
    });
  }

  // 3. Apply Room Amenities filter if any amenities are selected
  if (selectedAmenities.length > 0) {
    filteredHotels = filteredHotels.filter(hotel => {
      const d = hotel.View_Details?.[0];
      if (!d) return false;

      const map = {
        wifi: d.Wifi === true,
        ac: d.Ac === true,
        nonac: d.NonAC === true,
        flatscreentv: d.CableTv === true,
        privatebathroom: d.Bathrom === true,
        inroomrefrigerator: d.ref === true,
        safelocker: d.safeBox === true,
        teamaker: d.teamachine === true,
        slippers: d.slipper === true,
        hairdryer: d.hairDryer === true,
        towels: d.towel === true,
        shampoo: d.shampoo === true,
        espressomachine: d.machine === true,
        welcomedrinks: d.welcome === true,
        petfriendly: d.pet === true,
      };

      // Check how many selected amenities are true
      const trueMatches = selectedAmenities.filter(key => map[key]);

      if (selectedAmenities.length === 1) {
        return trueMatches.length === 1;
      } else {
        return trueMatches.length > 0;
      }
    });
  }

  // 4. Apply Room View Type filter if any view types are selected
  if (selectedViews.length > 0) {
    filteredHotels = filteredHotels.filter(hotel => {
      const viewObj = hotel.Room_View?.[0];
      if (!viewObj) return false;

      const trueMatches = selectedViews.filter(view => viewObj[view] === true);

      if (selectedViews.length === 1) {
        return trueMatches.length === 1;
      } else {
        return trueMatches.length > 0;
      }
    });
  }

  // 5. Apply Price Range filter if any range are selected 
  const minPrice = parseInt(document.getElementById('minSlider').value);
  const maxPrice = parseInt(document.getElementById('maxSlider').value);

  filteredHotels = filteredHotels.filter(hotel => {
    if (!hotel.Room_Only_Price) return false;
    const price = parseInt(hotel.Room_Only_Price.replace(/\D/g, ''));
    return price >= minPrice && price <= maxPrice;
  });


  renderHotelCards(filteredHotels);

  // Update count display with total selected filters
  const totalSelected = selectedTypes.length + selectedGuests.length + selectedAmenities.length + selectedViews.length;
  document.getElementById("filteredItemResults").innerText =
    totalSelected > 0 ? `( ${totalSelected} )` : "";

}

// Individual filter functions (kept for compatibility, but now call combined filter)
function applyGuestFilter() {
  applyCombinedFilter();
}

function applyAmenityFilter() {
  applyCombinedFilter();
}

// Listen for checkbox changes
document.querySelectorAll('#Filters input[type="checkbox"]').forEach(cb => {
  cb.addEventListener("change", () => {
    // Reset to show all when any checkbox changes, but don't apply filter yet
    // The filter will be applied when APPLY button is clicked
    // renderHotelCards(fullFilteredHotels);
    document.getElementById("filteredItemResults").innerHTML = "";
  });
});

