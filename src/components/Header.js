import logo from "../images/header_logo.svg";
import { useEffect, useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

import NavBar from "./NavBar";

function Header({ loggedIn, resetCurrentUserData, resetLoggedIn }) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <header className="header section">
      <img src={logo} alt="Логотип" className="header__logo" />

      <NavBar
        loggedIn={loggedIn}
        resetCurrentUserData={resetCurrentUserData}
        resetLoggedIn={resetLoggedIn}
      />
    </header>
  );
}

export default Header;
