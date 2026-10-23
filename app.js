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
      scene: "board",
      mode: "board",
      kicker: "A room in motion",
      title: "Make it easier to find each other.",
      description:
        "Two streams of founder posts move in opposite directions. Read the requests, pause the board, or switch to an anonymous question.",
    },
    checkin: {
      scene: "arrival",
      mode: "phone",
      kicker: "From check-in to conversation",
      title: "Pick a card. Find your people.",
      description:
        "Try the three-step arrival: choose a field card, meet the check-in cat, then learn how to join the room. Use the buttons inside the phone to continue.",
    },
    quests: {
      scene: "quests",
      mode: "phone",
      kicker: "Two ways to participate",
      title: "Find a partner. Ask for help.",
      description:
        "Explore the public Quest Board form and private question box. You can type and try the controls; this demo keeps everything in memory.",
    },
    featured: {
      scene: "featured",
      mode: "board",
      kicker: "One question. The whole room.",
      title: "Give a difficult question space.",
      description:
        "The host can replace the flowing board with a single anonymous question, giving the whole room a shared problem to work on.",
    },
  };
  const tabs = [...document.querySelectorAll("[data-view]")];
  const galleryStage = document.getElementById("experience-image");
  const demo = document.getElementById("experience-demo");
  let motionPaused = reducedMotion.matches;
  const frameVisibility = new WeakMap();
  function syncMotion() {
    document.querySelectorAll(".motion-toggle").forEach((button) => {
      button.textContent = motionPaused ? "Resume motion" : "Pause motion";
      button.setAttribute("aria-pressed", String(motionPaused));
    });
    document.querySelectorAll("iframe").forEach((frame) =>
      frame.contentWindow?.postMessage(
        {
          type: "portfolio-motion",
          paused:
            motionPaused ||
            document.hidden ||
            frameVisibility.get(frame) === false,
        },
        location.origin,
      ),
    );
  }
  document.querySelectorAll(".motion-toggle").forEach((button) =>
    button.addEventListener("click", () => {
      motionPaused = !motionPaused;
      syncMotion();
    }),
  );
  document
    .querySelectorAll("iframe")
    .forEach((frame) => frame.addEventListener("load", syncMotion));
  reducedMotion.addEventListener("change", (event) => {
    motionPaused = event.matches;
    syncMotion();
  });
  syncMotion();
  if ("IntersectionObserver" in window) {
    const frameObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) =>
        frameVisibility.set(entry.target, entry.isIntersecting),
      );
      syncMotion();
    });
    document
      .querySelectorAll("iframe")
      .forEach((frame) => frameObserver.observe(frame));
  }
  document.addEventListener("visibilitychange", syncMotion);
  let demoPosts = [];
  let demoQuestion = "";
  function syncDemoState() {
    document.querySelectorAll("iframe").forEach((frame) =>
      frame.contentWindow?.postMessage(
        {
          type: "portfolio-demo-state",
          posts: demoPosts,
          question: demoQuestion,
        },
        location.origin,
      ),
    );
  }
  window.addEventListener("message", (event) => {
    const frames = [...document.querySelectorAll("iframe")];
    if (
      event.origin !== location.origin ||
      !frames.some((frame) => frame.contentWindow === event.source) ||
      event.data?.type !== "portfolio-demo-post"
    )
      return;
    const body =
      typeof event.data.body === "string" ? event.data.body.slice(0, 300) : "";
    if (!body.trim()) return;
    if (event.data.kind === "mailbox") demoQuestion = body;
    else if (event.data.kind === "exchange") {
      demoPosts = [
        {
          id: `visitor-${Date.now()}`,
          name: "Demo Visitor",
          teamName: "Demo",
          category: event.data.category || "resource",
          body,
          url: null,
          createdAt: new Date().toISOString(),
        },
        ...demoPosts,
      ].slice(0, 5);
    }
    if (event.data.kind === "exchange" || event.data.kind === "mailbox") {
      const feedback = document.getElementById("demo-feedback");
      const followup = document.getElementById("demo-followup");
      feedback.hidden = false;
      followup.dataset.target =
        event.data.kind === "mailbox" ? "featured" : "board";
      document.getElementById("demo-feedback-text").textContent =
        event.data.kind === "mailbox"
          ? "Your demo question is ready to appear anonymously."
          : "Your demo post is now part of the shared board.";
    }
    syncDemoState();
  });
  document
    .querySelectorAll("iframe")
    .forEach((frame) => frame.addEventListener("load", syncDemoState));

  function selectView(button, focus = false) {
    const view = views[button.dataset.view];
    tabs.forEach((tab) => {
      const selected = tab === button;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    if (focus) button.focus();
    galleryStage.dataset.mode = view.mode;
    demo.src = `demo/index.html?view=${view.scene}`;
    demo.title = `Interactive ${view.scene} demo with fictional data`;
    document.getElementById("demo-open").href = demo.src;
    document
      .getElementById("experience-panel")
      .setAttribute("aria-labelledby", button.id);
    document.getElementById("gallery-kicker").textContent = view.kicker;
    document.getElementById("gallery-title").textContent = view.title;
    document.getElementById("gallery-description").textContent =
      view.description;
  }
  document
    .getElementById("demo-followup")
    .addEventListener("click", (event) => {
      const target = event.currentTarget.dataset.target;
      const tab = tabs.find((item) => item.dataset.view === target);
      if (tab) selectView(tab, true);
      document.getElementById("demo-feedback").hidden = true;
    });
  document.getElementById("demo-restart").addEventListener("click", () => {
    demo.src = demo.src;
  });
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
  const besciViews = {
    overview: {
      file: "overview",
      alt: "BeSci Wiki overview showing the full navigation, corpus totals and review-state breakdown",
      caption:
        "The corpus at a glance. Review states distinguish human-verified claims from drafts.",
      detail:
        "BeSci Wiki overview: 638 claims, 38 sources, and explicit review states. Only 70 claims were human-verified.",
    },
    concept: {
      file: "concept",
      alt: "Social Proof / Norms concept page, with a draft claim, its conditions, quoted passage, page number and source link",
      caption:
        "From a concept to individual claims, with conditions, quotations and source links. These examples remain drafts.",
      detail:
        "The original Social Proof / Norms concept page. The draft badge, claim, conditions, quotation and source link are preserved.",
    },
    source: {
      file: "source",
      alt: "BeSci Wiki source page showing Cialdini, Reno and Kallgren, a DOI link, a draft claim and its page-numbered quotation",
      caption:
        "A source record connects the author and DOI to the extracted claim and page-numbered quotation.",
      detail:
        "The original source-detail interface, showing author, DOI, review state and a page-numbered quotation.",
    },
  };
  document.querySelectorAll("[data-besci-view]").forEach((button) =>
    button.addEventListener("click", () => {
      const view = besciViews[button.dataset.besciView];
      const image = document.getElementById("besci-image");
      const trigger = document.getElementById("besci-screenshot");
      document
        .querySelectorAll("[data-besci-view]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      image.src = `img/besci-${view.file}.webp`;
      image.alt = view.alt;
      trigger.dataset.src = image.src;
      trigger.dataset.caption = view.detail;
      trigger.setAttribute(
        "aria-label",
        `Enlarge the BeSci Wiki ${view.file} screenshot`,
      );
      document.getElementById("besci-caption").textContent = view.caption;
    }),
  );
  const dialog = document.getElementById("image-dialog");
  const dialogImage = document.getElementById("dialog-image");
  let lastTrigger;
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
        /office-hours-(quests|checkin|success)/.test(button.dataset.src),
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

// Preview real project artifacts through the same links used for navigation.
(() => {
  const image = document.getElementById("project-preview-image");
  const caption = document.getElementById("project-preview-caption");
  const projects = {
    garage: [
      "img/office-hours-board.webp",
      "NTU Garage live founder board",
      "From arriving alone to finding your people.",
    ],
    besci: [
      "img/besci-concept.webp",
      "BeSci Wiki concepts and source-linked claims",
      "A claim is only as useful as the evidence behind it.",
    ],
    satellite: [
      "img/satellite-comparison.svg",
      "Chart comparing baseline MAPE of 13.15 percent with imagery MAPE of 13.73 percent",
      "Adding satellite imagery increased prediction error.",
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
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
})();
