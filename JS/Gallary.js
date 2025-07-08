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









// Darshan Code

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.createElement("div");
    modal.classList.add("image-modal");

    modal.innerHTML = `
        <span class="close-btn">&times;</span>
        <span class="nav-btn left-btn">&#10094;</span>
        <span class="nav-btn right-btn">&#10095;</span>
        <div class="img-wrapper">
            <img src="" alt="Enlarged Image" draggable="false">
        </div>
    `;

    document.body.appendChild(modal);

    const modalImg = modal.querySelector("img");
    const closeBtn = modal.querySelector(".close-btn");
    const leftBtn = modal.querySelector(".left-btn");
    const rightBtn = modal.querySelector(".right-btn");
    const imgWrapper = modal.querySelector(".img-wrapper");

    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;
    let scale = 1;
    let currentIndex = 0;
    const images = Array.from(document.querySelectorAll(".D-memories-img img"));

    function showImage(index) {
        if (index >= 0 && index < images.length) {
            currentIndex = index;
            modalImg.src = images[currentIndex].src;
            resetTransform();
            modal.style.display = "flex";
            document.body.classList.add("modal-open");
        }
    }

    function resetTransform() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    }

    function updateTransform() {
        modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    images.forEach((img, index) => {
        img.addEventListener("click", () => showImage(index));
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
        document.body.classList.remove("modal-open");
    });

    modal.addEventListener("click", e => {
        if (e.target === modal || e.target === imgWrapper) {
            modal.style.display = "none";
            document.body.classList.remove("modal-open");
        }
    });

    // Zoom using mouse wheel
    modalImg.addEventListener("wheel", e => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.1 : -0.1;
        const newScale = Math.min(Math.max(1, scale + delta), 2);
        if (newScale !== scale) {
            scale = newScale;
            updateTransform();
        }
    });

    // Drag / Pan
    modalImg.addEventListener("mousedown", e => {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        modalImg.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", e => {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        modalImg.style.cursor = "grab";
    });

    // Navigation
    leftBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showImage((currentIndex - 1 + images.length) % images.length);
    });

    rightBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showImage((currentIndex + 1) % images.length);
    });

    // Optional: Mobile pinch zoom (experimental)
    let initialDistance = 0;
    imgWrapper.addEventListener("touchstart", (e) => {
        if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            initialDistance = Math.sqrt(dx * dx + dy * dy);
        }
    });

    imgWrapper.addEventListener("touchmove", (e) => {
        if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const newDistance = Math.sqrt(dx * dx + dy * dy);
            const delta = (newDistance - initialDistance) / 200;
            const newScale = Math.min(Math.max(1, scale + delta), 2);
            if (newScale !== scale) {
                scale = newScale;
                updateTransform();
                initialDistance = newDistance;
            }
            e.preventDefault();
        }
    }, { passive: false });
});