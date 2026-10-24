export function initMediaViewer() {
  const dialog = document.getElementById("image-dialog");
  const dialogImage = document.getElementById("dialog-image");
  if (!dialog) return;
  let lastTrigger;
  let previousOverflow;
  document.querySelectorAll(".media-open").forEach((button) =>
    button.addEventListener("click", () => {
      lastTrigger = button;
      dialogImage.src = button.dataset.src;
      document.getElementById("dialog-original").href = button.dataset.src;
      dialogImage.alt =
        button.querySelector("img")?.alt || button.dataset.caption;
      document.getElementById("dialog-caption").textContent =
        button.dataset.caption;
      dialog.classList.toggle(
        "is-portrait",
        button.dataset.layout === "portrait",
      );
      dialog.showModal();
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }),
  );
  dialog
    .querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const { left, right, top, bottom } = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < left ||
        event.clientX > right ||
        event.clientY < top ||
        event.clientY > bottom)
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.style.overflow = previousOverflow;
    lastTrigger?.focus();
  });
  document.querySelectorAll("img").forEach((image) =>
    image.addEventListener(
      "error",
      () => {
        image.alt = "Image unavailable. Please try reloading the page.";
        image
          .closest("button")
          ?.setAttribute("aria-label", "Image unavailable");
      },
      { once: true },
    ),
  );
}
