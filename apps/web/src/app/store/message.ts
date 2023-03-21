import { AlertColor } from '@mui/material';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface MessageState {
  visible: boolean;
  text: string;
  state: AlertColor;
}

const initialState: MessageState = {
  visible: false,
  text: '',
  state: 'info',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setMessageState(state, action: PayloadAction<MessageState>) {
      state.state = action.payload.state;
      state.text = action.payload.text;
      state.visible = action.payload.visible;
    },
    setMessageVisible(state, action: PayloadAction<boolean>) {
      state.visible = action.payload;
    }
  },
});

export const { setMessageState, setMessageVisible } = userSlice.actions;

export default userSlice.reducer;
