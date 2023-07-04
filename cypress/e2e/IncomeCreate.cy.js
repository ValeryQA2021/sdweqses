import {login} from '/cypress/e2e/helper'

describe('e2e платежа дохода', () => {
    let paymentId = null
    it('Создание статьи расхода', () => {
        cy.viewport(1920, 1080)

        login()

        cy.intercept('https://api.finance.dev.fabrique.studio/api/categories/?filter=0&page=1&limit=100&sort=').as('waitCatigories')
        //Переход на Статьи расходов
        cy.get('.side__menu')
            .contains('Статьи расходов')
            .click()
            .wait('@waitCatigories')
        //Создание статьи
        cy.get('.pageLayout__actions')
            .contains('Добавить статью')
            .click()
        cy.get('.pageLayout')
            .find('[data-field-name="title"]')
            .find('.input')
            .type('Валера-Валера')
        cy.get('.pageLayout')
            .find('[data-field-name="category_type"]')
            .contains('Стандартная')
            .click()
        cy.get('.pageLayout')
            .find('[data-field-name="description"]')
            .find('.input')
            .type('Данная статья расходов Валеры')
        //кнопка добавить
        cy.intercept('https://api.finance.dev.fabrique.studio/api/categories/?filter=0&page=1&limit=100&sort=').as('postCreateCategories')
        cy.get('.widget__footer')
            .contains('Добавить')
            .click()
            .wait('@postCreateCategories')
        //проверка создания статьи расхода через поиск по названию
        cy.get('.form-field__field')
            .find('.input')
            .type('Валера-Валера{Enter}{Enter}')

        cy.get('.table')
            .find('tbody')
            .find('td')
            .contains('Валера-Валера')
            .should('be.visible')
    });
    it('Создание платежа', () => {
        cy.viewport(1920, 1080)

        login()

        cy.intercept('https://api.finance.dev.fabrique.studio/api/accounts/?company_type=senders&search=&limit=100').as('waitCompanyType')
        cy.get('button')
            .contains('Добавить платёж')
            .click()
            .wait('@waitCompanyType')
        //Тип операции . выбираем расход, и значит в заголовке За что, должны быть пункты Статья расходов и Статья расходов уточнение
        cy.get('.payment-edit-page')
            .find('[data-field-name="operation"]')
            .contains('Доход/приход')
            .click()
        //Описание
        cy.get('.payment-edit-page')
            .find('[data-field-name="description"]')
            .find('.input')
            .type('Описание для Валеры')
        //Статус
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
            .type('123')
        //Сумма факт
        cy.get('.payment-edit-page')
            .find('[data-field-name="amount_fact"]')
            .find('.input')
            .type('123')
        //Статус оплаты
        cy.get('.payment-edit-page')
            .find('[data-field-name="status"]')
            .contains('Оплачен')
            .click()
        //Дата план
        cy.get('.payment-edit-page')
            .find('[data-field-name="date_plan"]')
            .click()
        cy.get('.dp-cal')
            .contains('Сегодня')
            .click()

        //Дата факт
        cy.get('.payment-edit-page')
            .find('[data-field-name="date_fact"]')
            .click()
        cy.get('.dp-cal')
            .contains('Сегодня')
            .click()

        //За что
        //Источник
        cy.get('.payment-edit-page')
            .find('[data-field-name="source"]')
            .type('Валера-Валера{enter}')

        //Статья расходов, уточнения
        cy.get('.payment-edit-page')
            .find('[data-field-name="source_additional_id"]')
            .find('.input')
            .type('Источник, уточнения для Валеры')

        //Статус документов
        cy.get('.payment-edit-page')
            .find('[data-field-name="source_status"]')
            .find('.multiselect__tags')
            .type('Акт подписан{enter}')
        //Юр.лицо
        cy.get('.payment-edit-page')
            .find('[data-field-name="company_own"]')
            .type('Юр.Лицо Валерий{enter}')
        //Контрагент
        cy.get('.payment-edit-page')
            .find('[data-field-name="company_client"]')
            .type('Контрагент Валерий{enter}')
        //Счёт отправителя
        cy.get('.payment-edit-page')
            .find('[data-field-name="account_sender"]')
            .type('4242 4242 4242 4242{enter}')

        //Счёт получателя
        cy.get('.payment-edit-page')
            .find('[data-field-name="account_recipient"]')
            .type('2424 2424 2424 2424{enter}')

        //Тэги
        cy.get('.payment-edit-page')
            .find('[data-field-name="tags"]')
            .type('Мама, как в Mira{enter}')
        cy.get('.payment-edit-page')
            .find('[data-field-name="tags"]')
            .type('Папа, как в Mira{enter}')
        //добавляем платёж через кнопку
        cy.intercept({url: 'https://api.finance.dev.fabrique.studio/api/payments/'}).as('postPayment')
        cy.get('button')
            .contains('Добавить')
            .click()
            .wait('@postPayment').then((xhr) => {
            const {id} = xhr.response.body
            paymentId = id
            cy.log(id, 'id')
        })

    });
    it('Удаление платежа', () => {
        cy.viewport(1920, 1080)

        login()

        cy.get('.pageLayout__content')
            .find('.input')
            .type('Описание для Валеры{Enter}{Enter}')

        cy.get('.table')
            .find('tbody')
            .find('tr')
            .contains('Описание для Валеры')
            .click()

        cy.get('.widget__footer')
            .contains('Удалить')
            .click()

        cy.get('.swal2-popup')
            .contains('Да')
            .click()

    });
    it('Удаление статьи расхода', () => {
        cy.viewport(1920, 1080)

        login()

        cy.intercept('https://api.finance.dev.fabrique.studio/api/categories/?filter=0&page=1&limit=100&sort=').as('waitCatigories')
        //Переход на Статьи расходов
        cy.get('.side__menu')
            .contains('Статьи расходов')
            .click()
            .wait('@waitCatigories')
        //Удаление статьи расходов

        cy.get('.form-field__field')
            .find('.input')
            .type('Валера-Валера{Enter}{Enter}')

        cy.get('.table')
            .find('tbody')
            .find('td')
            .contains('Валера-Валера')
            .click()

        cy.get('.widget__footer')
            .contains('Удалить')
            .click()
    });
})
