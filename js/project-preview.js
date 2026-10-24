export function initProjectPreview(reducedMotion) {
  const image = document.getElementById("project-preview-image");
  const caption = document.getElementById("project-preview-caption");
  if (!image || !caption) return;
  const projects = {
    garage: [
      "img/office-hours-board.webp",
      "NTU Garage live founder board",
      "From arriving alone to finding your people.",
    ],
    besci: [
      "img/besci-concept.webp",
      "BeSci Wiki concepts and source-linked claims",
      "A closed prototype. A knowledge workflow that kept evolving.",
    ],
    travel: [
      "img/travel-fox-home.webp",
      "Travel Fox homepage and public Kansai trip",
      "From my own itinerary to a trip planner friends use.",
    ],
    earlier: [
      "img/faa-worldcafe.jpg",
      "Co-designing the intergenerational camp with participants",
      "The work started with people, long before the code.",
    ],
  };
  document.querySelectorAll("[data-project]").forEach((link) => {
    function preview() {
      const [src, alt, text] = projects[link.dataset.project];
      if (image.getAttribute("src") === src) return;
      image.src = src;
      image.alt = alt;
      caption.textContent = text;
      if (!reducedMotion.matches) {
        image.getAnimations().forEach((animation) => animation.cancel());
        image.animate(
          [
            { opacity: 0, transform: "translateY(12px) scale(.97)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 350, easing: "cubic-bezier(.2,.7,.2,1)" },
        );
      }
    }
    link.addEventListener("pointerenter", preview);
    link.addEventListener("focus", preview);
  });
}
