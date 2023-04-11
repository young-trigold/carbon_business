import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableCell,
  TableRow,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { Slide } from 'lib';
import { useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../../../../app/store';
import { setMessageState } from '../../../../../../app/store/message';

interface SlideRowProps {
  slide: Slide;
}

export const SlideRow: React.FC<SlideRowProps> = (props) => {
  const { slide } = props;

  const initialFormState = useMemo(
    () => ({
      title: slide.title,
      description: slide.description,
      link: slide.link,
      backgroundImgURL: slide.backgroundImgURL,
    }),
    [],
  );

  const [formState, setFormState] = useState(initialFormState);

  const onTitleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const title = event.target.value;
    setFormState((preForm) => ({
      ...preForm,
      title,
    }));
  };

  const onDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const description = event.target.value;
    setFormState((preForm) => ({
      ...preForm,
      description,
    }));
  };

  const onLinkChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const link = event.target.value;
    setFormState((preForm) => ({
      ...preForm,
      link,
    }));
  };

  const onBackgroundImgURLChange = () => {};

  const dispatch = useAppDispatch();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const closeModal = () => {
    setDeleteModalVisible(false);
  };

  const { mutate: updateSlide } = useMutation(
    (slideId: string) => {
      return axios.put(`/api/slides/${slideId}`, formState, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('token')}`,
        },
      });
    },
    {
      onMutate(variables) {
        dispatch(setMessageState({ visible: true, text: '正在更新...', state: 'info' }));
      },
      onError(error, variables, context) {
        dispatch(setMessageState({ visible: true, text: '更新失败!', state: 'error' }));
      },
      onSuccess(data, variables, context) {
        // client.setQueryData<{
        //   slides: Slide[];
        //   totalPageCount: number;
        // }>(['slides', curPage, pageSize], (pre) => ({
        //   ...pre!,
        //   slides: pre!.slides.map((preSlide) => {
        //     if (preSlide.id === slide.id) return { ...preSlide, ...formState };
        //     return preSlide;
        //   }),
        // }));
        dispatch(setMessageState({ visible: true, text: '更新成功!', state: 'success' }));
      },
    },
  );

  const { mutate: deleteSlide } = useMutation(
    (slideId: string) => {
      return axios.delete(`/api/slides/${slideId}`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('token')}`,
        },
      });
    },
    {
      onMutate(variables) {
        dispatch(setMessageState({ state: 'info', visible: true, text: '正在删除...' }));
      },
      onError(error, variables, context) {
        dispatch(setMessageState({ state: 'error', visible: true, text: '删除失败!' }));
      },
      onSuccess(data, variables, context) {
        // client.setQueryData<{
        //   slides: Slide[];
        //   totalPageCount: number;
        // }>(['slides', curPage, pageSize], (pre) => {
        //   return {
        //     ...pre!,
        //     slides: pre!.slides.filter((preSlide) => preSlide.id !== slide.id),
        //   };
        // });
        dispatch(setMessageState({ state: 'success', visible: true, text: '删除成功!' }));
        closeModal();
      },
    },
  );

  const navigate = useNavigate();

  return (
    <TableRow key={slide.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell component="th" scope="row">
        <TextField
          onChange={onTitleChange}
          multiline
          maxRows={6}
          variant="standard"
          value={formState.title}
        ></TextField>
      </TableCell>
      <TableCell>
        <TextField
          onChange={onDescriptionChange}
          multiline
          maxRows={10}
          variant="standard"
          value={formState.description}
        ></TextField>
      </TableCell>
      <TableCell>
        {
          <TextField
            onChange={onLinkChange}
            multiline
            maxRows={4}
            variant="standard"
            value={formState.link}
          ></TextField>
        }
      </TableCell>
      <TableCell>
        <Box
          width={150}
          height={100}
          sx={{
            backgroundSize: 'cover',
            backgroundImage: `url(${formState.backgroundImgURL})`,
          }}
        >
          {/* <input accept="image/*" type="file" /> */}
        </Box>
      </TableCell>

      <TableCell>
        <Button
          variant="outlined"
          sx={{ marginRight: '1em' }}
          onClick={() => {
            setDeleteModalVisible(true);
          }}
        >
          删除
        </Button>

        <Button
          variant="outlined"
          onClick={() => {
            updateSlide(slide.id);
          }}
          disabled={JSON.stringify(initialFormState) === JSON.stringify(formState)}
        >
          更新
        </Button>
      </TableCell>
      <Dialog maxWidth={false} open={deleteModalVisible} onClose={closeModal}>
        <DialogTitle>确认删除</DialogTitle>
        <Box width={500}>
          <DialogContent>您确定要删除该轮播图吗？</DialogContent>
        </Box>
        <DialogActions>
          <Button onClick={closeModal}>取消</Button>
          <Button
            onClick={() => {
              deleteSlide(slide.id);
            }}
          >
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </TableRow>
  );
};
