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


// Restaurent Menu button active class applied

 document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".x_category_btn");

    buttons.forEach(button => {
      button.addEventListener("click", function () {
        buttons.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
      });
    });
  });

