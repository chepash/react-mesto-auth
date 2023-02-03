import { useEffect, useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

import Input from "./Input";

import { useFormWithValidation } from "./useFormWithValidation";

function Login() {
  const { values, handleChange, errors, isValid, resetForm } = useFormWithValidation();

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <main className="content section section_size_narrow page__content">
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
            value={values.login || ""}
            error={errors.login}
            onChange={handleChange}
            name="login"
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
