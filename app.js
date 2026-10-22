(() => {
  "use strict";
  const root = document.documentElement;
  const themeButton = document.getElementById("theme-toggle");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const isDark = () =>
    root.dataset.theme ? root.dataset.theme === "dark" : systemTheme.matches;
  function syncTheme() {
    themeButton.textContent = isDark() ? "Light" : "Dark";
    themeButton.setAttribute(
      "aria-label",
      `Switch to ${isDark() ? "light" : "dark"} theme`,
    );
  }
  themeButton.addEventListener("click", () => {
    root.dataset.theme = isDark() ? "light" : "dark";
    try {
      localStorage.setItem("raven-theme", root.dataset.theme);
    } catch (_) {}
    syncTheme();
  });
  systemTheme.addEventListener("change", syncTheme);
  syncTheme();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!reducedMotion.matches && "IntersectionObserver" in window) {
    root.classList.add("js-motion");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(".reveal")
      .forEach((element) => observer.observe(element));
    reducedMotion.addEventListener("change", (event) => {
      if (event.matches) root.classList.remove("js-motion");
    });
  }
  const views = {
    board: {
      src: "img/office-hours-board.webp",
      mode: "board",
      kicker: "A shared surface",
      title: "Make it easier to find each other.",
      description:
        "Founders post what they’re looking for from their phones. The room sees a live board of potential collaborators, product trials and shared resources.",
      alt: "The public Quest Board, displaying fictional posts seeking collaborators and product testers",
      caption:
        "The live Quest Board. Production interface rendered with fictional demo posts.",
    },
    checkin: {
      src: "img/office-hours-checkin.webp",
      mode: "phone",
      kicker: "A simple entrance",
      title: "Arrive with a question.",
      description:
        "A QR code opens a mobile check-in. Returning visitors can be recognized across sessions, while the team tracks stages, needs and feedback with consent.",
      alt: "The actual mobile check-in interface, asking for a name or email, with no attendee data shown",
      caption:
        "The mobile check-in interface, rendered in an isolated demo environment.",
    },
    quests: {
      src: "img/office-hours-quests.webp",
      mode: "quests",
      kicker: "Two ways to participate",
      title: "Find a partner. Ask for help.",
      description:
        "The Quest Board is for public connections. The question box keeps a question anonymous to the room while letting the host know who needs support.",
      alt: "The attendee interface showing the Guild Master’s Mailbox and Quest Board posting form",
      caption:
        "The actual attendee interface after check-in. Fictional demo data; the full form can be inspected here.",
    },
  };
  const tabs = [...document.querySelectorAll("[data-view]")];
  const galleryButton = document.getElementById("experience-image");
  const galleryImage = document.getElementById("gallery-image");
  function selectView(button, focus = false) {
    const view = views[button.dataset.view];
    tabs.forEach((tab) => {
      const selected = tab === button;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    if (focus) button.focus();
    galleryButton.dataset.mode = view.mode;
    galleryButton.dataset.src = view.src;
    galleryButton.dataset.caption = view.caption;
    galleryImage.src = view.src;
    galleryImage.alt = view.alt;
    document
      .getElementById("experience-panel")
      .setAttribute("aria-labelledby", button.id);
    document.getElementById("gallery-kicker").textContent = view.kicker;
    document.getElementById("gallery-title").textContent = view.title;
    document.getElementById("gallery-description").textContent =
      view.description;
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectView(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft")
        next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        selectView(tabs[next], true);
      }
    });
  });
  document.querySelectorAll("[data-model]").forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelectorAll("[data-model]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      const imagery = button.dataset.model === "imagery";
      document.getElementById("model-value").innerHTML = imagery
        ? "13.73<span>%</span>"
        : "13.15<span>%</span>";
      document.getElementById("model-reading").textContent = imagery
        ? "Adding imagery increased the error by 0.58 percentage points."
        : "The baseline model. Lower error is better.";
    }),
  );
  const dialog = document.getElementById("image-dialog");
  const dialogImage = document.getElementById("dialog-image");
  let lastTrigger;
  document.querySelectorAll(".media-open").forEach((button) =>
    button.addEventListener("click", () => {
      lastTrigger = button;
      dialogImage.src = button.dataset.src;
      dialogImage.alt =
        button.querySelector("img")?.alt || button.dataset.caption;
      document.getElementById("dialog-caption").textContent =
        button.dataset.caption;
      dialog.classList.toggle(
        "is-portrait",
        /office-hours-(quests|checkin)/.test(button.dataset.src),
      );
      dialog.showModal();
      document.body.style.overflow = "hidden";
    }),
  );
  dialog
    .querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.style.overflow = "";
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
})();
