// Decoded images are shared so a view selected again appears at once.
const decoded = new Map();

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

// Galleries own their request order so fast selection cannot show stale media.
export function initArtifactGalleries() {
  const galleries = [...document.querySelectorAll("[data-artifact-gallery]")];
  const preload = (gallery) =>
    gallery
      .querySelectorAll("[data-artifact-src]")
      .forEach((button) => load(button.dataset.artifactSrc).catch(() => {}));

  if (typeof IntersectionObserver === "function") {
    // Fetch a gallery's other views while it scrolls into reach.
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          preload(entry.target);
          observer.unobserve(entry.target);
        }),
      { rootMargin: "600px 0px" },
    );
    galleries.forEach((gallery) => observer.observe(gallery));
  }

  galleries.forEach((gallery) => {
    const buttons = [...gallery.querySelectorAll("[data-artifact-src]")];
    const trigger = gallery.querySelector(".media-open");
    const image = trigger.querySelector("img");
    const caption = gallery.querySelector("p[data-artifact-caption]");
    const counter = gallery.querySelector("[data-artifact-count]");
    let request = 0;
    buttons.forEach((button) => {
      button.addEventListener("pointerenter", () => preload(gallery), {
        once: true,
      });
      button.addEventListener("click", async () => {
        const current = ++request;
        // The choice registers at once; the image follows when decoded.
        buttons.forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
        if (counter) {
          counter.textContent = `${String(buttons.indexOf(button) + 1).padStart(2, "0")} / ${String(buttons.length).padStart(2, "0")}`;
        }
        const src = button.dataset.artifactSrc;
        try {
          await load(src);
        } catch {
          if (current === request) {
            caption.textContent =
              "Image unavailable. Select this view to try again.";
          }
          return;
        }
        if (current !== request) return;
        image.src = src;
        image.alt = button.dataset.artifactCaption;
        trigger.dataset.src = src;
        trigger.dataset.caption = button.dataset.artifactCaption;
        caption.textContent = button.dataset.artifactCaption;
      });
    });
  });
  document.querySelectorAll(".product-live").forEach((disclosure) => {
    const frame = disclosure.querySelector("iframe");
    disclosure.addEventListener("toggle", () => {
      if (disclosure.open) frame.src = frame.dataset.liveSrc;
      else frame.removeAttribute("src");
    });
  });
}
