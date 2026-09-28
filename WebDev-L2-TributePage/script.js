const heroButton = document.querySelector(".hero-button");

heroButton.addEventListener("click", function (event) {
    event.preventDefault();

    const aboutSection = document.querySelector("#about");

    aboutSection.scrollIntoView({
        behavior: "smooth"
    });
});