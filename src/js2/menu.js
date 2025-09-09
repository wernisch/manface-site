const toggle = document.getElementById("mobile-menu-toggle");
const menu = document.getElementById("mobile-menu");

toggle.addEventListener("click", () => {
    const isHidden = menu.classList.contains("hidden");

    if (isHidden) {
        menu.classList.remove("hidden");
        requestAnimationFrame(() => {
            menu.classList.remove("opacity-0", "scale-95");
            menu.classList.add("opacity-100", "scale-100");
        });
    } else {
        menu.classList.remove("opacity-100", "scale-100");
        menu.classList.add("opacity-0", "scale-95");

        setTimeout(() => {
            menu.classList.add("hidden");
        }, 300);
    }
});