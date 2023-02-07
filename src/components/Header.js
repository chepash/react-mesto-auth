import logo from "../images/header_logo.svg";
import NavBar from "./NavBar";
import MobileMenu from "./MobileMenu";

function Header({ loggedIn, handleSignOut }) {
  return (
    <>
      {loggedIn && <MobileMenu handleSignOut={handleSignOut} />}

      <header className="header section">
        <img src={logo} alt="Логотип" className="header__logo" />

        <NavBar loggedIn={loggedIn} handleSignOut={handleSignOut} />
      </header>
    </>
  );
}

export default Header;
