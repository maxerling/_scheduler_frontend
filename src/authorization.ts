import * as jwt from "jsonwebtoken";
export function authorization() {
  const token = localStorage.getItem("jwt") ?? "";
  if (token == "") return;
  const parsedToken = JSON.parse(token);
  const currentDate = new Date();
  const decodedToken: JWTData = jwt.decode(parsedToken) as JWTData;
  const expDate = decodedToken.exp;
  const _expDate = expDate * 1000;
  let jwtExpDate = new Date(_expDate);
  const hasPassedJWTExpDate = currentDate > jwtExpDate;

  if (jwt == null || jwt == undefined || hasPassedJWTExpDate) {
    localStorage.clear();
    alert("try to login again");
    window.location.replace("http://localhost:1234/login.html");
  }
}

export function loggedInUser() {
  const token = localStorage.getItem("jwt") ?? "";
  if (token == "") return;
  const parsedToken = JSON.parse(token);
  const currentDate = new Date();
  const decodedToken: JWTData = jwt.decode(parsedToken) as JWTData;
  const expDate = decodedToken.exp;
  const _expDate = expDate * 1000;
  let jwtExpDate = new Date(_expDate);
  const hasPassedJWTExpDate = currentDate > jwtExpDate;

  if (!hasPassedJWTExpDate) {
    window.location.replace("http://localhost:1234/scheduler.html");
  }
}
