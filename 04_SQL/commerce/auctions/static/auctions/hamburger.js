document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".navbar-nav");
    const listings = document.querySelectorAll(".card");
    
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("open");
        listings.forEach(listing => {
            listing.classList.toggle("open");
        });
    });

});