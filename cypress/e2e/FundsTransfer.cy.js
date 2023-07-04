import {login, createLegalsPerson, createBills, deleteLegalsPerson, deleteBills} from '/cypress/e2e/helper'

describe('e2e перевода средств', () => {
    let paymentId = null
    it('Создание Юр.Лиц', () => {
        createLegalsPerson()
    });
    it('Создание счетов для юр.лиц', () => {
        createBills()
    });
    it('Создание платежа с типом Перевод средств', () => {
        cy.viewport(1920, 1080)

        login()
        //Создание платежа с типом Перевод средств
        cy.intercept('https://api.finance.dev.fabrique.studio/api/accounts/?company_type=senders&search=&limit=100').as('waitCompanyType')
        cy.get('button')
            .contains('Добавить платёж')
            .click()
            .wait('@waitCompanyType')
        //Выбираем тип платежа
        cy.get('.payment-edit-page')
            .find('[data-field-name="operation"]')
            .contains('Перевод средств')
            .click()
        //Описание
        cy.get('.payment-edit-page')
            .find('[data-field-name="description"]')
            .find('.input')
            .type('Описание перевода средств123')
        //Статусы Активен и Проверен
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
            .type('100000')
        //Сумма факт
        cy.get('.payment-edit-page')
            .find('[data-field-name="amount_fact"]')
            .find('.input')
            .type('200000')
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
        //Счёт отправителя
        cy.get('.payment-edit-page')
            .find('[data-field-name="account_sender"]')
            .type('Валеры счёт{enter}')
        //Счёт получателя
        cy.get('.payment-edit-page')
            .find('[data-field-name="account_recipient"]')
            .type('Анатолия счёт{enter}')
        //Тэги
        cy.get('.payment-edit-page')
            .find('[data-field-name="tags"]')
            .type('Мама, как в Mira{enter}')
        cy.get('.payment-edit-page')
            .find('[data-field-name="tags"]')
            .type('Папа, как в Mira{enter}')
        //добавляем платёж через кнопку и проверка + проверка на то, что создался платеж и узнаем его id
        cy.intercept({url: 'https://api.finance.dev.fabrique.studio/api/payments/'}).as('postPayment')
        cy.get('button')
            .contains('Добавить')
            .click()
            .wait('@postPayment').then((xhr) => {
            const {id} = xhr.response.body
            paymentId = id
            cy.log(id, 'id')
        })
        //Переход на страницу платежи, через кнопку обновить
        cy.intercept('https://api.finance.dev.fabrique.studio/api/payments/?page=1&limit=100&date_start=&date_finish=').as('waitResPayments')
        cy.get('button')
            .contains('Обновить')
            .click()
            .wait('@waitResPayments')
    });
    it('Удаление созданного платежа', () => {
        cy.viewport(1920, 1080)

        login()

        cy.get('.pageLayout__content')
            .find('.input')
            .type('Описание перевода средств123{Enter}{Enter}')

        cy.get('.table')
            .find('tbody')
            .find('tr')
            .contains('Описание перевода средств123')
            .click()

        cy.get('.widget__footer')
            .contains('Удалить')
            .click()

        cy.intercept('https://api.finance.dev.fabrique.studio/api/payments/?page=1&limit=100&date_start=&date_finish=').as('waitHomePage')
        cy.get('.swal2-popup')
            .contains('Да')
            .click()
            .wait('@waitHomePage')
    });
    it('Удаление юр.лиц', () => {
        deleteLegalsPerson()
    });
    it('Удаление счётов', () => {
        deleteBills()
    });
})
