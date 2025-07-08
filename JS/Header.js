
// **************** Keyur ****************
        document.getElementById("navbarToggle").addEventListener("click", function () {
            const mobileNav = document.getElementById("mobileNav");
            if (mobileNav.style.display === "none" || mobileNav.style.display === "") {
                mobileNav.style.display = "block";
            } else {
                mobileNav.style.display = "none";
            }
        });

        document.querySelectorAll('.k-diming ul li a').forEach(link => {
            link.addEventListener('click', function () {
                document.querySelectorAll('.k-diming ul li a').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });

// ************************* Ravi ************************************+

// ********* Country Code : create account ********* 
// document.addEventListener('DOMContentLoaded', () => {
    const Country = document.getElementById("countryCode");
  // Country :: default selected value
  let countryCode = Country.value;
  // Country :: Update value on changes
  Country.addEventListener("change", function () {
    countryCode = Country.value;
});

// })

// Create Account : Send Data json Server
  // async function craeteAccount() {

  //   try {

  //     let FullName = document.getElementById('createAcFullName').value
  //     let NumberOnly = document.getElementById('createAcMobileNum').value
  //     let MobileNumber = countryCode + NumberOnly
  //     let Email = document.getElementById('createAcEmail').value
  //     let Password = document.getElementById('createAcPassword').value;
  //     let craeteAccount_Id = Math.floor(Math.random() * 10000);


  //     const resposne = await fetch('http://localhost:3000/createAccount');
  //     const account_All_Data = await resposne.json();
  //     console.log(" Create Account all data ::: ", account_All_Data);

  //     const foundAccount = account_All_Data.find(created_Account =>
  //       created_Account.Email_id === Email
  //     );


  //     if (foundAccount) {
  //       alert("!! You have already created an account with this email !!")
  //       localStorage.setItem('createAccount', 'true');
  //       window.location.reload();
  //     }
  //     else {
  //       alert("Your account created. Sign in now")
  //       localStorage.setItem('showModalSignIn', 'true');
  //       window.location.reload();

  //       const resposne = await fetch('http://localhost:3000/createAccount', {
  //         method: "POST",
  //         body: JSON.stringify({ AccountId: craeteAccount_Id, FullName: FullName, MobileNumber: MobileNumber, Email_id: Email, Password: Password ,saved_cards: []  })
  //       });

  //     }


  //   }
  //   catch (error) {
  //     console.log("Error :: ", error);
  //   }

  // }

async function createAccount(event) {
  event.preventDefault()
  try {
    let FullName = document.getElementById('createAcFullName').value;
    let NumberOnly = document.getElementById('createAcMobileNum').value;
    let countryCode = document.getElementById("countryCode").value;
    let Email = document.getElementById('createAcEmail').value;
    let Password = document.getElementById('createAcPassword').value;
    let craeteAccount_Id = Math.floor(Math.random() * 10000);

    const response = await fetch('http://localhost:3000/createAccount');
    const account_All_Data = await response.json();
    console.log("Create Account all data :::", account_All_Data);

    // Check account already exists
    const foundAccount = account_All_Data.find(created_Account =>
      created_Account.Email_id === Email
    );

    if (foundAccount) {
      alert("!! You have already created an account with this email !!");
      localStorage.setItem('createAccount', 'true');
      window.location.reload();
    } else {
      await fetch('http://localhost:3000/createAccount', {
        method: "POST",
        body: JSON.stringify({
          AccountId: craeteAccount_Id,
          FullName: FullName,
          Country_code: countryCode,
          MobileNumber: NumberOnly,
          Email_id: Email,
          Password: Password,
          DOB: "",
          Gender: "",
          saved_cards: [],
          User_Image: "./IMAGE/user.png",
          MyBooking : []
        })
      });

      localStorage.setItem("logedInUserMail", Email);
      alert("Your account has been created");
      // localStorage.setItem('showModalSignIn', 'true');
      // window.location.reload();
    }

  } catch (error) {
    console.log("Error :: ", error);
  }
}



// Sign In
async function signIn() {

  try {
    let Email = document.getElementById("signInEmail").value
    let Password = document.getElementById("signInPassword").value

    const resposne = await fetch('http://localhost:3000/createAccount');

    const account_All_Data = await resposne.json();
    console.log(" Create Account all data ::: ", account_All_Data);


    const foundAccount = account_All_Data.find(created_Account =>
      created_Account.Email_id === Email && created_Account.Password === Password
    );

    if (foundAccount) {
      localStorage.setItem("logedInUserMail", Email);
      alert("Login successful");
    } else {
      alert("Account not found !!!!! Please check your credentials");
      localStorage.setItem('showModalSignIn', 'true');
      window.location.reload();
    }
  }
  catch (error) {
    console.log("Error :: ", error);
  }

}



// ******* OTP Modal Show **********
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('forget-password');
  const verifyOtpModalEl = document.getElementById('verifyotpModal');
  const forgotPasswordModalEl = document.getElementById('forgotpasswordModal');

  let verifyOtpModal = bootstrap.Modal.getOrCreateInstance(verifyOtpModalEl);
  let forgotPasswordModal = bootstrap.Modal.getOrCreateInstance(forgotPasswordModalEl);

  form.onsubmit = async function (event) {
    event.preventDefault();
    await forgotPassword(forgotPasswordModal, verifyOtpModal);
  };
});

