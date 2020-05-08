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
      headingRestarauntPage     = document.querySelector(".heading-restaraunt-page"),
      inputSearch               = document.querySelector(".input-search"),
      search                    = document.querySelector(".search"),
      modalBody                 = document.querySelector(".modal-body"),
      modalPrice                = document.querySelector(".modal-pricetag"),
      clearCart                 = document.querySelector(".clear-cart"),
      
      cart                      = [];

let login                       = localStorage.getItem('gloDelivere');


// получение по url данных в json формате и преобразование его в массив объектов 
const getData = async function(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error (`Ошибка по адресу ${url}, статус ошибки ${response.status}!`)
  }
  return await response.json();
};

// валидатор ввода логина
const valid = function(str) {
  const nameValid = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return nameValid.test(str);
};

// добавление/удаление класса у элемента корзина
function toggleModal() {
  modal.classList.toggle("is-open");
}

// добавление/удаление класса у элемента модальное окно
function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
  // очистка стилей поля ввода
  logInInput.style.borderColor = '';
}

// удаление пробелов
function maskInput(string) {
  return !!string.trim();
}

// авторизация пользователей
function authorized() {
  console.log("Авторизован");
  // деавторизация пользователей
  function logOut () {
    login = null;
    // очистка localStorage
    localStorage.clear();
    // очиска aplication->local storage
    //localStorage.removeItem('gloDelivere');
    // сброс стилей с элементов
    buttonAuth.style.display = '';
    userName.style.display = '';
    search.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
    // обработка события клик на кнопку выйти
    buttonOut.removeEventListener("click", logOut);
    // проверка авторизации
    checkAuth();
  }
  // оформление страницы для авторизованного пользователя
  userName.textContent = login;
  search.style.display = 'block';
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
  // обработка события клик на кнопку выйти
  buttonOut.addEventListener("click", logOut);
}

// действия для неавторизованного пользователя
function notathorized() {
  console.log("Не авторизован");
  // функция входа пользователя
  function logIn(event) {
    // отмена перезагрузки страницы браузера
    event.preventDefault();
    if (valid(logInInput.value)) {
      //получение значения ввода логина
      login = logInInput.value;
      //запись логина в память браузера
      localStorage.setItem('gloDelivere', login);
      //закрытие модального окна
      toggleModalAuth();
      //обнуление задваивания действий
      buttonAuth.removeEventListener("click", toggleModalAuth);
      closeAuth.removeEventListener("click", toggleModalAuth);
      logInForm.removeEventListener("submit", logIn);
      // очистка формы
      logInForm.reset();
      //проверка авторизованности пользователя
      checkAuth();
    } else {
      // если логин не проходит валидацию
      // то применяются эти стили
      logInInput.style.borderColor = 'red';
      logInInput.value = '';
    }
  }
  // обработка клика по кнопке "войти"
  buttonAuth.addEventListener("click", toggleModalAuth);
  // обработка клика по кнопке "Закрыть"
  closeAuth.addEventListener("click", toggleModalAuth);
  // обработка клика по кнопке "отправки формы"
  logInForm.addEventListener("submit", logIn);
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notathorized();
  }
}

