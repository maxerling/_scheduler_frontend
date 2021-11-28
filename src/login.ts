import { loggedInUser } from "./authorization";
loggedInUser();
formLoginSubmit();
function redirectLoggedUser() {
  const user = localStorage.getItem("user");
  const jwt = localStorage.getItem("jwt");
  if (user != null && jwt != null) {
    window.location.replace("https://maxerling.github.io/scheduler_frontend/scheduler.html");
  }
}
async function formLoginSubmit() {
  const submitEle = document.getElementById("login-submit");
  submitEle === null || submitEle === void 0
    ? void 0
    : submitEle.addEventListener("click", (e) => {
        e.preventDefault();
        const usernameField = document.getElementById(
          "username"
        ) as HTMLInputElement;
        const passwordField = document.getElementById(
          "password"
        ) as HTMLInputElement;
        fetch("https://scheduler-21.herokuapp.com/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            username: usernameField?.value,
            password: passwordField?.value ?? "",
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.jwt != null) {
              localStorage.setItem("jwt", JSON.stringify(data.jwt));
              localStorage.setItem("user", JSON.stringify(usernameField.value));
              window.location.replace("https://maxerling.github.io/scheduler_frontend/scheduler.html");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
}
