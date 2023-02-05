import logo from "../images/header_logo.svg";
import NavBar from "./NavBar";

import HamburgerButton from "./HamburgerButton";

function Header({ loggedIn, resetLoggedIn }) {
  return (
    <header className="header section">
      <img src={logo} alt="Логотип" className="header__logo" />

      <NavBar loggedIn={loggedIn} resetLoggedIn={resetLoggedIn} />

      {loggedIn && <HamburgerButton />}
    </header>
  );
}

export default Header;
