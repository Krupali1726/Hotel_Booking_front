
// 1 Offcanvas Sidebar -> Filter Price Slider -> 5
document.addEventListener("DOMContentLoaded", () => {
    const minSlider = document.getElementById("minSlider");
    const maxSlider = document.getElementById("maxSlider");
    const track = document.getElementById("track");
    const minPrice = document.getElementById("minPrice");
    const maxPrice = document.getElementById("maxPrice");

    window.updateTrack = function () {
        const min = parseInt(minSlider.min);
        const max = parseInt(minSlider.max);

        let minVal = parseInt(minSlider.value);
        let maxVal = parseInt(maxSlider.value);

        if (minVal > maxVal) {
            [minVal, maxVal] = [maxVal, minVal];
        }

        const percentMin = ((minVal - min) / (max - min)) * 100;
        const percentMax = ((maxVal - min) / (max - min)) * 100;

        track.style.left = percentMin + "%";
        track.style.width = (percentMax - percentMin) + "%";

        minPrice.textContent = `$${minVal.toLocaleString()}`;
        maxPrice.textContent = `$${maxVal.toLocaleString()}`;
    };


    minSlider.addEventListener("input", updateTrack);
    maxSlider.addEventListener("input", updateTrack);

    window.addEventListener("load", updateTrack);


    // 2. Show newsletter modal on load
    const newsletterModal = new bootstrap.Modal(document.getElementById('newsletterModal'));
    newsletterModal.show();


    // 3. Verify OTP Modal
    document.addEventListener("DOMContentLoaded", () => {
        const inputs = document.querySelectorAll(".mb-otp-mobile-box");

        inputs.forEach((input, index) => {
            input.addEventListener("input", () => {
                if (input.value.length === 1 && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Backspace" && input.value === "" && index > 0) {
                    inputs[index - 1].focus();
                }
            });
        });
    });

});


// 3 Sign in & 4 Create Account & 8 Reset Password -> PasswordInput
function togglePassword(elem) {
    const input = elem.parentElement.querySelector('input');
    const icon = elem.querySelector('i');
    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    }
}

