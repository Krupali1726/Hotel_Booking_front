///////////////////////////////////////////////////// profile active menu ////////////////////////////////////////////////////////////////////////////
// Get only profile menu buttons
const profileMenuButtons = document.querySelectorAll('.A_profile_menu .nav-link');

// Add click event listener to each profile menu button
profileMenuButtons.forEach(button => {
  button.addEventListener('click', function () {
    // Remove active class from all profile menu buttons
    profileMenuButtons.forEach(btn => {
      btn.classList.remove('A_profile_menu_active');
      btn.classList.add('A_profile_menu_unactive');
    });

    // Add active class to clicked profile menu button
    this.classList.remove('A_profile_menu_unactive');
    this.classList.add('A_profile_menu_active');
  });
});
///////////////////////////////////////////////////// proflie pic ////////////////////////////////////////////////////////////////////////////
function previewImage(event) {
  const reader = new FileReader();
  reader.onload = function () {
    document.getElementById('profilePic').src = reader.result;
  }
  reader.readAsDataURL(event.target.files[0]);
}
///////////////////////////////////////////////////////// review order ////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function () {
  // Step 1: Star rating logic
  const stars = document.querySelectorAll('#starRating span');
  let selectedRating = 0;
  stars.forEach(star => {
    star.addEventListener('mouseover', function () {
      highlightStars(this.dataset.value);
    });
    star.addEventListener('mouseout', function () {
      highlightStars(selectedRating);
    });
    star.addEventListener('click', function () {
      selectedRating = this.dataset.value;
      highlightStars(selectedRating);
      // Show step 2 (do NOT hide step 1)
      document.getElementById('reviewStep2').style.display = 'block';
      document.getElementById('submitReviewBtn').style.display = 'inline-block';
    });
  });
  function highlightStars(rating) {
    stars.forEach(star => {
      star.style.color = (star.dataset.value <= rating) ? '#ffc107' : '#ccc';
    });
  }

  // Step 2: Image preview logic
  document.getElementById('reviewImages').addEventListener('change', function (e) {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    const files = Array.from(e.target.files).slice(0, 5);
    files.forEach(file => {
      if (file.size <= 5 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = function (ev) {
          const img = document.createElement('img');
          img.src = ev.target.result;
          img.style.width = '60px';
          img.style.height = '60px';
          img.style.objectFit = 'cover';
          img.style.borderRadius = '6px';
          preview.appendChild(img);
        };
        reader.readAsDataURL(file);
      }
    });
  });

  // Reset modal on open
  var addReviewModal = document.getElementById('addReviewModal');
  addReviewModal.addEventListener('show.bs.modal', function () {
    document.getElementById('reviewStep1').style.display = 'block';
    document.getElementById('reviewStep2').style.display = 'none';
    document.getElementById('submitReviewBtn').style.display = 'none';
    selectedRating = 0;
    highlightStars(0);
    document.getElementById('reviewDescription').value = '';
    document.getElementById('reviewImages').value = '';
    document.getElementById('imagePreview').innerHTML = '';
  });
});
///////////////////////////////////////////////////////// review file picture ////////////////////////////////////////////////////////////////////////
// File Upload Handling
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('reviewImages');
const imagePreview = document.getElementById('imagePreview');
const maxFileSize = 5 * 1024 * 1024; // 5MB
const maxFiles = 5;
let selectedFiles = []; // Array to store all selected files

// Handle click on upload area
uploadArea.addEventListener('click', () => fileInput.click());

// Handle drag and drop events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  uploadArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
  uploadArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  uploadArea.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
  uploadArea.style.borderColor = '#0a3c68';
  uploadArea.style.backgroundColor = '#f8f9fa';
}

function unhighlight(e) {
  uploadArea.style.borderColor = '#ccc';
  uploadArea.style.backgroundColor = 'transparent';
}

// Handle dropped files
uploadArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  handleFiles(files);
}

// Handle selected files
fileInput.addEventListener('change', function () {
  const newFiles = Array.from(this.files);

  // Check if adding new files would exceed max limit
  if (selectedFiles.length + newFiles.length > maxFiles) {
    alert(`You can only upload up to ${maxFiles} images total. You already have ${selectedFiles.length} images.`);
    this.value = '';
    return;
  }

  // Add new files to selectedFiles array
  selectedFiles = [...selectedFiles, ...newFiles];

  // Process all files
  handleFiles(selectedFiles);

  // Clear the input value to allow selecting the same file again
  this.value = '';
});

