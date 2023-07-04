export function login() {
    cy.visit('https://finance.dev.fabrique.studio/accounts/login/', {
        auth: {
            username: 'fabrique',
            password: 'fabrique',
        },
    })
    // вводим логин
    cy.get('label.input__content')
        .find('input[type="email"][placeholder="Электронная почта"]')
        .clear()
        .type('admin@admin.ad');
    // вводим пасс
    cy.get('label.input__content')
        .find('input[type="password"][placeholder="Пароль"]')
        .clear()
        .type('admin');
    //Вход через кнопку Далее
    cy.intercept('https://api.finance.dev.fabrique.studio/rest-auth/login/').as('waitLogin')
    cy.get('button')
        .contains('Далее')
        .click()
        .wait('@waitLogin')
}

export function createLegalsPerson() {
    cy.viewport(1920, 1080)

    login()
    //Создание юр.лиц
    cy.intercept('https://api.finance.dev.fabrique.studio/api/companies/own/?filter=0&page=1&limit=100&sort=').as('waitResCompanies')
    cy.get('.side__menu')
        .contains('Юр. лица')
        .click()
        .wait('@waitResCompanies')

    cy.get('.pageLayout__header')
        .contains('Добавить юридическое лицо')
        .click()

    cy.get('.pageLayout')
        .find('[data-field-name="title"]')
        .find('.input')
        .type('Юр.Лицо Валера')

    cy.get('.pageLayout')
        .find('[data-field-name="full_title"]')
        .find('.input')
        .type('Валерий Игоревич')

    cy.intercept('https://api.finance.dev.fabrique.studio/api/companies/own/?filter=0&page=1&limit=100&sort=').as('waitResCompanies2')
    cy.get('.widget__footer')
        .contains('Добавить')
        .click()
        .wait('@waitResCompanies2')
    //проверка создания Юр.Лицо Валера
    cy.get('.form-field__field')
        .find('.input')
        .type('Юр.Лицо Валера{Enter}{Enter}')

    cy.get('.table')
        .find('tbody')
        .find('td')
        .contains('Юр.Лицо Валера')
        .should('be.visible')
    //Создание второго юр.лица
    cy.get('.pageLayout__header')
        .contains('Добавить юридическое лицо')
        .click()

    cy.get('.pageLayout')
        .find('[data-field-name="title"]')
        .find('.input')
        .type('Юр.Лицо Анатолий')

    cy.get('.pageLayout')
        .find('[data-field-name="full_title"]')
        .find('.input')
        .type('Анатолий Петрович')

    cy.intercept('https://api.finance.dev.fabrique.studio/api/companies/own/?filter=0&page=1&limit=100&sort=').as('waitResCompanies2')
    cy.get('.widget__footer')
        .contains('Добавить')
        .click()
        .wait('@waitResCompanies2')
    //Проверка создания второго юр.лица
    cy.get('.form-field__field')
        .find('.input')
        .type('Юр.Лицо Анатолий{Enter}{Enter}')

    cy.get('.table')
        .find('tbody')
        .find('td')
        .contains('Юр.Лицо Анатолий')
        .should('be.visible')
}

