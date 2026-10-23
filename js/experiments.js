export function initExperiments() {
  const modelButtons = [...document.querySelectorAll("[data-model]")];
  modelButtons.forEach((button) =>
    button.addEventListener("click", () => {
      modelButtons.forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
      const imagery = button.dataset.model === "imagery";
      button.closest(".result-explorer").dataset.selected =
        button.dataset.model;
      const percent = document.createElement("span");
      percent.textContent = "%";
      document
        .getElementById("model-value")
        .replaceChildren(
          document.createTextNode(imagery ? "13.73" : "13.15"),
          percent,
        );
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
  const screenshotButtons = [...document.querySelectorAll("[data-besci-view]")];
  screenshotButtons.forEach((button) =>
    button.addEventListener("click", () => {
      const view = besciViews[button.dataset.besciView];
      const image = document.getElementById("besci-image");
      const trigger = document.getElementById("besci-screenshot");
      screenshotButtons.forEach((item) =>
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
}
