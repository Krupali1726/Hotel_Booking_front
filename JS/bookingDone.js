// Get details of booking
async function bookingDetails() {

    try {

        let loggedEmail = localStorage.getItem("logedInUserMail");

        let thankYouUser = document.getElementById("thankYouName")
        let BookingId = document.getElementById("bookingID")
        let UserName = document.getElementById("bookedUserName")
        let MobileNumber = document.getElementById("bookedContact")
        let Email = document.getElementById("bookedEmail")
        let TotalPerson = document.getElementById("bookedAdults")
        let BookingDate = document.getElementById("bookedDate")

        let totalAmount = document.getElementById("totalAmount")
        let PaymentMethod = document.getElementById("PaymentMethod")
        let confirmationMail = document.getElementById("confirmMail")



        const response = await fetch("http://localhost:3000/createAccount")
        const account_data = await response.json();

        const findUSer = account_data.find(data =>
            data.Email_id == loggedEmail
        );

        if (findUSer) {

            let userId = findUSer.id;

            const data = await fetch(`http://localhost:3000/createAccount/${userId}`);
            const userData = await data.json();

            // console.log("User data ::: ", userData);

            const myBookings = userData.MyBooking;

            if (myBookings && myBookings.length > 0) {

                const lastBooking = myBookings[myBookings.length - 1];
                const bookingDetails = lastBooking.Details;

                // console.log("Last Booking Details:", bookingDetails);

                BookingId.innerHTML = bookingDetails.BookingId;

                let fullNameOfUser = bookingDetails.firstName + " " + bookingDetails.lastName;
                UserName.innerHTML = fullNameOfUser;
                thankYouUser.innerHTML = `Thank you for your reservation, ${fullNameOfUser} !`

                let fullMoNo = bookingDetails.CountryCode + " " + bookingDetails.MobileNumber;
                MobileNumber.innerHTML = fullMoNo;

                Email.innerHTML = bookingDetails.Email;

                TotalPerson.innerHTML = ` ${bookingDetails.TotalGuest} Adults , ${bookingDetails.TotalChild} Child `
                BookingDate.innerHTML = bookingDetails.BookedDate;

                totalAmount.innerHTML = bookingDetails.TotalPaid;
                PaymentMethod.innerHTML = bookingDetails.PaymentMethod

                confirmationMail.innerHTML = bookingDetails.Email;

            }
        }


    }
    catch (error) {
        console.log("Error :: ", error);
    }

}

bookingDetails()


// ***********  Download Invoice  ************
document.getElementById("downloadBtn").addEventListener("click", function () {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert("jsPDF failed to load.");
    return;
  }

  const doc = new window.jspdf.jsPDF();

  const bookingID = document.getElementById("bookingID").innerText.trim();
  const userName = document.getElementById("bookedUserName").innerText.trim();
  const contactNo = document.getElementById("bookedContact").innerText.trim();
  const email = document.getElementById("bookedEmail").innerText.trim();
  const guests = document.getElementById("bookedAdults").innerText.trim();
  const bookedDate = document.getElementById("bookedDate").innerText.trim();
  const totalAmount = document.getElementById("totalAmount")?.innerText.trim() || "$0";
  const paymentMethod = document.getElementById("PaymentMethod")?.innerText.trim() || "Not Specified";

  // ===== Function to Render Title =====
  function renderTitle(doc, title) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, 25);
    doc.setLineWidth(0.5);
    doc.line(20, 30, 190, 30);
  }

  // ===== Function to Add a Row =====
  function addRow(label, value) {
    doc.text(label + ":", 25, y);
    doc.text(value || "N/A", 80, y);
    y += spacing;
  }

  // Title
  renderTitle(doc, "Invoice");

  // Reset font for body
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  // Section: Reservation Details
  let y = 40;  // Spacing below title
  const spacing = 8;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Reservation Details", 18, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  y += 8;

  addRow("Booking ID", bookingID);
  addRow("Name", userName);
  addRow("Contact No", contactNo);
  addRow("Email", email);
  addRow("Guests", guests);
  addRow("Date", bookedDate);

  // Section: Payment Summary
  y += 10;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Payment Details", 18, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  y += 8;

  addRow("Total Amount Paid", totalAmount);
  addRow("Payment Method", paymentMethod);

  // Save PDF
  doc.save("Reservation_Invoice.pdf");
});


//   ******** Cancel Booking ********
 function cancelBooking(){
   window.location.href = "profile.html";
}