import axios from 'axios';
import { store } from '.';
import { setMessageState } from './message';
import { UserState, setIsLogin, setUserInfo } from './user';

export const getUserInfo = async (token: string) => {
  try {
    const res = await axios.get<UserState['userInfo']>('/api/auth', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    store.dispatch(setIsLogin(true));
    store.dispatch(setUserInfo(res.data));
  } catch (error) {
    console.warn('尝试登录失败');
  }
};

const removeUser = () => {
  store.dispatch(setIsLogin(false));
  store.dispatch(setUserInfo(null));
  store.dispatch(
    setMessageState({
      visible: true,
      text: '退出登录成功',
      state: 'success',
    }),
  );
};

const token = window.localStorage.getItem('token');
if (typeof token === 'string') {
  getUserInfo(token);
}

export const watchedLocalStorage = {
  getItem(key: string) {
    const value = window.localStorage.getItem(key);
    return value;
  },
  setItem(key: string, value: string) {
    window.localStorage.setItem(key, value);
    if (key === 'token') getUserInfo(value);
  },
  removeItem(key: string) {
    window.localStorage.removeItem(key);
    if (key === 'token') removeUser();
  },
};

window.watchedLocalStorage = watchedLocalStorage;

declare global {
  interface Window {
    watchedLocalStorage: typeof watchedLocalStorage;
  }
}
