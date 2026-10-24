const projects = {
  garage: {
    src: "img/office-hours-board.webp",
    alt: "NTU Garage live founder board",
    caption: "From arriving alone to finding your people.",
  },
  travel: {
    src: "img/travel-fox-home-portrait.webp",
    alt: "Travel Fox's complete mobile homepage",
    detail: "img/travel-fox-itinerary-portrait.webp",
    detailAlt: "Travel Fox public itinerary, with dates, stops and map links",
    caption: "From my own itinerary to a trip planner friends use.",
  },
  besci: {
    src: "img/besci-concept.webp",
    alt: "BeSci Wiki concepts and source-linked claims",
    caption: "A closed prototype. A knowledge workflow that kept evolving.",
  },
  earlier: {
    src: "img/faa-worldcafe.jpg",
    alt: "Co-designing the intergenerational camp with participants",
    caption: "The work started with people, long before the code.",
  },
};

export function initProjectPreview(reducedMotion) {
  const stage = document.getElementById("project-preview-stage");
  const image = document.getElementById("project-preview-image");
  const detail = document.getElementById("project-preview-detail");
  const caption = document.getElementById("project-preview-caption");
  const links = [...document.querySelectorAll(".project-list [data-project]")];
  if (!stage || !image || !detail || !caption) return;
  const decoded = new Map();
  let request = 0;

  function load(src) {
    if (!decoded.has(src)) {
      const asset = new Image();
      asset.src = src;
      const ready = asset.decode().catch((error) => {
        decoded.delete(src);
        throw error;
      });
      decoded.set(src, ready);
    }
    return decoded.get(src);
  }

  async function preview(link) {
    const key = link.dataset.project;
    const project = projects[key];
    const currentRequest = ++request;
    if (!project || stage.dataset.preview === key) return;
    try {
      // Keep the previous composition intact until every replacement is ready.
      await Promise.all([
        load(project.src),
        ...(project.detail ? [load(project.detail)] : []),
      ]);
    } catch {
      return;
    }
    if (currentRequest !== request) return;
    image.src = project.src;
    image.alt = project.alt;
    detail.hidden = !project.detail;
    if (project.detail) {
      detail.src = project.detail;
      detail.alt = project.detailAlt;
    }
    stage.dataset.preview = key;
    caption.textContent = project.caption;
    links.forEach((item) => {
      item.dataset.previewActive = String(item === link);
    });
    if (!reducedMotion.matches) {
      stage.getAnimations().forEach((animation) => animation.cancel());
      stage.animate(
        [
          { opacity: 0.4, transform: "translateY(6px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 220, easing: "ease-out" },
      );
    }
  }

  links.forEach((link) => {
    link.addEventListener("pointerenter", () => preview(link));
    link.addEventListener("focus", () => preview(link));
  });
}
