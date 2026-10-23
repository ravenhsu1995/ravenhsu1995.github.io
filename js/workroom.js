export function initWorkroom(reducedMotion) {
  const canvas = document.getElementById("room-canvas");
  const slider = document.getElementById("room-space");
  if (!canvas || !slider) return;
  let pendingFrame;
  let openingFrame;

  function stopOpening() {
    cancelAnimationFrame(openingFrame);
    canvas.classList.remove("is-opening");
  }
  function arrange() {
    stopOpening();
    cancelAnimationFrame(pendingFrame);
    pendingFrame = requestAnimationFrame(() => {
      canvas.style.setProperty("--room-space", Number(slider.value) / 100);
      slider.setAttribute("aria-valuetext", `${slider.value}% spread`);
    });
  }
  if (!reducedMotion.matches) {
    canvas.style.setProperty("--room-space", "0");
    canvas.classList.add("is-opening");
    openingFrame = requestAnimationFrame(() => {
      openingFrame = requestAnimationFrame(() =>
        canvas.style.setProperty(
          "--room-space",
          String(Number(slider.value) / 100),
        ),
      );
    });
    canvas
      .querySelector(".room-board")
      .addEventListener("transitionend", (event) => {
        if (event.propertyName === "transform") stopOpening();
      });
  }
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) arrange();
  });
  slider.addEventListener("input", arrange);
  document.getElementById("room-reset").addEventListener("click", () => {
    slider.value = "100";
    arrange();
  });
}
