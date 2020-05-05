const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

//day 1
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const logInInput = document.querySelector("#login");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");

let login = localStorage.getItem('gloDelivere');

function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
}

function authorized() {
  console.log("Авторизован");
  function logOut () {
    login = null;
    localStorage.removeItem('gloDelivere');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener("click", logOut);
    checkAuth();
  }
  
  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';
  buttonOut.addEventListener("click", logOut);
}

function notathorized() {
  console.log("Не авторизован");
  function logIn(event) {
    event.preventDefault(); // отмена перезагрузки страницы браузера
    login = logInInput.value; //получение значения ввода логина
    if (login == '') { //проверка не пустого значения логина
      logInInput.style.borderColor = 'red';
      alert('Введите логин');
      return logIn();
    }
    localStorage.setItem('gloDelivere', login); //запись логина в память браузера
    toggleModalAuth(); //закрытие модального окна
    buttonAuth.removeEventListener("click", toggleModalAuth); //обнуление задваивания действий
    closeAuth.removeEventListener("click", toggleModalAuth); //обнуление задваивания действий
    logInForm.removeEventListener("submit", logIn); //обнуление задваивания действий
    logInForm.reset(); // очистка формы
    checkAuth(); //проверка авторизованности пользователя
  }
  buttonAuth.addEventListener("click", toggleModalAuth); //кнопка "Войти"
  closeAuth.addEventListener("click", toggleModalAuth); //кнопка "Закрыть"
  logInForm.addEventListener("submit", logIn); // Кнопка отправки формы
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notathorized();
  }
}

checkAuth();