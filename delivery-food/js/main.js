'use strict';

const cartButton        = document.querySelector("#cart-button");
const modal             = document.querySelector(".modal");
const close             = document.querySelector(".close");
const buttonAuth        = document.querySelector(".button-auth");
const modalAuth         = document.querySelector(".modal-auth");
const closeAuth         = document.querySelector(".close-auth");
const logInForm         = document.querySelector("#logInForm");
const logInInput        = document.querySelector("#login");
const userName          = document.querySelector(".user-name");
const buttonOut         = document.querySelector(".button-out");
const cardsRestaurants  = document.querySelector(".cards-restaurants");
const restaurants       = document.querySelector(".restaurants");
const containerPromo    = document.querySelector(".container-promo");
const menu              = document.querySelector(".menu");
const logo              = document.querySelector(".logo");
const cardsMenu         = document.querySelector(".cards-menu");

let login               = localStorage.getItem('gloDelivere');



function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
  logInInput.style.borderColor = '';
}

function maskInput(string) {
  return !!string.trim();
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
    if (maskInput(logInInput.value)) {
      login = logInInput.value; //получение значения ввода логина
      localStorage.setItem('gloDelivere', login); //запись логина в память браузера
      toggleModalAuth(); //закрытие модального окна
      buttonAuth.removeEventListener("click", toggleModalAuth); //обнуление задваивания действий
      closeAuth.removeEventListener("click", toggleModalAuth); //обнуление задваивания действий
      logInForm.removeEventListener("submit", logIn); //обнуление задваивания действий
      logInForm.reset(); // очистка формы
      checkAuth(); //проверка авторизованности пользователя
    } else {
      logInInput.style.borderColor = 'red';
    }
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

function createCardsRestaurants(){
  const card = `
    <a class="card card-restaurant">
      <img src="img/pizza-burger/preview.jpg" alt="image" class="card-image"/>
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title">PizzaBurger</h3>
            <span class="card-tag tag">45 мин</span>
          </div>
          <div class="card-info">
            <div class="rating">
              4.5
            </div>
            <div class="price">От 700 ₽</div>
            <div class="category">Пицца</div>
          </div>
        </div>
    </a>
  `;
  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

function createCardGood() {
  const card = document.createElement("div");
  card.className = "card";
  card.insertAdjacentHTML('beforeend', `
    <img src="img/pizza-plus/pizza-vesuvius.jpg" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">Пицца Везувий</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">Соус томатный, сыр «Моцарелла», ветчина, пепперони, перец
          «Халапенье», соус «Тобаско», томаты.
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">545 ₽</strong>
      </div>
    </div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {
  const target = event.target;
  const restaraunt = target.closest('.card-restaurant');
  if (restaraunt) {
    cardsMenu.textContent = '';
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');
    createCardGood();
  };
}

function openCardGoods(event) {
  const target = event.target;
  const good = target.closest('.cards-menu');
  if (good) {
    if (!login) {
      toggleModalAuth();
    }
  }
}



cartButton.addEventListener("click", toggleModal);

close.addEventListener("click", toggleModal);

checkAuth();

createCardsRestaurants();

cardsRestaurants.addEventListener("click", openGoods);

cardsMenu.addEventListener("click", openCardGoods);

logo.addEventListener("click", function(){
  
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
});