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


// Send data to the json server
async function sendData(e) {
    e.preventDefault();
    const form = e.target;

    const contactData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        mobile: form.mobile.value.trim(),
        subject: form.subject.value.trim(),
        message: form.message.value.trim(),
        countryCode: form.countryCode.value
    };

    if (!contactData.name || !contactData.email || !contactData.mobile || !contactData.subject || !contactData.message) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/ContactUS", {
            method: "POST",
            body: JSON.stringify(contactData)
        });

        if (response.ok) {
            alert("!! Form submitted !!");
            form.reset();
        } 

    } catch (error) {
        console.log("Error:", error);
    }
}


