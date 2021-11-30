import * as jwt from 'jsonwebtoken';
export function auth() {
  const token = localStorage.getItem('jwt') ?? '';
  if (token == '') {
    redirectToLogin();
  }
  const parsedToken = JSON.parse(token);
  const decodedToken: JWTData = jwt.decode(parsedToken) as JWTData;
  const expDate = decodedToken.exp;
  const _expDate = expDate * 1000;
  let jwtExpDate = new Date(_expDate);
  const currentDate = new Date();
  const hasPassedJWTExpDate = currentDate > jwtExpDate;

  if (hasPassedJWTExpDate) {
    redirectToLogin();
  }
}

function redirectToLogin() {
  localStorage.clear();
  alert('try to login again');
  window.location.replace('https://maxerling.github.io/_scheduler_frontend/');
}

export function loggedInUser() {
  const token = localStorage.getItem('jwt') ?? '';
  if (token == '') return;
  const parsedToken = JSON.parse(token);
  const currentDate = new Date();
  const decodedToken: JWTData = jwt.decode(parsedToken) as JWTData;
  const expDate = decodedToken.exp;
  const _expDate = expDate * 1000;
  let jwtExpDate = new Date(_expDate);
  const hasPassedJWTExpDate = currentDate > jwtExpDate;

  if (!hasPassedJWTExpDate) {
    window.location.replace(
      'https://maxerling.github.io/_scheduler_frontend/scheduler.html'
    );
  }
}
