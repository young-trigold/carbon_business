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
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useState } from 'react';

export const AddArticle = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);

  const closeModal = () => {
    setAddModalVisible(false);
  };

  const addArticle = () => {};

  const [formState, setFormState] = useState({
    date: dayjs().format('YYYY-MM-DD'),
    title: '文章标题',
    subTitle: '文章副标题',
    link: '文章链接',
    backgroundImgURL: '文章背景图链接',
    source: '文章来源',
  });

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
    const img = event.target.files?.[0];
    setFormState((preForm) => ({
      ...preForm,
      img,
    }));
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
            ></TextField>

            <Button variant="contained" component="label" fullWidth>
              文章背景图上传
              <input
                hidden
                accept="image/*"
                multiple
                type="file"
                onChange={onBackgroundImgChange}
              />
            </Button>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeModal}>取消</Button>
          <Button
            onClick={() => {
              addArticle();
            }}
            variant='contained'
          >
            添加
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
