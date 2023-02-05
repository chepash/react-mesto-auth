import { useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function NavBar({ loggedIn, resetCurrentUserData, resetLoggedIn }) {
  const currentUser = useContext(CurrentUserContext);
  const navigate = useNavigate();

  const email = localStorage.getItem("email");

  function signOut() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("email");
    resetLoggedIn();
    navigate("/sign-in");
  }

  return (
    <nav className="navbar">
      <p className="navbar__text">{email ? email : ""}</p>

      {!loggedIn && (
        <>
          <NavLink
            className={({ isActive }) => `navbar__link ${isActive ? "navbar__link_hidden" : ""}`}
            to="/sign-in">
            Войти
          </NavLink>
          <NavLink
            className={({ isActive }) => `navbar__link ${isActive ? "navbar__link_hidden" : ""}`}
            to="/sign-up">
            Регистрация
          </NavLink>
        </>
      )}

      <button
        onClick={signOut}
        className={`navbar__link button navbar__button ${!loggedIn ? "navbar__link_hidden" : ""}`}>
        Выйти
      </button>
    </nav>
  );
}

export default NavBar;
