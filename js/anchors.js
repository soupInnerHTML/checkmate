export function registerAnchors() {
    const anchors = document.querySelectorAll("button[data-anchor]")

    anchors.forEach(anchor => {
        anchor.addEventListener("click", function () {
            const targetElement = document.querySelector(this.dataset.anchor);
            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        });
    })
}