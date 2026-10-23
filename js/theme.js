export function initTheme() {
  const root = document.documentElement;
  const themeButton = document.getElementById("theme-toggle");
  if (!themeButton) return;
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
    } catch {
      // Storage may be unavailable; the in-page preference still works.
    }
    syncTheme();
  });
  systemTheme.addEventListener("change", syncTheme);
  syncTheme();
}
