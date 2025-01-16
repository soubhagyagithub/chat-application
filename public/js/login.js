const loginBtn = document.getElementById("loginBtn");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

function login() {
  const loginDetails = {
    loginEmail: loginEmail.value,
    loginPassword: loginPassword.value,
  };

  axios
    .post("http://localhost:4000/user/login", loginDetails)
    .then((result) => {
      alert(result.data.message);
      localStorage.setItem("token", result.data.token);
      window.location.href = "/homePage";
    })
    .catch((error) => {
      if (error.response) {
        const errorMessage = error.response.data.message;
        alert(errorMessage);
      } else {
        alert("An error occurred. Please try again later.");
      }
    });
}

loginBtn.addEventListener("click", login);
