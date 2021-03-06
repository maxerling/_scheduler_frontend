import { loggedInUser } from './authorization';
loggedInUser();
formLoginSubmit();
function redirectLoggedUser() {
  const user = localStorage.getItem('user');
  const jwt = localStorage.getItem('jwt');
  if (user != null && jwt != null) {
    window.location.replace(
      'https://maxerling.github.io/_scheduler_frontend/scheduler.html'
    );
  }
}
async function formLoginSubmit() {
  const submitEle = document.getElementById('login-submit');
  submitEle === null || submitEle === void 0
    ? void 0
    : submitEle.addEventListener('click', async (e) => {
        e.preventDefault();
        const usernameField = document.getElementById(
          'username'
        ) as HTMLInputElement;
        const passwordField = document.getElementById(
          'password'
        ) as HTMLInputElement;
        await fetch('https://scheduler-21.herokuapp.com/auth', {
          method: 'POST',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: usernameField?.value,
            password: passwordField?.value ?? '',
          }),
        })
          .then((response) => {
            const responseJson = response.json();
            return responseJson;
          })
          .then((data) => {
            if (data.jwt != null) {
              localStorage.clear();
            }
            const token = JSON.stringify(data.jwt);
            if (token == undefined) {
              alert('error, try again');
              localStorage.clear();
              return;
            } else {
              localStorage.setItem('jwt', token);
              localStorage.setItem('user', JSON.stringify(usernameField.value));

              window.location.replace(
                'https://maxerling.github.io/_scheduler_frontend/scheduler.html'
              );
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      });
}
