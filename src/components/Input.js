function Input({ value, error, onChange, ...props }) {
  return (
    <label className="form__input-wrap">
      <input
        className={"form__input" + (error ? " form__input_type_error" : "")}
        value={value}
        onChange={onChange}
        {...props}
      />
      <span className={"form__error" + (error ? " form__error_visible" : "")}>{error}</span>
    </label>
  );
}

export default Input;
