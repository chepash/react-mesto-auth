import { useNavigate } from "react-router-dom";

function MobileMenu({ resetLoggedIn }) {
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
        className={`navbar__link button navbar__button navbar__button_type_mobile`}>
        Выйти
      </button>
    </nav>
  );
}

export default MobileMenu;
