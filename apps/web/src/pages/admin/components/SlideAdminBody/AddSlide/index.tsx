import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import Fab from '@mui/material/Fab';
import axios from 'axios';
import dayjs from 'dayjs';
import { Slide } from 'lib';
import { useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../../app/store';
import { setMessageState } from '../../../../../app/store/message';

interface FormState {
  title: string;
  description: string;
  link: string;
  backgroundImg: null | File;
}

export const AddSlide = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);

  const closeModal = () => {
    setAddModalVisible(false);
  };

  const initialFormState = useMemo<FormState>(
    () => ({
      title: '标题',
      description: '描述',
      backgroundImg: null,
      link: '',
    }),
    [],
  );

  const [formState, setFormState] = useState(initialFormState);

  const dispatch = useAppDispatch();

  const { curPage, pageSize } = useAppSelector((state) => state.adminPage.bodies.articleBody);

  const navigate = useNavigate();

  const { mutate: addSlide } = useMutation(
    async () => {
      const formData: FormData = Object.entries(formState).reduce((result, [key, value]) => {
        if (key === 'backgroundImg') result.append('file', value!);
        else result.append(key, value!);
        return result;
      }, new FormData());

      const res = await axios.post<{ newSlide: Slide }>('/api/slides', formData);
      return res.data;
    },
    {
      onMutate(variables) {
        dispatch(setMessageState({ text: '正在上传', state: 'info', visible: true }));
      },
      onError(error, variables, context) {
        dispatch(setMessageState({ text: '上传失败!', state: 'error', visible: true }));
      },
      onSuccess(data, variables, context) {
        dispatch(setMessageState({ text: '上传成功!', state: 'success', visible: true }));
        setFormState(initialFormState);
        // client.setQueryData<{
        //   articles: Article[];
        //   totalPageCount: number;
        // }>(['articles', curPage, pageSize], (pre) => {
        //   return {
        //     ...pre!,
        //     articles: [data.newArticle, ...(pre?.articles ?? [])],
        //   };
        // });
      },
    },
  );

  const onDateChange = (value: { $d: string }) => {
    setFormState((preForm) => ({
      ...preForm,
      date: dayjs(new Date(value.$d)).format('YYYY-MM-DD'),
    }));
  };

  const onTitleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const title = event.target.value;
    setFormState((preForm) => ({
      ...preForm,
      title,
    }));
  };

  const onSubTitleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const subTitle = event.target.value;
    setFormState((preForm) => ({
      ...preForm,
      subTitle,
    }));
  };

  const onSourceChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const source = event.target.value;
    setFormState((preForm) => ({
      ...preForm,
      source,
    }));
  };

  const onLinkChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const link = event.target.value;
    setFormState((preForm) => ({
      ...preForm,
      link,
    }));
  };

  const onBackgroundImgChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const backgroundImg = event.target.files?.[0];
    if (!backgroundImg) return;
    setFormState((preForm) => ({
      ...preForm,
      backgroundImg,
    }));
  };

  const onOwnBySelfCheckBoxChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const ownBySelf = event.target.checked;
    setFormState((preForm) => ({ ...preForm, ownBySelf }));
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'absolute',
          right: '48px',
          bottom: '48px',
        }}
        onClick={() => setAddModalVisible(true)}
      >
        <AddIcon />
      </Fab>
      <Dialog maxWidth={false} open={addModalVisible} onClose={closeModal}>
        <DialogTitle>添加轮播图</DialogTitle>
        <DialogContent>
          <Box width={500} component="form">
            <TextField
              fullWidth
              value={formState.title}
              label="标题"
              multiline
              maxRows={6}
              sx={{
                margin: '0.5em 0',
              }}
              onChange={onTitleChange}
            ></TextField>
            <TextField
              fullWidth
              value={formState.description}
              label="描述"
              multiline
              maxRows={6}
              sx={{
                margin: '0.5em 0',
              }}
              onChange={onSubTitleChange}
            ></TextField>
            {
              <TextField
                fullWidth
                value={formState.link}
                label="链接"
                multiline
                maxRows={4}
                sx={{
                  margin: '0.5em 0',
                }}
                onChange={onLinkChange}
              />
            }

            <Button variant="contained" component="label" fullWidth>
              {formState.backgroundImg instanceof File
                ? `${formState.backgroundImg.name}`
                : '背景图上传'}
              <input hidden accept="image/*" type="file" onChange={onBackgroundImgChange} />
            </Button>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeModal}>取消</Button>
          <Button
            onClick={() => addSlide()}
            variant="contained"
            disabled={
              Object.entries(formState)
                .filter(([key]) => key !== 'backgroundImg')
                .every(([key, value]) => initialFormState[key as keyof FormState] === value) ||
              formState.backgroundImg === null
            }
          >
            添加
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
