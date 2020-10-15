const modals = document.querySelectorAll('[data-content="modal"]');
const openModalBtns = document.querySelectorAll('[data-action="open_modal"]');
const loginBtn = document.querySelector('[data-action="submit"]');
const wrongPasswordNotify = document.querySelector('.form__password .error');
const wrongEmailNotify = document.querySelector('.form__email .error');

// обработчик клика по кнопкам открытия модального окна
openModalBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
        const target = this.dataset.target;
        const modalToOpen = document.querySelector(`[data-modal=${target}]`);
        modalToOpen.classList.add('active');
    })
})

// обработчик клика внутри модального окна
modals.forEach(function(modal) {
    modal.addEventListener('click', function (e) {
        const modalContent = this.querySelector('.modal__content');
        const closeIcon = this.querySelector('.modal__close');
        // кликнули мимо окна с контентом или на иконку "Закрыть" - закрывали модальное окно
        if (!modalContent.contains(e.target) || closeIcon.contains(e.target)) {
            this.closest('.modal').classList.remove('active');
        }
    });
})

// обработчик нажатия клавиши Escape
document.body.addEventListener('keydown', function (e) {
    // нажали Esc - закрыли все модальные окна на странице
    if(e.code === 'Escape') {
        modals.forEach(function (modal) {
          modal.classList.remove('active');
        })
    }
})

// обработчик клика по кнопке "Войти" в модальном окне
loginBtn.addEventListener('click', function () {
    const btn = this;
    const emailInput = document.querySelector('.form__email input');
    const passwordInput = document.querySelector('.form__password input');
    const email = document.querySelector('.form__email input').value.trim();
    const password = document.querySelector('.form__password input').value.trim();
    // поле "email" не заполнено
    if(email === '') {
        emailInput.classList.add('invalid');
        passwordInput.classList.remove('invalid');
        wrongEmailNotify.classList.add('active');
        wrongEmailNotify.innerText = 'Введите email';
        wrongPasswordNotify.classList.remove('active');
    } else {
        // поле "email" заполнено правильно
        if(validateEmail(email)) {
            emailInput.classList.remove('invalid');
            wrongEmailNotify.classList.remove('active');
            // поле "пароль" не заполнено
            if(password === '') {
                wrongPasswordNotify.classList.add('active');
                passwordInput.classList.add('invalid');
            } else { // поле "пароль" заполнено
                wrongPasswordNotify.classList.remove('active');
                passwordInput.classList.remove('invalid');
                this.classList.add('loading');
                this.closest('.modal').querySelector('.form__no-access').classList.remove('active');
                    const request = new XMLHttpRequest();
                    const url = "https://jsonplaceholder.typicode.com/users";
                    request.responseType =	"json";
                    request.open("GET", url, true);
                    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    request.addEventListener("readystatechange", () => {
                        if (request.readyState === 4 && request.status === 200) {
                            if(request.status === 200) {
                                const data = request.response;
                                console.log(data);
                                btn.classList.remove('loading');
                                btn.closest('.modal').querySelector('.form__no-access').classList.remove('active');
                                window.location = url;
                            } else {
                                btn.closest('.modal').querySelector('.form__no-access').classList.add('active');
                            }
                        }
                    });
                    request.send();
            }
        } else { // поле email заполнено неправильно
            emailInput.classList.add('invalid');
            wrongEmailNotify.innerText = 'Неверный формат email';
        }
    }
})

//


const validateEmail = (email)  => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}