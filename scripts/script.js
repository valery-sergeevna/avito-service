'use strict';
//массив объявленных товаров
const dataBase = JSON.parse(localStorage.getItem('local')) || [];
let counter = dataBase.length;

const modalAdd = document.querySelector('.modal__add'),
    addAd = document.querySelector('.add__ad'),
    modalBtnSubmit = document.querySelector('.modal__btn-submit'),
    modalSubmit = document.querySelector('.modal__submit'),
    catalog = document.querySelector('.catalog'),
    modalItem = document.querySelector('.modal__item'),
    modalBtnWarning = document.querySelector('.modal__btn-warning'),
    modalFileInput = document.querySelector('.modal__file-input'),
    modalFileBtn = document.querySelector('.modal__file-btn'),
    modalImageAdd = document.querySelector('.modal__image-add'),
    searchInput = document.querySelector('.search__input'),
    searchIcon = document.querySelector('.search__icon'),
    menuContainer = document.querySelector('.menu__container');

//элементы модального окна
const modalHeaderItem = document.querySelector('.modal__header-item'),
    modalStatusItem = document.querySelector('.modal__status-item'),
    modalDescriptionItem = document.querySelector('.modal__description-item'),
    modalCostItem = document.querySelector('.modal__cost-item'),
    modalImageItem = document.querySelector('.modal__image-item');

//изначальное значение элементов
const textFileBtn = modalFileBtn.textContent;
const srcModalImage = modalImageAdd.src;

//фильтрация элементов формы
const elementsModalSubmit = [...modalSubmit.elements]
        .filter((elem => elem.tagName !== 'BUTTON' && elem.type !== 'submit'));
console.log(elementsModalSubmit);

//объект изображений
const infoPhoto = {};
//добавить данные в localStorage
const saveLocal = () => localStorage.setItem('local', JSON.stringify(dataBase));

//проверка значений формы, кнопка отправить активна/неактивна в зависимости от заполненности полей
const checkValid = () =>{
    const validForm = elementsModalSubmit.every(elem => elem.value);
    console.log(validForm);
    modalBtnSubmit.disabled  = !validForm; 
    modalBtnWarning.style.display = validForm ? 'none' : '';
};

//функция закрытия модальных окон на крестик, кнопку escape и подложку
const closeModal = event => {
    const target = event.target;
    if (target.classList.contains('modal__close') || 
    target === modalAdd || 
    target === modalItem || 
    event.code === 'Escape') {
        modalAdd.classList.add('hide');
        modalItem.classList.add('hide');
        modalSubmit.reset();
        modalImageAdd.src = srcModalImage;
        modalFileBtn.textContent = textFileBtn;
        checkValid();
    }
    document.body.removeEventListener('keydown', closeModal); 
    console.log(dataBase);
};
//сформировать объявление на главной странице
const renderCard = (DB = dataBase) => {
    catalog.textContent = '';

    DB.forEach(item => {

        catalog.insertAdjacentHTML('afterbegin', `
        <li class="card" data-id="${item.id}">
            <img class="card__image" src = "data:image/jpeg;base64,${item.image}" alt="test">
            <div class="card__description">
                <h3 class="card__header">${item.nameItem}</h3>
                <div class="card__price">${item.costItem} грн</div>
            </div>
        </li>
        `);
    });
};

//работа с изображениями
modalFileInput.addEventListener('change', event =>{
    const target = event.target;

    const reader = new FileReader();
    const file = target.files[0];

    infoPhoto.filename = file.name;
    infoPhoto.size = file.size;

    reader.readAsBinaryString(file);
//проверка размера изображения
    reader.addEventListener('load', event =>{
        if(infoPhoto.size < 300000){
            modalFileBtn.textContent = infoPhoto.filename;
            infoPhoto.base64 = btoa(event.target.result);
            modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`;
        }else{
            modalFileBtn.textContent = 'Размер файла не должен превышать 200кб';
            modalFileInput.value = '';
            checkValid();
        }
        
    });
});
//Открыть модальное окно карточки товара и сформировать информацию
catalog.addEventListener('click', event => {
    const target = event.target;
    const card = target.closest('.card');

    if (card) {
        
        const item = dataBase.find(obj => obj.id === +card.dataset.id);

        modalHeaderItem.textContent = item.nameItem;
        modalStatusItem.textContent = item.status === 'new' ? 'Новый' : 'Б/у';
        modalDescriptionItem. textContent= item.descriptionItem;
        modalCostItem.textContent = `${item.costItem} грн`;
        modalImageItem.src = `data:image/jpeg;base64,${item.image}`;
        modalItem.classList.remove('hide');
        document.addEventListener('keydown', closeModal);
    }
});

//проверка значений формы функцией
modalSubmit.addEventListener('input', checkValid);

//создать объект со свойствами товара и передать его в массив dataBase
modalSubmit.addEventListener('submit', event =>{
    event.preventDefault();
    const itemObject = {};
    for (const elem of elementsModalSubmit){
        itemObject[elem.name] = elem.value;
    }
    itemObject.id = counter++;
    itemObject.image = infoPhoto.base64;
    dataBase.push(itemObject);
    closeModal({target: modalAdd});
    saveLocal();
    renderCard();
});

//Открыть модальное окно "подать объявление" и отключение кнопки submit
addAd.addEventListener('click', ( ) => {
    modalAdd.classList.remove('hide');  
    modalBtnSubmit.disabled = true; 
    document.body.addEventListener('keydown', closeModal);
});

//показать поле поиска по клику на иконку
searchIcon.addEventListener('click', () => {
    searchInput.classList.toggle('search__opacity');
});

//поиск объявления
searchInput.addEventListener('input', () =>{
    const valueSearch = searchInput.value.trim().toLowerCase();

    if(valueSearch.length > 2){
        const result = dataBase.filter(item =>item.nameItem.toLowerCase().includes(valueSearch)||
                                       item.descriptionItem.toLowerCase().includes(valueSearch));
        renderCard(result);
    }
});

//фильтрация объявлений по категориям
menuContainer.addEventListener('click', event =>{
    const target = event.target;

    if (target.tagName === 'A'){
        const result = dataBase.filter(item => item.category === target.dataset.category);
        renderCard(result);
    }
});

//закрыть модальные окна
modalAdd.addEventListener('click',closeModal);
modalItem.addEventListener('click',closeModal);

//вызвать рендер карточек
renderCard();







