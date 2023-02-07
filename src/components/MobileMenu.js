import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function MobileMenu({ handleSignOut }) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <nav className="section navbar navbar_type_mobile">
      <p className="navbar__text">{currentUser.email ? currentUser.email : ""}</p>

      <button
        onClick={handleSignOut}
        className={`navbar__link button navbar__button navbar__button_type_mobile`}>
        Выйти
      </button>
    </nav>
  );
}

export default MobileMenu;
