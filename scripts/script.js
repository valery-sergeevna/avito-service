'use strict';
//массив объявленных товаров
const dataBase = JSON.parse(localStorage.getItem('local')) || [];

const modalAdd = document.querySelector('.modal__add'),
    addAd = document.querySelector('.add__ad'),
    modalBtnSubmit = document.querySelector('.modal__btn-submit'),
    modalSubmit = document.querySelector('.modal__submit'),
    catalog = document.querySelector('.catalog'),
    modalItem = document.querySelector('.modal__item'),
    modalBtnWarning = document.querySelector('.modal__btn-warning'),
    modalFileInput = document.querySelector('.modal__file-input'),
    modalFileBtn = document.querySelector('.modal__file-btn'),
    modalImageAdd = document.querySelector('.modal__image-add');

//изначальное значение элементов
const textFileBtn = modalFileBtn.textContent;
const srcModalImage = modalImageAdd.src;

//фильтрация элементов формы
const elementsModalSubmit = [...modalSubmit.elements]
        .filter((elem => elem.tagName !== 'BUTTON' && elem.type !== 'submit'));
console.log(elementsModalSubmit);

//объект изображений
const infoPhoto = {};
//добавить в localStorage
const saveLocal = () => localStorage.setItem('local', JSON.stringify(dataBase));

//проверка значений формы, кнопка отправить активна/неактивна в зависимости от заполненности полей
const checkValid = () =>{
    const validForm = elementsModalSubmit.every(elem => elem.value);
    console.log(validForm);
    modalBtnSubmit.disabled  = !validForm; 
    modalBtnWarning.style.display = validForm ? 'none' : '';
};

//функция закрытия модальных окон
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
const renderCard = () => {
    catalog.textContent = '';

    dataBase.forEach((item, i) => {

        catalog.insertAdjacentHTML('beforeend', `
        <li class="card" data-id="${i}">
            <img class="card__image" src = "data:image/jpeg;base64,${item.image}" alt="test">
            <div class="card__description">
                <h3 class="card__header">${item.nameItem}</h3>
                <div class="card__price">${item.costItem}</div>
            </div>
        </li>
        `);
    });
};


//работа с изображением
modalFileInput.addEventListener('change', event =>{
    const target = event.target;

    const reader = new FileReader();
    const file = target.files[0];

    infoPhoto.filename = file.name;
    infoPhoto.size = file.size;

    reader.readAsBinaryString(file);
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

    const modalHeaderItem = document.querySelector('.modal__header-item'),
        modalStatusItem = document.querySelector('.modal__status-item'),
        modalDescriptionItem = document.querySelector('.modal__description-item'),
        modalCostItem = document.querySelector('.modal__cost-item'),
        modalImageItem = document.querySelector('.modal__image-item');

    let numId = target.parentElement.dataset.id;
    if (!numId) { numId = target.parentElement.dataset.id; }

    if (target.closest('.card')) {
        modalItem.classList.remove('hide');
        modalHeaderItem.textContent = dataBase[numId].nameItem;
        modalImageItem.src = 'data:image/jpeg;base64,' + dataBase[numId].image;
        if (dataBase[numId].status === 'old') {
            modalStatusItem.textContent = 'б/у';
        } else {
            modalStatusItem.textContent = 'отличное';
        }
        modalDescriptionItem.textContent = dataBase[numId].descriptionItem;
        modalCostItem.textContent = dataBase[numId].costItem + ' ₽';

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



//закрыть модальные окна
modalAdd.addEventListener('click',closeModal);
modalItem.addEventListener('click',closeModal);


renderCard();







