export function initOfficeHours(scheduleFrameLayout) {
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
        "Explore the public Quest Board form and private question box. You can type and try the controls; this preview keeps everything in memory.",
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
    scheduleFrameLayout();
    demo.src = `demo/index.html?v=20261024-hires&view=${view.scene}`;
    demo.title = `Interactive ${view.scene} interface with sample data`;
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