// создание карточки ресторана
function createCardsRestaurants({ name, time_of_delivery: timeOfDelivery,
                                stars, price, kitchen, image, products }){
  const card = `
    <a class="card card-restaurant" data-products="${products}" data-name="${name}">
      <img src="${image}" alt="Ресторан: ${name}" class="card-image"/>
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

// создание заголовка страницы с блюдами
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

// создание карточки блюда
function createCardGood({ id, name, description, price, image }) {
  const card = document.createElement("div");
  card.className = "card";
  card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt="Блюдо: ${name}" class="card-image"/>
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
        <button class="button button-primary button-add-cart" id="${id}">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold card-price">${price} ₽</strong>
      </div>
    </div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
}

// рендеринг страницы с блюдами
function openGoods(event) {
  //получении инф о месте клика
  const target = event.target;
  // проверка регистрации пользователя
  // если пользователь зарегистрирован
  // то открывается меню ресторана
  // иначе пользователю предлагается залогиниться
  if (login) {
    // получении инф о ресторане,
    // где произошло событие "клик"
    const restaurant = target.closest('.card-restaurant');
    // проверка был ли клик по карточке ресторана
    if (restaurant) {
      // очистка контента
      headingRestarauntPage.textContent = '';
      cardsMenu.textContent = '';
      // возврат исходного состояния
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');
      // формирование шапки/заголовка страницы с блюдами ресторана
      getData('./db/partners.json').then(function(data){
        for (let i=0; i < data.length; i++) {
          if (data[i].name == restaurant.dataset.name) {
            createHeading(data[i]);
          }
        }
      });
      // формирование карточек блюд ресторана
      // в зависимости от ресорана
      getData(`./db/${restaurant.dataset.products}`).then(function(data){
        data.forEach(createCardGood);
      });
    } 
  } else {
    // появление мод окна ввода логина и пароля
    toggleModalAuth();
  }
}

// добавление элементов в корзину
function addToCart (event) {
  const target = event.target;
  // подъем в кнопку при клике по элементу кнопки
  const buttonAddToCart = target.closest('.button-add-cart');
  if (buttonAddToCart) {
    // подъем наверх при событии клике по кнопке "корзина"
    const card = target.closest('.card');
    // получение данных карточки товара
    const title = card.querySelector(".card-title-reg").textContent;
    const cost = card.querySelector(".card-price").textContent;
    // получение идентиф товара для уникальности записей в корщине и подсчета товаров
    const id = buttonAddToCart.id;
    // проверка уникальности элемента в массиве
    const food = cart.find(function(item){
      return item.id === id;
    });

    if (food) {
      food.count += 1;
    } else {
      cart.push({ 
        id,
        title,
        cost,
        count: 1
       });
    }
  };
}

// формирование корзины
function renderCart () {
  // очистка корзины перед открытием
  modalBody.textContent = '';
  cart.forEach(function({ id, title, cost, count }){
    const itemCart = `
      <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost}</strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id="${id}">-</button>
          <span class="counter">${count}</span>
          <button class="counter-button counter-plus" data-id="${id}">+</button>
        </div>
      </div>
    `;
    modalBody.insertAdjacentHTML("beforeend", itemCart);
  });
  // расчет стоимости товаров в корзине
  const totalPrice = cart.reduce(function(result, item){ 
    return result + (parseFloat(item.cost) * item.count);
  }, 0);
  // ввывод стоимсти товаров в окно стоимости корзины
  modalPrice.textContent = totalPrice + ' ₽';
  // проверка заполнения корзины
  if (cart.length === 0) {
    const info = `
    <div class="food-row">
      <span class="food-name">Корзина пуста!</span>
    </div>
    `;
    modalBody.insertAdjacentHTML("beforeend", info);
  }
  // сохранение корзины в в localStorage
  let gloCart = cart;
  localStorage.gloCart = JSON.stringify(gloCart);
  gloCart = localStorage.gloCart ? JSON.parse(localStorage.gloCart) : [];
}

function changeCount (event) {
  const target = event.target;
  if (target.classList.contains('counter-button')) {
    const food = cart.find(function(item) {
      return item.id === target.dataset.id;
    });
    if (target.classList.contains('counter-minus')) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    };
    if (target.classList.contains('counter-plus')) {
      food.count++;
    };
    renderCart();
  }
}

// скрипт
function init () {
  // получение данные в формате json->array
  // вызов функции, которая создает карточки ресторанов на странице "рестораны"
  getData('./db/partners.json').then(function(data){
    data.forEach(createCardsRestaurants);
  });
  // это корзина
  cartButton.addEventListener("click", function(){
    renderCart();
    toggleModal();
  });
  // обработка нажатия кнопки "отмена" в корзине
  clearCart.addEventListener("click", function(){
    cart.length = 0;
    renderCart();
  });
  // крестик модального окна
  close.addEventListener("click", toggleModal);
  // проверка входа пользователя
  checkAuth();
  // обработка клика на карточку или эелемнт карточки ресторана
  cardsRestaurants.addEventListener("click", openGoods);
  // обработка клика на карточку товара
  cardsMenu.addEventListener("click", addToCart);
  // обработка нажатий на кнопки +/- в корзине
  modalBody.addEventListener("click", changeCount);
  // обработка ввода в строку поиска, получение данных
  inputSearch.addEventListener('keydown', function(event){
    // проверка нажатия клавиши enter
    if (event.keyCode === 13) {
      // получение объекта события
      const target = event.target;
      // получение значения объекта события
      const value = target.value.toLowerCase().trim();
      // очистка ввода поиска
      target.value = '';
      // проверка соответствия условию ввода в стркоу поиска
      // при не соответсвии выделение цветом поля
      // и через 2 секунды удаление выделения
      if (!value || value.length < 2) {
        target.style.backgroundColor = 'tomato';
        setTimeout(function(){
          target.style.backgroundColor = '';
        }, 2000);
        return;
      };
      // объявление массива с товарами, соответствующими критерию поиска
      const goods = [];
      // получить все магазины
      getData('./db/partners.json').then(function(data){
        // получить только свойство объекта "producs" записать в массив
        const products = data.map(function(item){
          return item.products;
        });
        // пройти по массиву продуктс
        products.forEach(function(product){
          // каждое свойство продукт добавить в искомый массив
          getData(`./db/${product}`).then(function(data){
            goods.push(...data);
            // отфильтровать искомы массив по соответствию значению ввода в поиск
            const searchGoods = goods.filter(function(item){
              return item.name.toLowerCase().includes(value);
            });
            // очистка
            headingRestarauntPage.textContent = '';
            cardsMenu.textContent = '';
            // возврат исходного состояния
            containerPromo.classList.add('hide');
            restaurants.classList.add('hide');
            menu.classList.remove('hide');
            // итоговый массив с соответствующими поиску продуксами
            return searchGoods;
          }).then(function(data){ // здесь формируется страница с товарами, которые соответствуют поиску
            data.forEach(createCardGood);
          });
        });
      });
    };
  });
  // возврат состояния страницы при клике на логотип
  logo.addEventListener("click", function(){
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  });
  // инициализация подключаемого слайдера swiper
  new Swiper('.swiper-container', {
    loop: true,
    autoplay: {
      delay: 3000,
    },
    slidesPerView: 'auto'
  });
}

init();