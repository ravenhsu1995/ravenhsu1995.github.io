export function initOfficeHours(applyFrameLayout) {
  const views = {
    board: {
      scene: "board",
      mode: "board",
      title: "Founder posts on the big screen.",
      description:
        "Two streams of founder posts move in opposite directions. Posts with a link carry a QR code, so anyone in the room can open it on their phone.",
    },
    checkin: {
      scene: "arrival",
      mode: "phone",
      title: "Check in by picking a field card.",
      description:
        "The Chinese interface walks through arrival: choose a field card, meet the check-in cat, then join the room. Use the gold confirmation button at the bottom of each tip to continue.",
    },
    quests: {
      scene: "quests",
      mode: "phone",
      title: "Post publicly or ask privately.",
      description:
        "The upper form is a private question to the host, shown anonymously to the room. The lower form is a public post: choose a category, add a message and optionally a link, then use the button below it. This preview keeps entries in memory.",
    },
    featured: {
      scene: "featured",
      mode: "board",
      title: "One anonymous question for the whole room.",
      description:
        "The host can replace the flowing board with a single anonymous question, giving the whole room a shared problem to work on.",
    },
  };
  const tabs = [...document.querySelectorAll("[data-view]")];
  const galleryStage = document.getElementById("experience-image");
  const demo = document.getElementById("experience-demo");
  if (!galleryStage || !demo || !tabs.length) return () => {};
  function selectView(button, focus = false) {
    const view = views[button.dataset.view];
    tabs.forEach((tab) => {
      const selected = tab === button;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    if (focus) button.focus();
    galleryStage.dataset.mode = view.mode;
    applyFrameLayout();
    demo.src = `demo/index.html?v=20261024-qr&view=${view.scene}`;
    demo.title = `Interactive ${view.scene} interface with sample data`;
    document.getElementById("demo-open").href = demo.src;
    document
      .getElementById("experience-panel")
      .setAttribute("aria-labelledby", button.id);
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
    demo.setAttribute("src", demo.getAttribute("src"));
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
  return (kind) => {
    document.getElementById("demo-feedback").hidden = false;
    document.getElementById("demo-followup").dataset.target =
      kind === "mailbox" ? "featured" : "board";
    document.getElementById("demo-feedback-text").textContent =
      kind === "mailbox"
        ? "Your question is ready to appear anonymously."
        : "Your post is now part of the shared board.";
  };
}