function handleFiles(files) {
  // Clear existing previews
  imagePreview.innerHTML = '';

  // Process all files
  files.forEach(file => {
    if (file.size > maxFileSize) {
      alert(`File ${file.name} is too large. Maximum size is 5MB.`);
      return;
    }

    if (!file.type.match('image.*')) {
      alert(`File ${file.name} is not an image.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.createElement('div');
      preview.className = 'position-relative';
      preview.style.width = '100px';
      preview.style.height = '100px';
      preview.style.borderRadius = '8px';
      preview.style.overflow = 'hidden';
      preview.style.margin = '5px';
      preview.style.display = 'inline-block';

      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';

      const removeBtn = document.createElement('button');
      removeBtn.innerHTML = '×';
      removeBtn.className = 'position-absolute top-0 end-0 btn btn-sm btn-danger';
      removeBtn.style.padding = '0 6px';
      removeBtn.style.borderRadius = '0 0 0 8px';
      removeBtn.onclick = function () {
        // Remove the file from selectedFiles array
        const index = selectedFiles.indexOf(file);
        if (index > -1) {
          selectedFiles.splice(index, 1);
        }
        preview.remove();
      };

      preview.appendChild(img);
      preview.appendChild(removeBtn);
      imagePreview.appendChild(preview);
    }
    reader.readAsDataURL(file);
  });
}
///////////////////////////////////////////////////////// changed password model ////////////////////////////////////////////////////////////////////////

function togglePassword(inputId, el) {
  const input = document.getElementById(inputId);
  const icon = el.querySelector('svg, i'); 

  if (!icon) return;

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    input.type = "password";
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}
document.getElementById('v-pills-settings-tab').addEventListener('click', function (e) {
  var myModal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
  myModal.show();
});

document.addEventListener('DOMContentLoaded', function () {
  const changePasswordModal = document.getElementById('changePasswordModal');

  // When modal is hidden
  changePasswordModal.addEventListener('hidden.bs.modal', function () {
    // Remove the backdrop
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
    // Remove modal-open class from body
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  // When modal is shown
  changePasswordModal.addEventListener('shown.bs.modal', function () {
    // Ensure proper z-index for modal
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.style.zIndex = '1040';
    }
    changePasswordModal.style.zIndex = '1045';
  });
});
///////////////////////////////////////////////////////// cancel booking ////////////////////////////////////////////////////////////////////////
// document.querySelectorAll('.cancel-booking-btn').forEach(btn => {
//   btn.addEventListener('click', function (e) {
//     e.preventDefault();

//     // Hide all booking cards and other sections
//     document.querySelectorAll('.A_user_profile_booking_room').forEach(card => card.style.display = 'none');
//     // Optionally hide other sections if needed

//     // Fill the cancellation form with the correct data
//     document.getElementById('cancelRoomTitle').textContent = this.dataset.room;
//     document.getElementById('cancelBookingId').textContent = 'Booking ID: ' + this.dataset.bookingid;
//     document.getElementById('cancelGuests').textContent = this.dataset.guests;
//     document.getElementById('cancelDates').textContent = this.dataset.dates;
//     document.getElementById('cancelPayment').textContent = this.dataset.payment;
//     document.getElementById('cancelPrice').textContent = this.dataset.price;
//     document.getElementById('cancelTotalPrice').textContent = this.dataset.price + ' Total Price';

//     // Show the cancellation section
//     document.getElementById('cancelBookingSection').style.display = 'block';
//   });
// });
///////////////////////////////////////////////////////// cancel other reason ////////////////////////////////////////////////////////////////////////
// document.addEventListener('DOMContentLoaded', function () {
//   // Listen for changes on all cancelReason radios
//   document.querySelectorAll('input[name="cancelReason"]').forEach(function (radio) {
//     radio.addEventListener('change', function () {
//       var otherContainer = document.getElementById('otherReasonContainer');
//       if (document.getElementById('reason7').checked) {
//         otherContainer.style.display = 'block';
//       } else {
//         otherContainer.style.display = 'none';
//       }
//     });
//   });
// });

//////////////////////////////////////   functionality  js ///////////////////////////////////////////////////
//////////////////////////////////////   cards validation    ///////////////////////////////////////////////////
//////////////////////////////////////        add cards    ///////////////////////////////////////////////////
// Card Number Validation
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

// Form Submission Validation
// document.getElementById('addCardBtn').addEventListener('click', function () {
//   const cardNumberInput = document.getElementById('cardNumber');
//   const expiryDateInput = document.getElementById('expiryDate');
//   const cvvInput = document.getElementById('cvv');
//   const cardHolderNameInput = document.getElementById('cardHolderName');

//   const isCardNumberValid = validateCardNumber(cardNumberInput);
//   const isExpiryDateValid = validateExpiryDate(expiryDateInput);
//   const isCVVValid = validateCVV(cvvInput);
//   const isCardHolderNameValid = validateCardHolderName(cardHolderNameInput);

//   // if (isCardNumberValid && isExpiryDateValid && isCVVValid && isCardHolderNameValid) {
//   //   // All validations passed, proceed with form submission

//   //   // Gather card details
//   //   const cardData = {
//   //     cardNumber: cardNumberInput.value.replace(/\s/g, ''), // Remove spaces
//   //     expiryDate: expiryDateInput.value, // Keep MM/YY format
//   //     cvv: cvvInput.value,
//   //     cardHolderName: cardHolderNameInput.value.trim()
//   //   };

//   //   // Create an array with the card object
//   //   const cardsArray = [cardData];

//   //   // Post the data to the backend using fetch
//   //   fetch('http://localhost:3000/cards', {
//   //     method: 'POST',
//   //     headers: {
//   //       'Content-Type': 'application/json'
//   //     },
//   //     body: JSON.stringify(cardsArray)
//   //   })
//   //     .then(response => {
//   //       if (!response.ok) {
//   //         throw new Error(`HTTP error! status: ${response.status}`);
//   //       }
//   //       return response.json(); // Assuming the API returns JSON
//   //     })
//   //     .then(data => {
//   //       console.log(data.id);

//   //       console.log('Success:', data);
//   //       // alert('Card details submitted successfully!');
//   //       // Optionally close the modal or clear the form
//   //       // const addCardModal = bootstrap.Modal.getInstance(document.getElementById('addCardModal'));
//   //       // addCardModal.hide();
//   //     })
//   //     .catch((error) => {
//   //       console.error('Error:', error);
//   //       alert('Failed to submit card details. Error: ' + error.message);
//   //     });
//   // }

// });


// *************************************************


// ******************  Ravi  *********************

// Display LoggedIn UserName On Header 
// window.onload = function () {
//   const userMail = localStorage.getItem("logedInUserMail");
//   const profileTitle = document.getElementById("logIn");

//   if (userMail && profileTitle) {

//     async function getUserName() {

//       const ressponse = await fetch("http://localhost:3000/createAccount");
//       const user_data = await ressponse.json()


//       const userMailId = user_data.find(name =>
//         name.Email_id == userMail
//       );

//       let userName = userMailId.FullName
//       console.log("UserName :::: " + userName)

//       profileTitle.innerHTML = userName;
//       document.getElementById("logIn").removeAttribute("data-bs-toggle");
//       document.getElementById("logIn").removeAttribute("data-bs-target");

//       document.getElementById('logIn').onclick = function () {
//         // Profile page Called 
//         window.location.href = "Profile.html";
//       }
//     }
//     getUserName()

//   }
// }

window.onload = function () {
  const userMail = localStorage.getItem("logedInUserMail");
  const profileTitles = document.querySelectorAll(".LoggedIn");

  if (userMail && profileTitles.length) {
    async function getUserName() {
      const response = await fetch("http://localhost:3000/createAccount");
      const user_data = await response.json();

      const userMailId = user_data.find(name => name.Email_id == userMail);
      let userName = userMailId?.FullName || "Profile";

      console.log("UserName :::: " + userName);

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

// Log Out
document.getElementById("confirmLogoutBtn").onclick = function () {
  localStorage.removeItem("logedInUserMail")
  // Redirect user to rooms page 
  window.location.href = "Rooms.html";
}

// Delete Account 
async function deleteAccount(event) {
  event.preventDefault();
  try {
    let deleteInput = document.getElementById('deleteConfirmInput').value
    let userEmail = localStorage.getItem("logedInUserMail")

    if (deleteInput == "DELETE") {

      const ressponse = await fetch("http://localhost:3000/createAccount");
      const account_Data = await ressponse.json()


      const signedInUserMailId = account_Data.find(data =>
        data.Email_id == userEmail
      );

      const userId = signedInUserMailId.id;
      const res = await fetch(`http://localhost:3000/createAccount/${userId}`, {
        method: "DELETE"
      });

        window.location.href = "Rooms.html";
        localStorage.removeItem("logedInUserMail");
        // alert("Your Account was deleted successfully");

    } else {
      alert("!! Enter Correct Input !!")
    }
  }
  catch (error) {
    console.error("Error :: " + error);
  }

}

