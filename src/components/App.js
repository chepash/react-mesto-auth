import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import { api } from "../utils/api.js";

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

import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { RenderLoadingContext } from "../contexts/RenderLoadingContext";

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isPopupWithImageOpen, setPopupWithImageOpen] = useState(false);
  const [isConfirmationPopupOpen, setConfirmationPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});

  const [currentUser, setCurrentUser] = useState({ name: "", about: "", avatar: defaultAvatarPic });
  //важно указать у currentUser начальные значения name, about,
  //иначе реакт будет ругаться про начальные значения null или undefined для управляемых инпутов
  const [loggedIn, setLoggedIn] = useState(false);

  const [isLoading, setLoading] = useState(false);

  const [cards, setCards] = useState([]);

  useEffect(() => {
    Promise.all([api.getUserInfo(), api.getCardList()])
      .then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards);
      })
      .catch((err) => {
        console.log(`Ошибка api getUserInfo/getCardList из promise.all: ${err}`);
      });
  }, []);

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
    setSelectedCard({});
  }

  function handleUpdateUser({ name: profileName, about }) {
    setLoading(true);
    api
      .sendUserInfo(profileName, about)
      .then((userDataFromServer) => {
        setCurrentUser(userDataFromServer);
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
      .then((userDataFromServer) => {
        setCurrentUser(userDataFromServer);
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
        <div className="page__container">
          <Header loggedIn={loggedIn} />

          <Routes>
            <Route
              path="/"
              element={
                loggedIn ? (
                  <Main
                    loggedIn={loggedIn}
                    onEditAvatar={handleEditAvatarClick}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onDeleteBtnClick={handleDeletBtnClick}
                    onCardDelete={handleCardDelete}
                    cards={cards}
                  />
                ) : (
                  <Navigate to="/sign-in" replace />
                )
              }
            />

            <Route path="/sign-in" element={<Login />} />

            <Route path="/sign-up" element={<Register />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Footer />
        </div>

        <RenderLoadingContext.Provider value={isLoading}>
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
        </RenderLoadingContext.Provider>

        {/* popup просмотра изображения */}
        <ImagePopup card={selectedCard} isOpen={isPopupWithImageOpen} onClose={closeAllPopups} />
      </CurrentUserContext.Provider>
    </>
  );
}

export default App;
