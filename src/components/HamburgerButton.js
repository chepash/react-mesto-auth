import { useContext } from "react";

function HamburgerButton({ loggedIn, resetLoggedIn }) {
  return (
    <>
      <input id="toggle" type="checkbox" className="header__toggle" />
      <label for="toggle" className="button button_type_hamburger">
        <div className="top-bun button__part"></div>
        <div className="meat button__part"></div>
        <div className="bottom-bun button__part"></div>
      </label>
    </>
  );
}

export default HamburgerButton;