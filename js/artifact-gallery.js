// Galleries own their request order so fast selection cannot show stale media.
export function initArtifactGalleries() {
  document.querySelectorAll("[data-artifact-gallery]").forEach((gallery) => {
    const buttons = [...gallery.querySelectorAll("[data-artifact-src]")];
    const trigger = gallery.querySelector(".media-open");
    const image = trigger.querySelector("img");
    const caption = gallery.querySelector("p[data-artifact-caption]");
    const counter = gallery.querySelector("[data-artifact-count]");
    let request = 0;
    buttons.forEach((button) => {
      button.addEventListener("click", async () => {
        const current = ++request;
        const asset = new Image();
        asset.src = button.dataset.artifactSrc;
        try {
          await asset.decode();
        } catch {
          if (current === request) {
            caption.textContent =
              "Image unavailable. Select this view to try again.";
          }
          return;
        }
        if (current !== request) return;
        image.src = asset.src;
        image.alt = button.dataset.artifactCaption;
        trigger.dataset.src = asset.src;
        trigger.dataset.caption = button.dataset.artifactCaption;
        caption.textContent = button.dataset.artifactCaption;
        if (counter) {
          counter.textContent = `${String(buttons.indexOf(button) + 1).padStart(2, "0")} / ${String(buttons.length).padStart(2, "0")}`;
        }
        buttons.forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
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
