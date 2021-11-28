


export function logOutButton() {
  const logoutBtn = document.getElementById("logout");
  logoutBtn?.addEventListener("click", () => {
    localStorage.clear();
    window.location.replace("https://maxerling.github.io/scheduler_frontend/login.html");
  });
}