// Change Password - Profile Page 
async function changePassword(event) {
  event.preventDefault();

  let oldPwd = document.getElementById('oldPassword').value
  let newPwd = document.getElementById('newPassword').value
  let confirmPwd = document.getElementById('confirmPassword').value

  const ressponse = await fetch("http://localhost:3000/createAccount");
  const account_Data = await ressponse.json()

  const matchOldPwd = account_Data.find(data =>
    data.Password == oldPwd
  );


  if (matchOldPwd) {

    if (newPwd == confirmPwd) {
      // alert("new and confirm match")

      if (newPwd !== oldPwd) {
        alert("Password Chanegd Successfully")
        // alert("new and old password is different")
        const userId = matchOldPwd.id;
        const res = await fetch(`http://localhost:3000/createAccount/${userId}`, {
          method: "PATCH",
          body: JSON.stringify({ Password: newPwd })
        });
      }
      else {
        alert("!!! Your Old Pasword and New Password is Same , Change New Password !!!")
        localStorage.setItem('showModalPassword', 'true');
        window.location.reload();
      }


    }
    else {
      alert("New Password and Confirm Password Not Same")
      localStorage.setItem('showModalPassword', 'true');
      window.location.reload();
    }

  }
  else {
    alert("!! Enter Correct Old Password !!")
    localStorage.setItem('showModalPassword', 'true');
    window.location.reload();
  }

}

// ************ Card ***************

// Card Details :  send to the Json-server
async function cardDetilsSend(event) {
  try {
    event.preventDefault();
    const cardNumberInput = document.getElementById("cardNumber");
    const expiryDateInput = document.getElementById("expiryDate");
    const cvvInput = document.getElementById("cvv");
    const nameInput = document.getElementById("cardHolderName");

    if (!validateCardNumber(cardNumberInput) || !validateExpiryDate(expiryDateInput) || !validateCVV(cvvInput) || !validateCardHolderName(nameInput)
    ) {
      return;
    }

    const cardNo = cardNumberInput.value;
    const expiryDate = expiryDateInput.value;
    const cvvCode = cvvInput.value;
    const holderName = nameInput.value;

    const signInUserMail = localStorage.getItem("logedInUserMail");
    const response = await fetch("http://localhost:3000/createAccount");
    const accountData = await response.json();

    const user = accountData.find(data => data.Email_id === signInUserMail);
    const existingCards = user.saved_cards;

    const duplicateCard = existingCards.find(card => card.Card_No === cardNo);
    if (duplicateCard) {
      alert("This card number already exists in your saved cards.");
      return;
    }

    const newCard = {
      Card_Id: Math.floor(Math.random() * 1000),
      Card_No: cardNo,
      Expiry_date: expiryDate,
      CVV: cvvCode,
      Holder_Name: holderName
    };

    existingCards.push(newCard);

    const patchRes = await fetch(`http://localhost:3000/createAccount/${user.id}`, {
      method: "PATCH",
      body: JSON.stringify({ saved_cards: existingCards })
    });

    if (patchRes.ok) {
      alert("Card saved successfully!");
    } else {
      alert("Failed to save card.");
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

let cardIdToDelete = null;

// Fetch saved cards
async function fetchSavedCards() {
  try {
    const loggedUserMail = localStorage.getItem('logedInUserMail');
    const response1 = await fetch(`http://localhost:3000/createAccount`);
    const datas = await response1.json();
    const userMailId = datas.find(d => d.Email_id == loggedUserMail);

    if (userMailId) {
      let userId = userMailId.id;
      const response = await fetch(`http://localhost:3000/createAccount/${userId}`);
      const data = await response.json();

      if (data && data.saved_cards) {
        printSavedCards(data.saved_cards);
      }
    }
  } catch (error) {
    console.error('Error fetching account data :', error);
  }
}

// Print Saved Cards
function printSavedCards(savedCards) {
  const printCards = document.getElementById("printSavedCards");

  if (!savedCards || savedCards.length === 0) {
    printCards.innerHTML =
      ` <div class="p-5" style="margin : 0px auto">
              <img src="./IMAGE/emptycard.svg" alt="No Bookings" style="width: 100px; margin-bottom: 24px;">
              <div style="font-size: 18px; color: #222; text-align : center">
                   No Cards yet.
              </div>
         </div> `;
    return;
  }

  const cardsHTML = savedCards.map(card => `
    <div class="A_cards_layout my-2">
      <div class="d-flex justify-content-between align-items-center">
        <div><img src="./IMAGE/Mastercard.svg" alt="" class="A_cards_layout_img"></div>
        <div>
          <img src="./IMAGE/dustbin.svg"
               alt="Delete card"
               class="A_cards_layout_img1 delete-card-btn"
               style="cursor:pointer"
               data-card-id="${card.Card_Id}"
               data-bs-toggle="modal"
               data-bs-target="#deleteCardModal">
        </div>
      </div>
      <div class="A_cards_layout_number">${card.Card_No}</div>
      <div class="d-flex align-items-center mt-4">
        <div class="me-3">
          <div class="A_cards_layout_name">CARD HOLDER NAME</div>
          <div class="A_cards_layout_name1">${card.Holder_Name}</div>
        </div>
        <div>
          <div class="A_cards_layout_name">VALID THRU</div>
          <div class="A_cards_layout_name1">${card.Expiry_date}</div>
        </div>
      </div>
    </div>
  `).join("");

  printCards.innerHTML = cardsHTML;
}

// Click on delete icon to Get Id 
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('delete-card-btn')) {
    cardIdToDelete = e.target.getAttribute('data-card-id');
  }
});

