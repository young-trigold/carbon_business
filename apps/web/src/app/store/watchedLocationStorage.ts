import axios from 'axios';
import { store } from '.';
import { setMessageState } from './message';
import { UserState, setIsLogin, setUserInfo } from './user';

const getUserInfo = async (token: string) => {
  try {
    const res = await axios.get<UserState['userInfo']>('/api/auth', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    store.dispatch(setIsLogin(true));
    store.dispatch(setUserInfo(res.data));
    store.dispatch(
      setMessageState({
        visible: true,
        text: '登录成功',
        state: 'success',
      }),
    );
  } catch (error) {
    store.dispatch(
      setMessageState({
        visible: true,
        text: '尝试登录失败，请刷新重试',
        state: 'warning',
      }),
    );
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
    if (key === 'token') {
      if (typeof value === 'string') {
        getUserInfo(value);
      }
    }
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
