import { useEffect, useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

import Input from "./Input";

import { useFormWithValidation } from "./useFormWithValidation";

function Login({ handleLogin }) {
  const currentUser = useContext(CurrentUserContext);

  const { values, handleChange, errors, isValid, resetForm } = useFormWithValidation();

  function handleSubmit(e) {
    e.preventDefault();

    if (!isValid) {
      return;
    }

    handleLogin(values)
      .then(() => {
        resetForm();
      })
      .catch((error) => {
        console.log("Неправильный логин или пароль : ", error);
      });
  }

  return (
    <main className="content section section_size_narrow">
      <form
        action="some_URL"
        method="get"
        onSubmit={handleSubmit}
        className="form form_type_account"
        name={`form_type_login`}
        noValidate>
        <h2 className="form__title form__title_type_account">Вход</h2>

        <div className="form__inputs-container form__inputs-container_type_account">
          <Input
            type="email"
            placeholder="Email"
            value={values.email || ""}
            error={errors.email}
            onChange={handleChange}
            name="email"
            additionalClassName="form__input_type_account"
            additionalErrorClassName="form__error_type_account"
            minLength="2"
            maxLength="40"
            required
          />

          <Input
            type="password"
            placeholder="Пароль"
            value={values.password || ""}
            error={errors.password}
            onChange={handleChange}
            name="password"
            additionalClassName="form__input_type_account"
            additionalErrorClassName="form__error_type_account"
            minLength="2"
            maxLength="200"
            required
          />
        </div>

        <button
          type="submit"
          className={"button button_type_submit button_color_white"}
          disabled={false}>
          Войти
        </button>
      </form>
    </main>
  );
}

export default Login;
