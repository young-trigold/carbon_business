import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useAppDispatch } from '../../../../app/store';
import { setMessageState } from '../../../../app/store/message';
import { UserState, setIsLogin, setUserInfo } from '../../../../app/store/user';

export const LoginButton = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const [logging, setLogging] = useState(true);

  const initialName = {
    value: '',
    isError: true,
    errorText: '昵称不能为空',
  };
  const [name, setName] = useState(initialName);
  const initialPassword = {
    value: '',
    isError: true,
    errorText: '密码不能为空',
  };
  const [password, setPassword] = useState(initialPassword);
  const closeModal = () => {
    setModalVisible(false);
    setName(initialName);
    setPassword(initialPassword);
  };

  const dispatch = useAppDispatch();

  const login = async () => {
    dispatch(setMessageState({ visible: true, text: '正在登录...', state: 'info' }));

    try {
      const res = await axios.post<{ token: 'string'; userInfo: UserState['userInfo'] }>(
        '/api/login',
        {
          name: name.value,
          password: password.value,
        },
      );

      const token = res.data.token;
      self.localStorage.setItem('token', token);
      closeModal();
      dispatch(setIsLogin(true));
      const userInfo = res.data.userInfo;
      dispatch(setUserInfo(userInfo));

      dispatch(setMessageState({ visible: true, text: '登录成功', state: 'success' }));
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(
          setMessageState({
            visible: true,
            text: error?.response?.data?.message ?? '登录失败',
            state: 'error',
          }),
        );
      }
    }
  };

  const register = async () => {
    setMessageState({ visible: true, text: '正在注册...', state: 'info' });
    try {
      await axios.post('/api/register', {
        name: name.value,
        password: password.value,
      });
      setMessageState({ visible: true, text: '注册成功', state: 'success' });
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        setMessageState({
          visible: true,
          text: error?.response?.data?.message ?? '注册失败',
          state: 'error',
        });
      }
    }
  };

  const nameField = (
    <TextField
      required
      margin="dense"
      id="name"
      label="用户名"
      type="text"
      fullWidth
      variant="standard"
      value={name.value}
      onChange={(event) => {
        if (name.value.length === 0) {
          setName({
            value: event.target.value,
            isError: true,
            errorText: '昵称不能为空',
          });
        } else {
          setName({
            value: event.target.value,
            isError: false,
            errorText: '',
          });
        }
      }}
      error={name.isError}
      helperText={name.errorText}
    />
  );

  const passwordField = (
    <TextField
      required
      margin="dense"
      id="password"
      label="密码"
      type="password"
      fullWidth
      variant="standard"
      value={password.value}
      onChange={(event) => {
        if (password.value.length === 0) {
          setPassword({
            value: event.target.value,
            isError: true,
            errorText: '密码不能为空',
          });
        } else if (password.value.length < 6) {
          setPassword({
            value: event.target.value,
            isError: true,
            errorText: '密码长度必须大于等于6位',
          });
        } else {
          setPassword({
            value: event.target.value,
            isError: false,
            errorText: '',
          });
        }
      }}
      error={password.isError}
      helperText={password.errorText}
    />
  );

  return (
    <Box>
      <Button
        sx={{
          color: 'inherit',
        }}
        onClick={openModal}
      >
        登录/注册
      </Button>
      <Dialog maxWidth="sm" fullWidth open={modalVisible} onClose={closeModal}>
        {logging ? (
          <>
            <DialogTitle>请登录</DialogTitle>
            <DialogContent>
              {nameField}
              {passwordField}
              <Button
                onClick={() => {
                  setLogging(false);
                  setName(initialName);
                  setPassword(initialPassword);
                }}
              >
                没有账号？去注册
              </Button>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeModal}>取消</Button>
              <Button onClick={login} disabled={name.isError || password.isError}>
                登录
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>请注册</DialogTitle>
            <DialogContent>
              {nameField}
              {passwordField}
              <Button
                onClick={() => {
                  setLogging(true);
                }}
              >
                去登录
              </Button>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeModal}>取消</Button>
              <Button onClick={register} disabled={name.isError || password.isError}>
                注册
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};
