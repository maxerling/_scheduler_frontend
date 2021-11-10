

// export async function logInButton() {
//   const submitEle = document.getElementById("login-submit");
//   submitEle?.addEventListener("click", (e) => {
//     e.preventDefault();
//     console.log("hi");
//     const usernameField = document.getElementById(
//       "username"
//     ) as HTMLInputElement;
//     const passwordField = document.getElementById(
//       "password"
//     ) as HTMLInputElement;

//     fetch("http://localhost:8080/auth", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Origin": "*",
//       },
//       body: JSON.stringify({
//         username: usernameField.value,
//         password: passwordField.value,
//       }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.status == 403)
//           return console.log("wrong passowrd or username, try again!");
//         console.log(data.jwt);
//         if (data.jwt != null || undefined) {
//           localStorage.setItem("jwt", JSON.stringify(data.jwt));
//           localStorage.setItem("user", JSON.stringify(usernameField.value));
//           window.location.replace("http://localhost:1234/scheduler.html");
//         }
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   });
// }

export function logOutButton() {
  const logoutBtn = document.getElementById("logout");
  logoutBtn?.addEventListener("click", () => {
    localStorage.clear();
    window.location.replace("http://localhost:1234/login.html");
  });
}
