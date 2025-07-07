//Js for counter

document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".count");

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute("data-target");
            const count = +counter.innerText;
            const speed = 500; // Lower number = faster count
            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 10); // Adjust timing for smooth animation
            } else {
                counter.innerText = target;
            }
        };

        updateCount();
    });
});


window.addEventListener('load', () => {
    const progressBars = document.querySelectorAll('.progress');
    
    progressBars.forEach((bar) => {
        const width = bar.style.width; // Get the width set in inline styles
        bar.style.width = '0%'; // Start from 0%
        
        setTimeout(() => {
            bar.style.width = width; // Animate to the target width
        }, 500); // Delay the animation for smooth effect
    });
});


//sidebar navigation
document.addEventListener("DOMContentLoaded", () => {
    const hamburgerMenu = document.getElementById("hamburger-menu");
    const mobileNav = document.getElementById("mobile-nav");
    const overlay = document.getElementById("overlay");
    const closeBtn = document.getElementById("close-btn");

    const openMobileNav = () => {
        mobileNav.style.left = "0";
        overlay.classList.add("active");
    };

    const closeMobileNav = () => {
        mobileNav.style.left = "-100%";
        overlay.classList.remove("active");
    };

    hamburgerMenu.addEventListener("click", openMobileNav);
    closeBtn.addEventListener("click", closeMobileNav);
    overlay.addEventListener("click", closeMobileNav);
});
