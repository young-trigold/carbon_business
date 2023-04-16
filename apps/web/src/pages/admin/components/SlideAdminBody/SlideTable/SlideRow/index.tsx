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
import { client } from '../../../../../../App';
import { useAppDispatch } from '../../../../../../app/store';
import { setMessageState } from '../../../../../../app/store/message';

interface SlideRowProps {
  slide: Slide;
}

export const SlideRow: React.FC<SlideRowProps> = (props) => {
  const { slide } = props;

  const [backgroundImageURL, setBackgroundImageURL] = useState(slide.backgroundImgURL);

  const initialFormState = useMemo<{
    title: string;
    description: string;
    link: string;
    backgroundImg: null | File;
  }>(
    () => ({
      title: slide.title,
      description: slide.description,
      link: slide.link,
      backgroundImg: null,
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

  const onBackgroundImgChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const backgroundImg = event.target.files?.[0];
    if (!backgroundImg) return;
    setFormState((pre) => ({ ...pre, backgroundImg }));
    const fileReader = new FileReader();
    fileReader.addEventListener('load', (event) => {
      console.debug(fileReader.result);
      setBackgroundImageURL(fileReader.result as string);
    });
    fileReader.readAsDataURL(backgroundImg);
  };

  const dispatch = useAppDispatch();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const closeModal = () => {
    setDeleteModalVisible(false);
  };

  const { mutate: updateSlide } = useMutation(
    async (slideId: string) => {
      const formData: FormData = Object.entries(formState).reduce((result, [key, value]) => {
        if (key === 'backgroundImg') result.append('file', value!);
        else result.append(key, value!);
        return result;
      }, new FormData());
      const res = await axios.put<{ fileURL: string }>(`/api/slides/${slideId}`, formData, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('token')}`,
        },
      });
      return res.data;
    },
    {
      onMutate(variables) {
        dispatch(setMessageState({ visible: true, text: '正在更新...', state: 'info' }));
      },
      onError(error, variables, context) {
        dispatch(setMessageState({ visible: true, text: '更新失败!', state: 'error' }));
      },
      onSuccess(data, variables, context) {
        client.setQueryData<Array<Slide>>('slides', (pre) => {
          const updatedSlides = [...pre!];
          const index = pre!.findIndex((slide) => slide.id === props.slide.id);
          updatedSlides.splice(index, 1, {...pre![index], backgroundImgURL: data.fileURL});
          return updatedSlides;
        });
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

  const disabled = formState.backgroundImg === null;

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
          sx={{
            position: 'relative',
          }}
        >
          <img src={backgroundImageURL} width={250} />
          <label
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              position: 'absolute',
              left: 0,
              top: 0,
            }}
          >
            <input hidden accept="image/*" type="file" onChange={onBackgroundImgChange} />
          </label>
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
          disabled={disabled}
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
