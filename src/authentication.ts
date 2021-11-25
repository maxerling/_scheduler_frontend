


export function logOutButton() {
  const logoutBtn = document.getElementById("logout");
  logoutBtn?.addEventListener("click", () => {
    localStorage.clear();
    window.location.replace("http://localhost:1234/login.html");
  });
}