// Confirm delete modal
document.getElementById('confirmDeleteCardBtn').addEventListener('click', async () => {

  if (cardIdToDelete) {
    await deleteSavedCards(cardIdToDelete);
    cardIdToDelete = null;

    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteCardModal'));
    if (modal) modal.hide();
  }
});

// Delete function 
async function deleteSavedCards(cardIdToDelete) {
  try {
    const loggedUserMail = localStorage.getItem('logedInUserMail');
    const response = await fetch('http://localhost:3000/createAccount');
    const users = await response.json();

    const user = users.find(u => u.Email_id === loggedUserMail);

    const updatedCards = user.saved_cards.filter(card => card.Card_Id !== Number(cardIdToDelete));

    const updateResponse = await fetch(`http://localhost:3000/createAccount/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...user, saved_cards: updatedCards }),
    });

    if (updateResponse.ok) {
      alert(" Card deleted successfully ");
      fetchSavedCards();
    }

  } catch (error) {
    console.error('Error deleting card:', error);
  }
}

fetchSavedCards();


// show Modal On Refresh Page 
function passwordModal() {
  let pwdModal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
  pwdModal.show();
}

document.addEventListener('DOMContentLoaded', function () {
  // Change Password Modal 
  if (localStorage.getItem('showModalPassword') === 'true') {
    localStorage.removeItem('showModalPassword');
    passwordModal();
  }
});


// Update Profile

// Update Profile Section

document.addEventListener('DOMContentLoaded', () => {
  const Country = document.getElementById("countryCode");
  // Country :: default selected value
  let countryCode = Country.value;
  // Country :: Update value on changes
  Country.addEventListener("change", function () {
    countryCode = Country.value;
  });
});


async function updateProfile(event) {
  event.preventDefault();
  try {
    const loggedEmail = localStorage.getItem("logedInUserMail");
    const userImage = document.getElementById('profilePic').src;

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const FullName = firstName + " " + lastName;

    const numberOnly = document.getElementById("mobileNo").value;
    const countryCode = document.getElementById("countryCode").value;

    const BirthDate = document.getElementById("dobInput").value;
    const Gender = document.querySelector('input[name="gender"]:checked').value;

    const res = await fetch('http://localhost:3000/createAccount');
    const account_data = await res.json();

    const userLogged = account_data.find(account => account.Email_id === loggedEmail);

    if (userLogged) {
      const userId = userLogged.id;

      // Updated profile data
      const updatedData = {
        FullName: FullName,
        Country_code: countryCode,
        MobileNumber: numberOnly,
        DOB: BirthDate,
        Gender: Gender,
        User_Image: userImage
      };

      const patchRes = await fetch(`http://localhost:3000/createAccount/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
      });

      if (patchRes.ok) {
        alert("Profile updated successfully!");
        fetchUserData()
      }
    }

  } catch (error) {
    console.error("Error updating profile:", error);
  }
}



