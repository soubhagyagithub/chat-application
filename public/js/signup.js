const signUp = document.getElementById("signUp");
const signIn = document.getElementById("signIn");
const container = document.getElementById("container");
const signUpBtn = document.getElementById("signUpBtn");

signUp.addEventListener("click", () => {
  container.classList.add("active");
});

signIn.addEventListener("click", () => {
  container.classList.remove("active");
});

function userSignUp(event) {
  event.preventDefault();
  const signUpDetails = {
    userName: event.target.name.value,
    userEmail: event.target.email.value,
    userNumber: event.target.number.value,
    userPassword: event.target.password.value,
  };
  console.log(signUpDetails);
  axios
    .post("http://localhost:4000/user/signUp", signUpDetails)
    .then((res) => {
      alert(res.data.message);
      window.location.href = "/";
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
