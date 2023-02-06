import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function MobileMenu({ loggedIn, resetLoggedIn }) {
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
    <nav className="section navbar navbar_type_mobile">
      <p className="navbar__text">{email ? email : ""}</p>

      <button
        onClick={signOut}
        className={`navbar__link button navbar__button ${!loggedIn ? "navbar__link_hidden" : ""}`}>
        Выйти
      </button>
    </nav>
  );
}

export default MobileMenu;
