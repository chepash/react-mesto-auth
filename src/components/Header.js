import logo from "../images/header_logo.svg";

function Header() {
  return (
    <header className="header section">
      <img src={logo} alt="Логотип" className="header__logo" />
    </header>
  );
}

export default Header;