export function createBills() {
    cy.viewport(1920, 1080)

    login()
    //Переход на Счета
    cy.intercept('https://api.finance.dev.fabrique.studio/api/accounts/?filter=0&page=1&limit=100&sort=').as('waitAccounts')
    cy.get('.side__menu')
        .contains('Счета')
        .click()
        .wait('@waitAccounts')
    //Создание первого счета
    cy.get('.pageLayout__header')
        .contains('Добавить счёт')
        .click()

    cy.get('.pageLayout')
        .find('[data-field-name="title"]')
        .find('.input')
        .type('Валеры счёт')

    cy.get('.pageLayout')
        .find('[data-field-name="companies"]')
        .click()
        .type('Юр.Лицо Валера{enter}')

    cy.get('.pageLayout')
        .find('[data-field-name="requisites"]')
        .type('1718 1920 2122 2324')

    cy.get('.pageLayout')
        .find('[data-field-name="description"]')
        .find('.input')
        .type('Счёт Юр.лица Валеры')

    cy.intercept('https://api.finance.dev.fabrique.studio/api/accounts/?filter=0&page=1&limit=100&sort=').as('waitresAcc')
    cy.get('.widget__footer')
        .contains('Добавить')
        .click()
        .wait('@waitresAcc')
    // проверка на наличие счёта Валеры счёт
    cy.get('.form-field__field')
        .find('.input')
        .type('Валеры счёт{Enter}{Enter}')

    cy.get('.table')
        .find('tbody')
        .find('td')
        .contains('Валеры счёт')
        .should('be.visible')
    //Создание второго счета
    cy.get('.pageLayout__header')
        .contains('Добавить счёт')
        .click()

    cy.get('.pageLayout')
        .find('[data-field-name="title"]')
        .find('.input')
        .type('Анатолия счёт')

    cy.get('.pageLayout')
        .find('[data-field-name="companies"]')
        .click()
        .type('Юр.Лицо Анатолий{enter}')

    cy.get('.pageLayout')
        .find('[data-field-name="requisites"]')
        .type('2423 2221 2019 1817')

    cy.get('.pageLayout')
        .find('[data-field-name="description"]')
        .find('.input')
        .type('Счёт Юр.лица Валеры')

    cy.intercept('https://api.finance.dev.fabrique.studio/api/accounts/?filter=0&page=1&limit=100&sort=').as('waitresAcc')
    cy.get('.widget__footer')
        .contains('Добавить')
        .click()
        .wait('@waitresAcc')
    // проверка на наличие второго счета
    cy.get('.form-field__field')
        .find('.input')
        .type('Анатолия счёт{Enter}{Enter}')

    cy.get('.table')
        .find('tbody')
        .find('td')
        .contains('Анатолия счёт')
        .should('be.visible')
}

export function deleteLegalsPerson() {
    cy.viewport(1920, 1080)

    login()

    cy.intercept('https://api.finance.dev.fabrique.studio/api/companies/own/?filter=0&page=1&limit=100&sort=').as('waitCompanies')
    //Переход на Статьи расходов
    cy.get('.side__menu')
        .contains('Юр. лица')
        .click()
        .wait('@waitCompanies')
    //Удаление юр.лицо Анатолий
    cy.get('.form-field__field')
        .find('.input')
        .type('Юр.Лицо Анатолий{Enter}{Enter}')

    cy.get('.table')
        .find('tbody')
        .find('td')
        .contains('Юр.Лицо Анатолий')
        .click()

    cy.intercept('https://api.finance.dev.fabrique.studio/api/companies/own/?filter=0&page=1&limit=100&sort=').as('waitCompanies')
    cy.get('.widget__footer')
        .contains('Удалить')
        .click()
        .wait('@waitCompanies')
    //Удаление юр.лицо Валера
    cy.get('.form-field__field')
        .find('.input')
        .type('Юр.Лицо Валера{Enter}{Enter}')

    cy.get('.table')
        .find('tbody')
        .find('td')
        .contains('Юр.Лицо Валера')
        .click()

    cy.intercept('https://api.finance.dev.fabrique.studio/api/companies/own/?filter=0&page=1&limit=100&sort=').as('waitCompanies')
    cy.get('.widget__footer')
        .contains('Удалить')
        .click()
        .wait('@waitCompanies')
}

export function deleteBills() {
    cy.viewport(1920, 1080)

    login()

    cy.intercept('https://api.finance.dev.fabrique.studio/api/accounts/?filter=0&page=1&limit=100&sort=').as('waitCatigories')

    cy.get('.side__menu')
        .contains('Счета')
        .click()
        .wait('@waitCatigories')

    cy.get('.form-field__field')
        .find('.input')
        .type('Валеры счёт{Enter}{Enter}')

    cy.get('.table')
        .find('tbody')
        .find('td')
        .contains('Валеры счёт')
        .click()

    cy.intercept('https://api.finance.dev.fabrique.studio/api/accounts/?filter=0&page=1&limit=100&sort=').as('waitresAcc')
    cy.get('.widget__footer')
        .contains('Удалить')
        .click()
        .wait('@waitresAcc')

    cy.get('.form-field__field')
        .find('.input')
        .type('Анатолия счёт{Enter}{Enter}')

    cy.get('.table')
        .find('tbody')
        .find('td')
        .contains('Анатолия счёт')
        .click()

    cy.intercept('https://api.finance.dev.fabrique.studio/api/accounts/?filter=0&page=1&limit=100&sort=').as('waitresAcc')
    cy.get('.widget__footer')
        .contains('Удалить')
        .click()
        .wait('@waitresAcc')
}