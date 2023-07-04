import {login, createLegalsPerson, createBills, deleteLegalsPerson, deleteBills} from '/cypress/e2e/helper'

describe('e2e платежа расхода', () => {
    let paymentId = null
    it('Создание статьей расходов', () => {
        cy.viewport(1920, 1080)

        login()

        cy.intercept('https://api.finance.dev.fabrique.studio/api/categories/?filter=0&page=1&limit=100&sort=').as('waitCatigories')
        //Создание статей расходов
        cy.get('.side__menu')
            .contains('Статьи расходов')
            .click()
            .wait('@waitCatigories')

        cy.get('.pageLayout__actions')
            .contains('Добавить статью')
            .click()
        cy.get('.pageLayout')
            .find('[data-field-name="title"]')
            .find('.input')
            .type('Валера Уменьшаемый план')

        cy.get('.pageLayout')
            .find('[data-field-name="category_type"]')
            .contains('Уменьшаемый план')
            .click()

        cy.get('.pageLayout')
            .find('[data-field-name="description"]')
            .find('.input')
            .type('Данная статья расходов с типом Уменьшаемый план')

        cy.intercept('https://api.finance.dev.fabrique.studio/api/categories/?filter=0&page=1&limit=100&sort=').as('postCreateCategories')
        cy.get('.widget__footer')
            .contains('Добавить')
            .click()
            .wait('@postCreateCategories')
        //проверка создания статьи расхода через поиск по названию
        cy.get('.form-field__field')
            .find('.input')
            .type('Валера Уменьшаемый план{Enter}{Enter}')

        cy.get('.table')
            .find('tbody')
            .find('td')
            .contains('Валера Уменьшаемый план')
            .should('be.visible')
        //Создание статьи с типом стандартная
        cy.get('.pageLayout__actions')
            .contains('Добавить статью')
            .click()

        cy.get('.pageLayout')
            .find('[data-field-name="title"]')
            .find('.input')
            .type('Валера стандартная статья расходов')

        cy.get('.pageLayout')
            .find('[data-field-name="category_type"]')
            .contains('Стандартная')
            .click()

        cy.get('.pageLayout')
            .find('[data-field-name="description"]')
            .find('.input')
            .type('Данная статья расходов с типом Стандартная')

        cy.intercept('https://api.finance.dev.fabrique.studio/api/categories/?filter=0&page=1&limit=100&sort=').as('postCreateCategories2')
        cy.get('.widget__footer')
            .contains('Добавить')
            .click()
            .wait('@postCreateCategories2')
        //проверка создания статьи расхода через поиск по названию
        cy.get('.form-field__field')
            .find('.input')
            .type('Валера стандартная статья расходов{Enter}{Enter}')
        cy.get('.table')
            .find('tbody')
            .find('td')
            .contains('Валера стандартная статья расходов')
            .should('be.visible')
    });
    it('Создание Юр.Лиц', () => {
        createLegalsPerson()
    });
    it('Создание счетов для юр.лиц', () => {
        createBills()
    });
    it('Создание платежа', () => {
        cy.viewport(1920, 1080)

        login()
        //Создание платежа с типом Расход
        cy.intercept('https://api.finance.dev.fabrique.studio/api/accounts/?company_type=senders&search=&limit=100').as('waitCompanyType')
        cy.get('button')
            .contains('Добавить платёж')
            .click()
            .wait('@waitCompanyType')
        //Выбираем тип платежа
        cy.get('.payment-edit-page')
            .find('[data-field-name="operation"]')
            .contains('Расход')
            .click()
        //В статусе выбираем расход с уменьшаемым планом
        cy.get('.payment-edit-page')
            .find('[data-field-name="category"]')
            .type('Валера Уменьшаемый план{enter}')
        //Описание
        cy.get('.payment-edit-page')
            .find('[data-field-name="description"]')
            .find('.input')
            .type('Расход с уменьшаемым планом')
        //Статусы
        cy.get('.payment-edit-page')
            .find('[data-field-name="statuses"]')
            .contains('Активен')
            .click()
        cy.get('.payment-edit-page')
            .find('[data-field-name="statuses"]')
            .contains('Проверен')
            .click()
        //Сумма план
        cy.get('.payment-edit-page')
            .find('[data-field-name="amount_plan"]')
            .find('.input')
            .type('10000')
        //Статус оплаты
        cy.get('.payment-edit-page')
            .find('[data-field-name="status"]')
            .contains('Не оплачен')
            .click()
        //Статья расходов, уточнения
        cy.get('.payment-edit-page')
            .find('[data-field-name="category_additional_id"]')
            .find('.input')
            .type('Статья расходов с типом уменьшаемый план')
        //Юр.лицо
        cy.get('.payment-edit-page')
            .find('[data-field-name="company_own"]')
            .type('Юр.Лицо Валерий{enter}')
        //Контрагент
        cy.get('.payment-edit-page')
            .find('[data-field-name="company_client"]')
            .type('Контрагент Валерий{enter}')
        //Тэги
        cy.get('.payment-edit-page')
            .find('[data-field-name="tags"]')
            .type('Мама, как в Mira{enter}')
        cy.get('.payment-edit-page')
            .find('[data-field-name="tags"]')
            .type('Папа, как в Mira{enter}')
        //Проверка что Добавить платеж задизейблен в связанных платежах
        cy.get('.payment-edit-page')
            .find('[data-field-name="related_payments"]')
            .contains('Добавить платеж')
            .should('be.disabled')
        //добавляем платёж через кнопку и проверка + проверка на то, что создался платеж и узнаем его id
        cy.intercept({url: 'https://api.finance.dev.fabrique.studio/api/payments/'}).as('postPayment')
        cy.get('.widget__footer')
            .contains('Добавить')
            .click()
            .wait('@postPayment').then((xhr) => {
            const {id} = xhr.response.body
            paymentId = id
            cy.log(id, 'id')
        })
        //Проверка на то, что кнопка Добавить платеж теперь кликабельна
        cy.get('.payment-edit-page')
            .find('[data-field-name="related_payments"]')
            .contains('Добавить платеж')
            .should('be.visible')
        //Добавляем платеж внутри расхода с уменьшаемым планом
        cy.get('.payment-edit-page')
            .find('[data-field-name="related_payments"]')
            .contains('Добавить платеж')
            .click()
        //В модальном окне добавляем расход
        cy.get('.modal__container')
            .find('[data-field-name="description"]')
            .find('.input')
            .type('расход со статьёй расходов типа Стандартный')
        //Статусы
        cy.get('.modal__container')
            .find('[data-field-name="statuses"]')
            .contains('Активен')
            .click()
        cy.get('.modal__container')
            .find('[data-field-name="statuses"]')
            .contains('Проверен')
            .click()
        //Сумма план
        cy.get('.modal__container')
            .find('[data-field-name="amount_plan"]')
            .find('.input')
            .type('1000')
        //Сумма факт
        cy.get('.modal__container')
            .find('[data-field-name="amount_fact"]')
            .find('.input')
            .type('1000')
        //Статус оплаты
        cy.get('.modal__container')
            .find('[data-field-name="status"]')
            .contains('Оплачен')
            .click()
        //Дата план
        cy.get('.modal__container')
            .find('[data-field-name="date_plan"]')
            .click()
        cy.get('.dp-cal')
            .contains('Сегодня')
            .click()
        //Дата факт
        cy.get('.modal__container')
            .find('[data-field-name="date_fact"]')
            .click()
        cy.get('.dp-cal')
            .contains('Сегодня')
            .click()
        //Статья расходов
        cy.get('.modal__container')
            .find('[data-field-name="category"]')
            .type('Валера стандартная статья расходов{enter}')
        //Статья расходов, уточнения
        cy.get('.modal__container')
            .find('[data-field-name="category_additional_id"]')
            .find('.input')
            .type('Статья расходов Валеры')
        //Банковские данные . Юр.лицо
        cy.get('.modal__container')
            .find('[data-field-name="company_own"]')
            .type('Юр.Лицо Валерий{enter}')
        //Контрагент
        cy.get('.modal__container')
            .find('[data-field-name="company_client"]')
            .type('Контрагент Валерий{enter}')
        //Счёт отправителя
        cy.get('.modal__container')
            .find('[data-field-name="account_sender"]')
            .type('Валеры счёт{enter}')
        //Счёт получателя
        cy.get('.modal__container')
            .find('[data-field-name="account_recipient"]')
            .type('Анатолия счёт{enter}')
        //Добавляем платеж
        cy.get('.widget__footer')
            .contains('Добавить')
            .click()
        //Проверка наличия платежа
        cy.get('.table')
            .find('tbody')
            .find('td')
            .contains('расход со статьёй расходов типа Стандартный')
    });
    it('Удаление платежа', () => {
        cy.viewport(1920, 1080)

        login()

        cy.get('.pageLayout__content')
            .find('.input')
            .type('Расход с уменьшаемым планом{Enter}{Enter}')

        cy.get('.table')
            .find('tbody')
            .find('tr')
            .contains('Расход с уменьшаемым планом')
            .click()

        cy.get('.widget__footer')
            .contains('Удалить')
            .click()

        cy.get('.swal2-popup')
            .contains('Да')
            .click()

    });
    it('Удаление юр.лиц', () => {
        deleteLegalsPerson()
    });
    it('Удаление счётов', () => {
        deleteBills()
    });
})
