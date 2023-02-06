import logo from "../images/header_logo.svg";
import NavBar from "./NavBar";
import MobileMenu from "./MobileMenu";

import HamburgerButton from "./HamburgerButton";

function Header({ loggedIn, resetLoggedIn }) {
  return (
    <>
      {loggedIn && <MobileMenu loggedIn={loggedIn} resetLoggedIn={resetLoggedIn} />}

      <header className="header section">
        <img src={logo} alt="Логотип" className="header__logo" />

        <NavBar loggedIn={loggedIn} resetLoggedIn={resetLoggedIn} />

        {loggedIn && <HamburgerButton />}
      </header>
    </>
  );
}

export default Header;
