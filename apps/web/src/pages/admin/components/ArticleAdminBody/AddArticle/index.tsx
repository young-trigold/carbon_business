import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from '@mui/material';
import Fab from '@mui/material/Fab';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import dayjs from 'dayjs';
import { Article } from 'lib';
import { useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { client } from '../../../../../App';
import { useAppDispatch, useAppSelector } from '../../../../../app/store';
import { setMessageState } from '../../../../../app/store/message';

interface FormState {
  date: string;
  title: string;
  subTitle: string;
  link?: string;
  backgroundImg: null | File;
  source: string;
  ownBySelf: boolean;
}

export const AddArticle = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);

  const closeModal = () => {
    setAddModalVisible(false);
  };

  const initialFormState = useMemo<FormState>(
    () => ({
      date: dayjs().format('YYYY-MM-DD'),
      title: '文章标题',
      subTitle: '文章副标题',
      backgroundImg: null,
      source: '文章来源',
      ownBySelf: true,
    }),
    [],
  );

  const [formState, setFormState] = useState(initialFormState);

  const dispatch = useAppDispatch();

  const { curPage, pageSize } = useAppSelector((state) => state.adminPage.bodies.articleBody);

  const navigate = useNavigate();

  const { mutate: addArticle } = useMutation(
    async () => {
      const formData: FormData = Object.entries(formState).reduce((result, [key, value]) => {
        if (key === 'backgroundImg') result.append('file', value!);
        else result.append(key, value!);
        return result;
      }, new FormData());

      const res = await axios.post<{ newArticle: Article }>('/api/articles', formData);
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
        client.setQueryData<{
          articles: Article[];
          totalPageCount: number;
        }>(['articles', curPage, pageSize], (pre) => {
          return {
            ...pre!,
            articles: [data.newArticle, ...(pre?.articles ?? [])],
          };
        });
        console.debug(data.newArticle);
        navigate(`/articles/edit/${data.newArticle.id}`);
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
        <DialogTitle>添加文章</DialogTitle>
        <DialogContent>
          <Box width={500} component="form">
            <Box
              sx={{
                margin: '0.5em 0',
              }}
            >
              <DatePicker
                label="文章日期"
                value={formState.date}
                maxDate={dayjs().format('YYYY-MM-DD')}
                onChange={onDateChange as any}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>

            <TextField
              fullWidth
              value={formState.title}
              label="文章标题"
              multiline
              maxRows={6}
              sx={{
                margin: '0.5em 0',
              }}
              onChange={onTitleChange}
            ></TextField>
            <TextField
              fullWidth
              value={formState.subTitle}
              label="文章副标题"
              multiline
              maxRows={6}
              sx={{
                margin: '0.5em 0',
              }}
              onChange={onSubTitleChange}
            ></TextField>
            <TextField
              fullWidth
              value={formState.source}
              label="文章来源"
              multiline
              maxRows={4}
              sx={{
                margin: '0.5em 0',
              }}
              onChange={onSourceChange}
            ></TextField>
            {!formState.ownBySelf && (
              <TextField
                fullWidth
                value={formState.link}
                label="文章链接"
                multiline
                maxRows={4}
                sx={{
                  margin: '0.5em 0',
                }}
                onChange={onLinkChange}
              />
            )}

            <FormControlLabel
              control={
                <Checkbox
                  checked={formState.ownBySelf}
                  onChange={onOwnBySelfCheckBoxChange}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="自有文章"
            />
            <Button variant="contained" component="label" fullWidth>
              {formState.backgroundImg instanceof File
                ? `${formState.backgroundImg.name}`
                : '文章背景图上传'}
              <input hidden accept="image/*" type="file" onChange={onBackgroundImgChange} />
            </Button>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeModal}>取消</Button>
          <Button
            onClick={() => addArticle()}
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
