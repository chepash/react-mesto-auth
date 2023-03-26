const BASE_URL = 'https://auth.nomoreparties.co';

const getResponse = (res) => (res.ok ? res.json() : Promise.reject(new Error(`Ошибка: ${res.status}`)));

export const register = (email, password) => fetch(`${BASE_URL}/signup`, {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    password,
    email,
  }),
}).then(getResponse);

export const authorize = (email, password) => fetch(`${BASE_URL}/signin`, {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    password,
    email,
  }),
}).then(getResponse);

export const getContent = (token) => fetch(`${BASE_URL}/users/me`, {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
}).then(getResponse);
