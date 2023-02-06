import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import { api } from "../utils/api.js";
import * as authApi from "../utils/authApi.js";

import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import Login from "./Login";
import Register from "./Register.js";

import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import defaultAvatarPic from "../images/default_profile_pic.jpg";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmationPopup from "./ConfirmationPopup";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";

import HamburgerButton from "./HamburgerButton";

import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { RenderLoadingContext } from "../contexts/RenderLoadingContext";

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isPopupWithImageOpen, setPopupWithImageOpen] = useState(false);
  const [isConfirmationPopupOpen, setConfirmationPopupOpen] = useState(false);

  const [isInfoTooltipState, setInfoTooltipState] = useState({ isOpen: false, isRegOk: false });

  const [selectedCard, setSelectedCard] = useState({});

  const [currentUser, setCurrentUser] = useState({
    name: "",
    about: "",
    _id: "",
    avatar: defaultAvatarPic,
  });
  //важно указать у currentUser начальные значения всех полей используемых в приложении
  //иначе реакт будет ругаться про начальные значения null или undefined для управляемых инпутов
  const [loggedIn, setLoggedIn] = useState(false);

  const [isLoading, setLoading] = useState(false);

  const [cards, setCards] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    tokenCheck()
      .then(() => {
        if (loggedIn) {
          Promise.all([api.getUserInfo(), api.getCardList()])
            .then(([user, cards]) => {
              setCurrentUser({
                ...currentUser,
                name: user.name,
                about: user.about,
                _id: user._id,
                avatar: user.avatar,
              });
              setCards(cards);
            })
            .then(() => console.log("currentUser after gettingCards : ", currentUser))
            .catch((err) => {
              console.log(`Ошибка api getUserInfo/getCardList из promise.all: ${err}`);
            });
        }
      })
      .catch((err) => {
        console.log(`Ошибка ошибка проверки jwt: ${err}`);
      });
  }, [loggedIn]);

  function handleRegister({ email, password }) {
    setLoading(true);

    authApi
      .register(email, password)
      .then(() => {
        handleShowInfoTooltip(true);
        navigate("/login");
      })
      .catch(() => {
        handleShowInfoTooltip(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleLogin({ email, password }, resetForm) {
    setLoading(true);

    return authApi
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("email", email);
          resetForm();
          setLoggedIn(true);
          navigate("/");
        }
      })
      .then(() => console.log("currentUser after handleLogin : ", currentUser))
      .catch((error) => {
        console.log("Неправильный логин или пароль: ", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function tokenCheck() {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      return authApi.getContent(jwt).then(() => {
        setLoggedIn(true);
        navigate("/");
      });
    } else {
      return Promise.resolve(jwt);
    }
  }

  function resetCurrentUserData() {
    setCurrentUser({
      name: "",
      about: "",
      _id: "",
      avatar: defaultAvatarPic,
    });
  }

  function resetLoggedIn() {
    setLoggedIn(false);
  }

  function handleShowInfoTooltip(isRegOk) {
    setInfoTooltipState({ isOpen: true, isRegOk: isRegOk });
  }

  function handleCardLike(currentCard) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLikedByMe = currentCard.likes.some((ownerData) => ownerData._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(currentCard._id, isLikedByMe)
      .then((newCardFromServer) => {
        setCards((state) =>
          state.map((oldCard) => (oldCard._id === currentCard._id ? newCardFromServer : oldCard))
        );
      })
      .catch((err) => {
        console.log(`Ошибка api промиса changeLikeCardStatus: ${err}`);
      });
  }

  function handleCardDelete(currentCard) {
    setLoading(true);
    // Отправляем запрос в API и после успешного удаления обновляем список карточек через state(массив карточек)
    api
      .sendСardDeleteRequest(currentCard._id)
      .then(() => {
        setCards((state) => state.filter((oldCard) => oldCard._id !== currentCard._id));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка api промиса sendСardDeleteRequest: ${err}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleCardClick(cardData) {
    setPopupWithImageOpen(true);
    setSelectedCard(cardData);
  }

  function handleDeletBtnClick(cardData) {
    setConfirmationPopupOpen(true);
    setSelectedCard(cardData);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setPopupWithImageOpen(false);
    setConfirmationPopupOpen(false);
    setInfoTooltipState({ ...isInfoTooltipState, isOpen: false });
    setSelectedCard({});
  }

  function handleUpdateUser({ name: profileName, about }) {
    setLoading(true);
    api
      .sendUserInfo(profileName, about)
      .then((userData) => {
        setCurrentUser({ ...currentUser, ...userData });
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка api промиса sendUserInfo: ${err}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleUpdateAvatar({ avatarLink }) {
    setLoading(true);
    api
      .sendUserAvatar(avatarLink)
      .then((userData) => {
        setCurrentUser({ ...currentUser, ...userData });
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка api промиса sendUserAvatar: ${err}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleAddPlaceSubmit({ placeName, placeLink }) {
    setLoading(true);
    api
      .sendNewCardInfo(placeName, placeLink)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка api sendNewCardInfo: ${err}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>
        <RenderLoadingContext.Provider value={isLoading}>
          <div className="page__container">
            {loggedIn && <HamburgerButton />}
            <Header
              loggedIn={loggedIn}
              resetCurrentUserData={resetCurrentUserData}
              resetLoggedIn={resetLoggedIn}
            />

            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute
                    loggedIn={loggedIn}
                    onEditAvatar={handleEditAvatarClick}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onDeleteBtnClick={handleDeletBtnClick}
                    onCardDelete={handleCardDelete}
                    cards={cards}
                    component={Main}
                  />
                }
              />

              <Route path="/sign-in" element={<Login handleLogin={handleLogin} />} />

              <Route path="/sign-up" element={<Register handleRegister={handleRegister} />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {loggedIn && <Footer />}
          </div>

          <InfoTooltip
            isOpen={isInfoTooltipState.isOpen}
            isRegOk={isInfoTooltipState.isRegOk}
            onClose={closeAllPopups}
          />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
          />

          <ConfirmationPopup
            isOpen={isConfirmationPopupOpen}
            onClose={closeAllPopups}
            card={selectedCard}
            onCardDelete={handleCardDelete}
          />

          {/* popup просмотра изображения */}
          <ImagePopup card={selectedCard} isOpen={isPopupWithImageOpen} onClose={closeAllPopups} />
        </RenderLoadingContext.Provider>
      </CurrentUserContext.Provider>
    </>
  );
}

export default App;
