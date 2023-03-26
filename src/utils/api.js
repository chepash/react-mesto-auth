import { cardServerApiOptions } from './config';

class Api {
  constructor(options) {
    this.baseUrl = options.baseUrl;
    this.authToken = options.headers.authorization;
  }

  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(new Error(`Ошибка: ${res.status}`));
    }
    return res.json();
  }

  getCardList() {
    return fetch(`${this.baseUrl}/cards`, {
      headers: {
        authorization: this.authToken,
      },
    }).then(this._getResponseData);
  }

  getUserInfo() {
    return fetch(`${this.baseUrl}/users/me`, {
      headers: {
        authorization: this.authToken,
      },
    }).then(this._getResponseData);
  }

  sendNewCardInfo(name, link) {
    return fetch(`${this.baseUrl}/cards`, {
      method: 'POST',
      headers: {
        authorization: this.authToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        link,
      }),
    }).then(this._getResponseData);
  }

  sendUserInfo(name, about) {
    return fetch(`${this.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: this.authToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        about,
      }),
    }).then(this._getResponseData);
  }

  sendUserAvatar(avatarUrl) {
    return fetch(`${this.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: this.authToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        avatar: avatarUrl,
      }),
    }).then(this._getResponseData);
  }

  sendСardDeleteRequest(cardId) {
    return fetch(`${this.baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        authorization: this.authToken,
      },
    }).then(this._getResponseData);
  }

  changeLikeCardStatus(cardId, isLikedByMe) {
    return fetch(`${this.baseUrl}/cards/${cardId}/likes`, {
      method: isLikedByMe ? 'DELETE' : 'PUT',
      headers: {
        authorization: this.authToken,
      },
    }).then(this._getResponseData);
  }
}

const api = new Api(cardServerApiOptions);

export default api;