// Forgot Password
async function forgotPassword(forgotPasswordModal, verifyOtpModal) {

  try {

    let email = document.getElementById('mailForgetPassword').value
    // Stored In LocalStorage 
    localStorage.setItem("forgotPasswordEmail", email);

    const resposne = await fetch('http://localhost:3000/createAccount');
    const account_All_Data = await resposne.json();

    const find_mail = account_All_Data.find(created_Account =>
      created_Account.Email_id === email
    );

    if (find_mail) {
      forgotPasswordModal.hide();
      verifyOtpModal.show();

      sendOtp();
    }
    else {
      alert(" Email Not Found !!!");
    }

  }
  catch (error) {
    console.log("Error :: ", error);
  }

}

// email id show in otp modal 
document.getElementById("sendedMailId").innerHTML = localStorage.getItem("forgotPasswordEmail");

// Send otp 
async function sendOtp() {

  try {


    let sentMailOtp = localStorage.getItem("forgotPasswordEmail");
    let OTP_No = Math.floor(Math.random() * 10000)
    let otpId = Math.floor(Math.random() * 100000)


    const resposne = await fetch('http://localhost:3000/OTP');
    const OTP_Data = await resposne.json();

    const find_mail = OTP_Data.find(otp =>
      otp.Mail === sentMailOtp
    );

    if (find_mail) {

      const userId = find_mail.id;
      const res = await fetch(`http://localhost:3000/OTP/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ OTP_NO: OTP_No })
      });
      localStorage.setItem('showModalOTP', 'true');
      window.location.reload();
    }
    else {

      const resposne = await fetch('http://localhost:3000/OTP', {
        method: "POST",
        body: JSON.stringify({ OTP_ID: otpId, Mail: sentMailOtp, OTP_NO: OTP_No })
      });
      localStorage.setItem('showModalOTP', 'true');
      window.location.reload();

    }

  }
  catch (error) {
    console.log("Error :: ", error);
  }

}

// Resend OTP
async function resendOtp() {
  try {
    let sendedOTP = localStorage.getItem("forgotPasswordEmail");
    let OTP_Num = Math.floor(Math.random() * 10000);

    const resposne = await fetch('http://localhost:3000/OTP');
    const Otp_data = await resposne.json();

    const find_mail = Otp_data.find(otp =>
      otp.Mail === sendedOTP
    );


    if (find_mail) {
      const userId = find_mail.id;
      const res = await fetch(`http://localhost:3000/OTP/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ OTP_NO: OTP_Num })
      });

      if (res.ok) {
        alert("OTP Resent Successfully!");
        localStorage.setItem('showModalOTP', 'true');
        window.location.reload();
      } else {
        alert("Failed to resend OTP");
      }

    }

  } catch (error) {
    console.error("Resend OTP failed:", error);
  }
}

// Reset Password Modal Open 
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('verify-otp-form');
  const resetPwdModaled = document.getElementById('resetpasswordModal');
  const verifyOtpModaled = document.getElementById('verifyotpModal');

  let verifyOtpModal = bootstrap.Modal.getOrCreateInstance(verifyOtpModaled);
  let resetPwdModal = bootstrap.Modal.getOrCreateInstance(resetPwdModaled);

  form.onsubmit = async function (event) {
    event.preventDefault();

    // Hide all modals first
    document.querySelectorAll('.modal.show').forEach(modal => {
      let modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    });

    //reset password modal
    resetPwdModal.show();

  };

});

// Reset Password 
async function resetPwd(event) {

  event.preventDefault();

  let newPwd = document.getElementById('newPassword').value
  let confirmPwd = document.getElementById('confirmPassword').value
  let emailPwd = localStorage.getItem("forgotPasswordEmail");

  if (newPwd === confirmPwd) {

    try {

      const resposne = await fetch('http://localhost:3000/createAccount');
      const account_All_Data = await resposne.json();

      const find_mail = account_All_Data.find(created_Account =>
        created_Account.Email_id === emailPwd
      );


      if (find_mail) {
        alert("Password Reset Successfully !! ")
        const userId = find_mail.id;  
        const res = await fetch(`http://localhost:3000/createAccount/${userId}`, {
          method: "PATCH",
          body: JSON.stringify({ Password: confirmPwd })
        });

      }
    } catch (error) {
      console.error("Error:", error);
    }

  } else {
    alert(" !!! New Password and Confirm Password Not Same !!!")
    localStorage.setItem('resetPassword', 'true');
    window.location.reload();
  }

}


// Modal Show (If Page Refreshed)

function signInModal() {
  let sModal = new bootstrap.Modal(document.getElementById('signinModal'));
  sModal.show();
}
function createAcmodal() {
  let createAcModal = new bootstrap.Modal(document.getElementById('createAccountModal'));
  createAcModal.show();
}
function otpModal() {
  let otp = new bootstrap.Modal(document.getElementById('verifyotpModal'));
  otp.show();
}
function resetPwdModal() {
  let reset = new bootstrap.Modal(document.getElementById('resetpasswordModal'));
  reset.show();
}

document.addEventListener('DOMContentLoaded', function () {
  // Sign In Modal 
  if (localStorage.getItem('showModalSignIn') === 'true') {
    localStorage.removeItem('showModalSignIn');
    signInModal();
  }
  // Create account Modal 
  if (localStorage.getItem('createAccount') === 'true') {
    localStorage.removeItem('createAccount');
    createAcmodal();
  }
  // OTP Modal 
  if (localStorage.getItem('showModalOTP') === 'true') {
    localStorage.removeItem('showModalOTP');
    otpModal();
  }
  // Reset Password Modal 
  if (localStorage.getItem('resetPassword') === 'true') {
    localStorage.removeItem('resetPassword');
    resetPwdModal();
  }
});