async function fetchUserData() {
  try {
    const loggedEmail = localStorage.getItem("logedInUserMail");
    const res = await fetch('http://localhost:3000/createAccount');
    const account_data = await res.json();

    const data = account_data.find(account => account.Email_id === loggedEmail);

    const fullName = data.FullName.trim().split(" ");
    const firstName = fullName.splice(0, 1)[0];
    const lastName = fullName.join(" ");

    const countryCode = data.Country_code;
    const mobileNumber = data.MobileNumber;
    const email = data.Email_id;
    const userImage = data.User_Image;
    const dob = data.DOB;
    const gender = data.Gender;

    document.getElementById('profilePic').src = userImage;
    document.getElementById("firstName").value = firstName;
    document.getElementById("lastName").value = lastName;
    document.getElementById("mobileNo").value = mobileNumber;
    document.getElementById("countryCode").value = countryCode;
    document.getElementById("email").value = email;
    document.getElementById("dobInput").value = dob;
    const genderData = document.querySelector(`input[name="gender"][value="${gender}"]`);
    if (genderData) genderData.checked = true;


  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

fetchUserData()





// ***************** Milan 18-06 *****************

// My Booking Card Data fetch  
async function fetchAndRenderData() {
  try {
    const [accountRes, hotelRes] = await Promise.all([
      fetch("http://localhost:3000/createAccount"),
      fetch("http://localhost:3000/Hotels")
    ]);

    const accountData = await accountRes.json();
    const hotelData = await hotelRes.json();

    renderBookings(accountData[0].MyBooking, hotelData);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}


function renderBookings(myBookings, hotels) {
  const container = document.getElementById("bookingContainer");
  const noBookingEl = document.querySelector(".A_user_profile_details_no_booking");

  if (!container) return;
  container.innerHTML = "";

  // Review Description : First, populate the MyBookingMap 
  window.MyBooking = myBookings;
  window.MyBookingMap = {};

  let bookingExists = false; // 1. We'll track if any room is rendered

  myBookings.forEach(b => {
    const bookingId = b.Details?.BookingId;
    if (!bookingId) return;

    const roomEntries = Object.entries(b.RoomData || {}); // [["Room1", {...}], ["Room2", {...}]]
    if (roomEntries.length === 0) return;

    window.MyBookingMap[bookingId] = {};

    roomEntries.forEach(([roomKey, roomInfo]) => {

      bookingExists = true; // 2. At least one room found

      const hotel = hotels.find(h => h.Id === roomInfo?.HotelId);

      window.MyBookingMap[bookingId][roomKey] = {
        Hotel_Name: hotel?.Hotel_Name || "Unknown Hotel",
        City: hotel?.City || "Unknown City",
        Rooms_Image: hotel?.Rooms_Image || "./IMAGE/default.png"
      };
    });
  });


  // Render bookings
  myBookings.forEach(b => {
    Object.entries(b.RoomData || {}).forEach(([roomKey, roomInfo]) => {

      const hotelId = roomInfo.HotelId;
      const matchedHotel = hotels.find(h => h.Id === hotelId);
      const hotelImage = matchedHotel?.Rooms_Image || "N/A";
      const hotelName = matchedHotel?.Hotel_Name || "Unknown Hotel";

      const roomOnlyPriceStr = matchedHotel?.Room_Only_Price?.replace("$", "") || "0";
      const breakfastPriceStr = matchedHotel?.Room_With_Breakfast?.replace("$", "") || "0";
      const roomChoice = b.Details?.RoomsChoised || "Room Only";

      const totalPaid = b.Details?.TotalPaid || "$0";

      const roomOnlyPrice = parseFloat(roomOnlyPriceStr);
      const breakfastPrice = parseFloat(breakfastPriceStr);

      let totalPrice = roomOnlyPrice;
      if (roomChoice === "Room with Breakfast") {
        totalPrice += breakfastPrice;
      }

      const bookingId = b.Details?.BookingId || "N/A";
      const totalGuest = b.Details?.TotalGuest || "0";
      const totalChild = b.Details?.TotalChild || "0";
      const guestText = `${totalGuest} Adult${totalGuest !== "1" ? "s" : ""}, ${totalChild} Child${totalChild !== "1" ? "ren" : ""}`;
      const date = b.Details?.BookedDate || "N/A";
      const paymentMethod = b.Details?.PaymentMethod || "N/A";

      // Booking Details Modal dynamic
      const dateRange = b.Details?.BookedDate || "";
      const { checkIn, checkOut } = extractCheckInOut(dateRange);

      const bookingPayload = {
        bookingId,
        guestText,
        checkIn,
        checkOut,
        room: matchedHotel?.Hotel_Name || "Unknown Hotel",
        location: matchedHotel?.City,
        paymentMethod,
        tax: "$5",
        total: totalPaid
      };


      // upcoming, success, cancelled
      const isCancelled = b.Details?.Status?.toLowerCase() === "cancelled";
      const status = isCancelled
        ? { text: "Cancelled", bg: "#FFE5E5", color: "#FF0000" }
        : getStatusLabel(date);


      const actionButton = getActionButton(status.text, bookingId, roomKey);


      container.innerHTML += `
        <div class="A_user_profile_booking_room mb-3" data-status="${status.text.toLowerCase()}"
          style="background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; align-items: stretch; padding: 0; overflow: hidden;">
          
          <div style="flex: 0 0 220px; position: relative;" class="room-image-container">
            <img src="${hotelImage}" alt="Room" class="A_user_profile_booking_room_img"
              style="width: 100%; height: 100%; object-fit: cover;">
            <span class="status-badge booking-status" style="position: absolute; top: 12px; left: 12px; background: ${status.bg}; color: ${status.color}; font-size: 14px; padding: 2px 12px; border-radius: 6px;">
              ${status.text}</span>
          </div>
  
          <div style="flex: 1 1 auto; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;" class="room-details-container">
            <div>
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <div class="A_user_profile_booking_room_title" style="font-size: 20px; font-weight: 600; color: #222;">
                    ${hotelName}
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 20px; font-weight: 700; color: #222;" class="A_user_profile_booking_room_price">
                    $${totalPrice} <span style="font-size: 13px; color: #888; font-weight: 400;">/night</span>
                  </div>
                </div>
              </div>
  
              <div class="booking-details my-1">
                <div class="d-flex justify-content-between align-items-center">
                  <div style="font-size: 15px; color: #222;">Booking ID</div>
                  <div style="font-size: 15px; color: #888; text-align: end;">#${bookingId}</div>
                </div>
              </div>
  
              <div class="booking-details my-1">
                <div class="d-flex justify-content-between align-items-center">
                  <div style="font-size: 15px; color: #222;">Guests</div>
                  <div style="font-size: 15px; color: #888; text-align: end;">
                    ${guestText}
                  </div>
                </div>
              </div>
  
              <div class="booking-details my-1">
                <div class="d-flex justify-content-between align-items-center">
                  <div style="font-size: 15px; color: #222;">Date</div>
                  <div style="font-size: 15px; color: #222; text-align: end;">${date}</div>
                </div>
              </div>
  
              <div class="booking-details my-1">
                <div class="d-flex justify-content-between align-items-center">
                  <div style="font-size: 15px; color: #222;">Payment method</div>
                  <div style="font-size: 15px; color: #888; text-align: end;">${paymentMethod}</div>
                </div>
              </div>
            </div>
  
            <div class="d-flex justify-content-between align-items-center mt-2">
              <a href="#" data-bs-toggle="modal" data-bs-target="#bookingDetailsModal" data-booking='${JSON.stringify(bookingPayload).replace(/'/g, "&apos;")}' onclick="populateBookingModal(this)"
                style="color: rgba(3, 65, 119, 1); text-decoration: none; font-size: 14px; font-weight: 500;">
                View Details </a>

              <div>${actionButton}</div>
            </div>
          </div>
        </div>
      `;
    });
  });

  // 3. Show/hide no-booking message
  if (noBookingEl) {
    if (bookingExists) {
      noBookingEl.classList.add("d-none");
    } else {
      noBookingEl.classList.remove("d-none");
    }
  }

  // Setup submit button event listener ONLY ONCE after all rendering is complete
  setupSubmitButton(myBookings, hotels);
}



// Get dynamic action BUTTON based on status ( Cancel Booking, +Add Review )
function getActionButton(statusText, bookingId, roomKey) {
  if (statusText === "Upcoming") {
    return `<a href="javascript:void(0);" onclick="handleCancelBooking('${bookingId}')" class="cancel-booking-btn" 
              style="color: rgba(255, 0, 0, 1); font-weight: 500; font-size: 15px; text-decoration: underline;">
              Cancel Booking </a>`;
  } else if (statusText === "Success") {
    return `<a href="javascript:void(0);" class="add-review-btn" data-bs-toggle="modal" data-bs-target="#addReviewModal"
              onclick="handleAddReview('${bookingId}', '${roomKey}')" style="color: rgba(3, 65, 119, 1); font-weight: 500; font-size: 15px; text-decoration: underline;"> +Add Review </a>`;
  } else if (statusText === "Cancelled") {
    return ""; // Don't show any action
  } else {
    // For other statuses like Cancelled, Pending etc.
    return `<a href="javascript:void(0);" style="color: rgba(3, 65, 119, 1); font-weight: 500; 
              font-size: 15px; text-decoration: underline;"> View Details </a>`;
  }
}

// Review Description
// === Star Rating Logic ===
let currentRating = 0;
let currentBookingId = null;
let currentRoomKey = null;


// === Open Modal +Add Review with Booking Info ===
function handleAddReview(bookingId, roomKey) {
  currentBookingId = bookingId;
  currentRoomKey = roomKey;

  const roomData = window.MyBookingMap?.[bookingId]?.[roomKey];
  if (!roomData) {
    console.error(`Room data not found for Booking: ${bookingId}, Room: ${roomKey}`);
    return;
  }

  document.getElementById("reviewHotelImage").src = roomData.Rooms_Image;
  document.getElementById("reviewHotelName").textContent = roomData.Hotel_Name;
  document.getElementById("reviewHotelAddress").textContent = roomData.City;

  // Reset star
  currentRating = 0;
  document.querySelectorAll("#starRating span").forEach(s => s.style.color = "#ccc");

  const submitBtn = document.getElementById("submitReviewBtn");
  if (submitBtn) {
    submitBtn.style.display = "inline-block";
  }
}

// 
function setupStarRating() {
  const stars = document.querySelectorAll("#starRating span");

  stars.forEach(star => {
    star.addEventListener("click", function () {
      currentRating = parseInt(this.dataset.value);
      stars.forEach(s => {
        s.style.color = parseInt(s.dataset.value) <= currentRating ? "gold" : "#ccc";
      });
      console.log("Selected rating:", currentRating);
    });
  });
}

// Initialize star rating when DOM is loaded
window.addEventListener("DOMContentLoaded", setupStarRating);


// === Submit Rating Function ===
async function saveRatingOnly(bookingId, roomKey, myBookings, hotels) {
  if (!currentRating || currentRating < 1 || currentRating > 5) {
    alert("Please select a rating.");
    return;
  }

  const selectedBooking = myBookings.find(b => b.Details?.BookingId === bookingId);
  if (!selectedBooking) {
    alert("Booking not found.");
    return;
  }

  const room = selectedBooking?.RoomData?.[roomKey];
  if (!room) {
    alert(`Room ${roomKey} not found.`);
    return;
  }

  const hotelId = room?.HotelId;
  const hotel = hotels.find(h => h.Id === hotelId);
  if (!hotel) {
    alert("Hotel not found for this room.");
    return;
  }

  const firstName = selectedBooking.Details?.firstName || "";
  const lastName = selectedBooking.Details?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();

  const newReview = {
    rating: currentRating,
    description: document.getElementById("reviewDescription")?.value || "",
    BookingId: bookingId,
    fullName: fullName
  };

  try {
    const hotelsResponse = await fetch("http://localhost:3000/Hotels");
    const hotelsList = await hotelsResponse.json();

    const match = hotelsList.find(h => h.Id === hotelId);
    const jsonServerId = match?.id;

    if (!jsonServerId) throw new Error("Hotel not found in server");

    // Prevent duplicate review by same user (fullName) for this hotel
    const alreadyReviewed = Array.isArray(match.Reviews) ? match.Reviews.some(r => r.fullName === fullName) : false;

    if (alreadyReviewed) {
      alert("You have already submitted a review for this hotel.");

      const modal = bootstrap.Modal.getInstance(document.getElementById("addReviewModal"));
      if (modal) modal.hide();
      return;
    }

    //  Append new review to existing list
    const updatedHotel = {
      ...match,
      Reviews: Array.isArray(match.Reviews) ? [...match.Reviews, newReview] : [newReview]
    };

    const response = await fetch(`http://localhost:3000/Hotels/${jsonServerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedHotel)
    });

    if (!response.ok) throw new Error("Failed to update hotel reviews.");

    const result = await response.json();
    console.log("Review saved:", result);

    alert("Thank you for your rating!");
  } catch (err) {
    console.error("Error saving review:", err);
    alert("Something went wrong.");
  }

  currentRating = 0;
  document.querySelectorAll("#starRating span").forEach(s => s.style.color = "#ccc");

  const commentBox = document.getElementById("reviewDescription");
  if (commentBox) commentBox.value = "";
}


// === Setup Submit Button (called once after rendering) ===
function setupSubmitButton(myBookings, hotels) {
  const submitBtn = document.getElementById("submitReviewBtn");
  if (!submitBtn) return;

  // Remove any existing event listeners by cloning the button
  const newSubmitBtn = submitBtn.cloneNode(true);
  submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);

  // Add single event listener
  newSubmitBtn.addEventListener("click", function () {
    if (currentBookingId) {
      saveRatingOnly(currentBookingId, currentRoomKey, myBookings, hotels);
    } else {
      alert("No booking selected");
    }
  });
}


// Booking Details ( View Details Modal ) Modal dynamic
function populateBookingModal(element) {
  const data = JSON.parse(element.getAttribute('data-booking').replace(/&apos;/g, "'"));

  document.getElementById("modal-booking-id").textContent = `#${data.bookingId}`;
  document.getElementById("modal-guests").textContent = data.guestText;
  document.getElementById("modal-checkin").textContent = data.checkIn;
  document.getElementById("modal-checkout").textContent = data.checkOut;
  document.getElementById("modal-room").textContent = data.room;
  document.getElementById("modal-location").textContent = data.location;

  document.getElementById("modal-payment-method").textContent = data.paymentMethod;
  document.getElementById("modal-tax").textContent = data.tax;
  const totalPaidNum = parseFloat((data.total || "$0").replace("$", ""));
  const taxNum = parseFloat((data.tax || "$0").replace("$", ""));
  const totalWithTax = totalPaidNum + taxNum;

  document.getElementById("modal-total").textContent = `$${totalWithTax}`;
}

function extractCheckInOut(dateRangeStr) {
  const parts = dateRangeStr.split(" - ");
  const checkIn = parts[0]?.trim() || "N/A";
  const checkOut = parts[1]?.split("(")[0]?.trim() || "N/A";
  return { checkIn, checkOut };
}


// upcoming, success, cancelled ( open card Sort By: )
document.getElementById("sortBookings").addEventListener("change", function () {
  const selectedStatus = this.value.toLowerCase(); // upcoming, success, cancelled, default
  const allCards = document.querySelectorAll(".A_user_profile_booking_room");
  const noResultElement = document.querySelector(".A_user_profile_details_no_booking");

  let hasVisibleCard = false;

  allCards.forEach(card => {
    const cardStatus = card.getAttribute("data-status")?.toLowerCase();

    // Force reset display for all cards before applying logic
    card.style.display = "none";

    if (selectedStatus === "default" || cardStatus === selectedStatus) {
      card.style.display = "flex";
      hasVisibleCard = true;
    }
  });

  // Show or hide the no-booking message ( don't have any hotel bookings. )
  if (noResultElement) {
    if (hasVisibleCard) {
      noResultElement.classList.add("d-none");
    } else {
      noResultElement.classList.remove("d-none");
    }
  }
});



// Get dynamic STATUS info : Upcoming & Success 
function getStatusLabel(dateString) {
  if (!dateString) return { text: "N/A", bg: "#ccc", color: "#333" };

  const startStr = dateString.split('-')[0].trim();
  const [_, day, month] = startStr.split(' ');
  const year = new Date().getFullYear();

  const bookingDate = new Date(`${day} ${month} ${year}`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (bookingDate >= today) {
    return {
      text: "Upcoming",
      bg: "rgba(219,230,214,1)",
      color: "rgba(58,164,9,1)"
    };
  } else {
    return {
      text: "Success",
      bg: "rgba(219,230,214,1)",
      color: "rgba(58,164,9,1)"
    };
  }
}

fetchAndRenderData();


//  My Booking Card : +Add Review and Cancel Booking (open)
document.getElementById("bookingContainer").addEventListener("click", function (e) {
  if (e.target.classList.contains("cancel-booking-btn")) {
    const actionType = e.target.innerText.trim();

    // Handle +Add Review
    if (actionType === "+Add Review") {
      // Only show the modal
      const modal = document.getElementById("addReviewModal");
      if (modal) {
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
      }
      return; // Exit, don't run the rest
    }

    // Handle Cancel Booking
    const allCards = document.querySelectorAll(".A_user_profile_booking_room");
    allCards.forEach(card => {
      card.style.display = "none";
    });

    const clickedCard = e.target.closest(".A_user_profile_booking_room");
    clickedCard.style.display = "flex";

    const statusSpan = clickedCard.querySelector("span");
    if (statusSpan) statusSpan.style.display = "none";

    e.target.style.display = "none";

    // handelCancelBooking(actionType);
  }
});


// // Confirm Cancel click then Booking Cancelled (open)
// document.querySelector(".continue-cancel-btn").addEventListener("click", function () {
//   const cancelSection = document.querySelector(".booking-cancelled-section");
//   const reasonSection = document.querySelector(".cancel-reason-section");

//   if (cancelSection) {
//     cancelSection.classList.remove("d-none"); // show success message
//   }

//   if (reasonSection) {
//     reasonSection.classList.add("d-none"); // hide cancel reason section
//   }
// });



// Step 1: Called when "Cancel Booking" is clicked
function handleCancelBooking(bookingId) {
  currentBookingId = bookingId;

  const reasonBox = document.querySelector(".cancel-reason-section");
  const cancelBox = document.querySelector(".booking-cancelled-section");

  if (reasonBox) {
    reasonBox.classList.remove("d-none");
    reasonBox.classList.add("d-block");
  }

  if (cancelBox) {
    cancelBox.classList.add("d-none");
    cancelBox.classList.remove("d-block");
  }
}

function toggleOtherReasonInput(show) {
  const inputDiv = document.getElementById("otherReasonInput");
  if (show) {
    inputDiv.classList.remove("d-none");
  } else {
    inputDiv.classList.add("d-none");
  }
}

// Step 2: Called when "Confirm Cancel" is clicked
async function saveCancellation(event) {
  event.preventDefault();

  const selectedReason = document.querySelector('input[name="cancelReason"]:checked')?.value;
  let finalReason = selectedReason;

  if (selectedReason === "Others") {
    const customReason = document.getElementById("customReason").value.trim();
    if (!customReason) {
      alert("Please enter a reason in the 'Others' field.");
      return;
    }
    finalReason = customReason;
  }

  try {
    const res = await fetch("http://localhost:3000/createAccount");
    const accounts = await res.json();

    const matchedAccount = accounts.find(acc =>
      acc.MyBooking?.some(b => b.Details?.BookingId === currentBookingId)
    );

    if (!matchedAccount) throw new Error("Account not found");

    const booking = matchedAccount.MyBooking.find(b =>
      b.Details?.BookingId === currentBookingId
    );

    if (!booking) throw new Error("Booking not found");

    // Store the updated data in localStorage
    booking.Details.cancelreason = { reason: finalReason };
    booking.Details.Status = "cancelled"; // Add this line to update status

    const payload = {
      id: matchedAccount.id,
      updatedAccount: matchedAccount
    };

    localStorage.setItem("pendingCancelUpdate", JSON.stringify(payload));
    alert("Cancellation stored locally. Processing...");

    // Call cancelSuccess and delay submission by 5 seconds
    await cancelSuccess();
    setTimeout(submitCancelUpdateFromLocalStorage, 2000);

  } catch (err) {
    console.error("Error:", err.message);
    alert("Error: " + err.message);
  }
}

async function cancelSuccess() {
  const cancelSection = document.querySelector(".booking-cancelled-section");
  const reasonSection = document.querySelector(".cancel-reason-section");

  if (cancelSection) {
    cancelSection.classList.remove("d-none");
    cancelSection.classList.add("d-block");
    console.log("Booking Cancelled section is now visible");
  }

  if (reasonSection) {
    reasonSection.classList.add("d-none");
    reasonSection.classList.remove("d-block");
  }
}

async function submitCancelUpdateFromLocalStorage() {
  const data = localStorage.getItem("pendingCancelUpdate");
  if (!data) return;

  try {
    const { id, updatedAccount } = JSON.parse(data);

    const updateRes = await fetch(`http://localhost:3000/createAccount/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedAccount)
    });

    if (!updateRes.ok) throw new Error("Server update failed");

    alert("Cancellation successfully submitted to server.");
    localStorage.removeItem("pendingCancelUpdate");

    // Re-fetch and re-render data to show updated status
    await fetchAndRenderData();

  } catch (err) {
    console.error("Error while submitting to server:", err.message);
    alert("Error submitting to server: " + err.message);
  }
}


// Invoice Download
document.getElementById("downloadBtn").addEventListener("click", function () {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert("jsPDF failed to load.");
    return;
  }

  const doc = new window.jspdf.jsPDF();

  // Title
  const title = "Reservation Invoice";
  const pageWidth = doc.internal.pageSize.getWidth();
  const titleWidth = doc.getTextWidth(title);
  const titleX = (pageWidth - titleWidth) / 2;

  doc.setFontSize(18);
  doc.text(title, titleX, 20);
  doc.setFontSize(12);
  doc.line(20, 25, 190, 25); 

  let y = 35;
  const spacing = 10;

  function addRow(label, value) {
    doc.text(label + ":", 20, y);
    doc.text(value || "N/A", 90, y);
    y += spacing;
  }

  // ======= Collect modal data =======
  const bookingID = document.getElementById("modal-booking-id")?.innerText.trim() || "N/A";
  const guests = document.getElementById("modal-guests")?.innerText.trim() || "N/A";
  const checkIn = document.getElementById("modal-checkin")?.innerText.trim() || "N/A";
  const checkOut = document.getElementById("modal-checkout")?.innerText.trim() || "N/A";
  const room = document.getElementById("modal-room")?.innerText.trim() || "N/A";
  const location = document.getElementById("modal-location")?.innerText.trim() || "N/A";
  const paymentMethod = document.getElementById("modal-payment-method")?.innerText.trim() || "N/A";
  const tax = document.getElementById("modal-tax")?.innerText.trim().replace("$", "") || "0";
  const total = document.getElementById("modal-total")?.innerText.trim().replace("$", "") || "0";

  const taxNum = parseFloat(tax);
  const totalNum = parseFloat(total);

  // ======= Add to PDF =======
  doc.setFont(undefined, 'bold');
  doc.text("Reservation Details", 20, y);
  doc.setFont(undefined, 'normal');
  y += spacing;

  addRow("Booking ID", bookingID);
  addRow("Guests", guests);
  addRow("Check-In", checkIn);
  addRow("Check-Out", checkOut);
  addRow("Room", room);
  addRow("Location", location);

  y += spacing;
  doc.setFont(undefined, 'bold');
  doc.text("Payment Details", 20, y);
  doc.setFont(undefined, 'normal');
  y += spacing;

  addRow("Payment Method", paymentMethod);
  addRow("Tax", `$${taxNum.toFixed(2)}`);
  addRow("Total Paid (Inc. Tax)", `$${totalNum.toFixed(2)}`);

  doc.save("Reservation_Invoice.pdf");
});
