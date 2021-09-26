import React from 'react'
import { Form, Field } from 'react-final-form'
import { FORM_ERROR } from 'final-form'

import '../css/Auth.css'

const onSubmit = (setIsLoggedIn) => (values) => {
  if (!values.username) {
    return { [FORM_ERROR]: 'Необходим логин' }
  }
  if (!values.password) {
    return { [FORM_ERROR]: 'Необходим пароль' }
  }
  if (values.username !== 'Ekaterina') {
    return { [FORM_ERROR]: 'Неизвестный логин' }
  }
  if (values.password !== 'gtnhjdbxtdf') {
    return { [FORM_ERROR]: 'Ошибка при авторизации' }
  }

  localStorage.setItem(
    'AUTH_TOKEN',
    btoa(`${values.username}:${values.password}`)
  )
  setIsLoggedIn(true)
}

const Auth = ({ setIsLoggedIn }) => {
  return (
    <div className='auth'>
      <div className='auth__form'>
        <div className='auth__title'>Авторизация</div>
        <Form
          onSubmit={onSubmit(setIsLoggedIn)}
          render={({ submitError, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div className='auth__field'>
                <Field name='username'>
                  {({ input }) => (
                    <>
                      <label>Логин:</label>
                      <input {...input} type='text' placeholder='' />
                    </>
                  )}
                </Field>
              </div>
              <div className='auth__field'>
                <Field name='password'>
                  {({ input }) => (
                    <>
                      <label>Пароль:</label>
                      <input {...input} type='password' placeholder='' />
                    </>
                  )}
                </Field>
              </div>
              <div className='auth__submit'>
                <button type='submit'>Войти</button>
              </div>
              {submitError && (
                <div className='auth__error'>
                  <span className='auth__error-cross'>+</span>
                  <span className='auth__error-message'>{submitError}</span>
                </div>
              )}
            </form>
          )}
        />
      </div>
    </div>
  )
}

export default Auth
