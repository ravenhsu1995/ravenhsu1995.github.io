export function initMotion(reducedMotion, frames) {
  const root = document.documentElement;
  const buttons = [...document.querySelectorAll(".motion-toggle")];
  const visibility = new WeakMap();
  let userPaused = false;

  function sync() {
    const paused = userPaused || reducedMotion.matches;
    buttons.forEach((button) => {
      button.textContent = reducedMotion.matches
        ? "Reduced motion"
        : paused
          ? "Resume motion"
          : "Pause motion";
      button.disabled = reducedMotion.matches;
      button.setAttribute("aria-pressed", String(paused));
    });
    frames.forEach((frame) =>
      frame.contentWindow?.postMessage(
        {
          type: "portfolio-motion",
          paused: paused || document.hidden || visibility.get(frame) === false,
        },
        location.origin,
      ),
    );
  }

  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      userPaused = !userPaused;
      sync();
    }),
  );
  frames.forEach((frame) => frame.addEventListener("load", sync));
  document.addEventListener("visibilitychange", sync);
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) root.classList.remove("js-motion");
    sync();
  });

  if ("IntersectionObserver" in window) {
    const frameObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) =>
        visibility.set(entry.target, entry.isIntersecting),
      );
      sync();
    });
    frames.forEach((frame) => frameObserver.observe(frame));

    if (!reducedMotion.matches) {
      root.classList.add("js-motion");
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.08 },
      );
      document
        .querySelectorAll(".reveal")
        .forEach((element) => revealObserver.observe(element));
    }
  }
  sync();
}
