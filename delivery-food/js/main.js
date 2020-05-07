'use strict';

const cartButton                = document.querySelector("#cart-button"),
      modal                     = document.querySelector(".modal"),
      close                     = document.querySelector(".close"),
      buttonAuth                = document.querySelector(".button-auth"),
      modalAuth                 = document.querySelector(".modal-auth"),
      closeAuth                 = document.querySelector(".close-auth"),
      logInForm                 = document.querySelector("#logInForm"),
      logInInput                = document.querySelector("#login"),
      userName                  = document.querySelector(".user-name"),
      buttonOut                 = document.querySelector(".button-out"),
      cardsRestaurants          = document.querySelector(".cards-restaurants"),
      restaurants               = document.querySelector(".restaurants"),
      containerPromo            = document.querySelector(".container-promo"),
      menu                      = document.querySelector(".menu"),
      logo                      = document.querySelector(".logo"),
      cardsMenu                 = document.querySelector(".cards-menu"),
      headingRestarauntPage     = document.querySelector(".heading-restaraunt-page");

let login                       = localStorage.getItem('gloDelivere');



const getData = async function(url) {

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error (`Ошибка по адресу ${url}, статус ошибки ${response.status}!`)
  }
  return await response.json();

};



const valid = function(str) {
  const nameValid = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return nameValid.test(str);
};

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
    if (valid(logInInput.value)) {
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
      logInInput.value = '';
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

function createCardsRestaurants({ name, time_of_delivery: timeOfDelivery,
                                stars, price, kitchen, image, products }){
  const card = `
    <a class="card card-restaurant" data-products="${products}" data-name="${name}">
      <img src="${image}" alt="image" class="card-image"/>
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title">${name}</h3>
            <span class="card-tag tag">${timeOfDelivery}</span>
          </div>
          <div class="card-info">
            <div class="rating">
              ${stars}
            </div>
            <div class="price">${price} ₽</div>
            <div class="category">${kitchen}</div>
          </div>
        </div>
    </a>
  `;
  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

function createHeading({ name, stars, price, kitchen }) {
  const heading = `
    <h2 class="section-title restaurant-title">${name}</h2>
    <div class="card-info">
      <div class="rating">
        ${stars}
      </div>
      <div class="price">От ${price} ₽</div>
      <div class="category">${kitchen}</div>
    </div>
  `;
  headingRestarauntPage.insertAdjacentHTML('beforeend', heading);
}

function createCardGood({ id, name, description, price, image }) {
  const card = document.createElement("div");
  card.className = "card";
  card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">
          ${description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">${price} ₽</strong>
      </div>
    </div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {
  const target = event.target;
  
  if (login) {
    const restaurant = target.closest('.card-restaurant');

    if (restaurant) {
      headingRestarauntPage.textContent = '';
      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');
      getData('./db/partners.json').then(function(data){
        for (let i=0; i < data.length; i++) {
          if (data[i].name == restaurant.dataset.name) {
            createHeading(data[i]);
          }
        }
      });
      getData(`./db/${restaurant.dataset.products}`).then(function(data){
        data.forEach(createCardGood);
      });
    } else {
      toggleModalAuth();
    }
  }
}


function init () {

  getData('./db/partners.json').then(function(data){
    data.forEach(createCardsRestaurants);
  });
  
  cartButton.addEventListener("click", toggleModal);
  
  close.addEventListener("click", toggleModal);
  
  checkAuth();
  
  cardsRestaurants.addEventListener("click", openGoods);
  
  logo.addEventListener("click", function(){
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  });
  
  new Swiper('.swiper-container', {
    loop: true,
    autoplay: {
      delay: 3000,
    },
    slidesPerView: 'auto'
  });

}

init();