import logo from "../images/header_logo.svg";
import NavBar from "./NavBar";
import MobileMenu from "./MobileMenu";

function Header({ loggedIn, resetLoggedIn }) {
  return (
    <>
      {loggedIn && <MobileMenu resetLoggedIn={resetLoggedIn} />}

      <header className="header section">
        <img src={logo} alt="Логотип" className="header__logo" />

        <NavBar loggedIn={loggedIn} resetLoggedIn={resetLoggedIn} />
      </header>
    </>
  );
}

export default Header;
