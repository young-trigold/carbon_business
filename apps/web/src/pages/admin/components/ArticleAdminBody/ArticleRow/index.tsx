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
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { Article } from 'lib';
import { useMemo, useState } from 'react';

interface ArticleRowProps {
  article: Article;
}

export const ArticleRow: React.FC<ArticleRowProps> = (props) => {
  const { article } = props;

  const initialFormState = useMemo(
    () => ({
      title: article.title,
      source: article.source,
      date: article.date,
      link: article.link,
      backgroundImgURL: article.backgroundImgURL,
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

  const onBackgroundImgURLChange = () => {};

  const onDateChange = (value: { $d: string }) => {
    setFormState((preForm) => ({
      ...preForm,
      date: dayjs(new Date(value.$d)).format('YYYY-MM-DD'),
    }));
  };

  const updateArticle = () => {};

  const deleteArticle = () => {};

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const closeModal = () => {
    setDeleteModalVisible(false);
  };

  return (
    <TableRow key={article.title} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
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
          onChange={onSourceChange}
          variant="standard"
          value={formState.source}
        ></TextField>
      </TableCell>
      <TableCell>
        <TextField
          onChange={onLinkChange}
          multiline
          maxRows={4}
          variant="standard"
          value={formState.link}
        ></TextField>
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
        <DatePicker
          value={formState.date}
          maxDate={dayjs().format('YYYY-MM-DD')}
          onChange={onDateChange as any}
          renderInput={(params) => <TextField {...params} />}
        />
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

        <Button variant="outlined" onClick={updateArticle}>
          更新
        </Button>
      </TableCell>
      <Dialog maxWidth={false} open={deleteModalVisible} onClose={closeModal}>
        <DialogTitle>确认删除</DialogTitle>
        <Box width={500}>
          <DialogContent>您确定要删除该文章吗？</DialogContent>
        </Box>
        <DialogActions>
          <Button onClick={closeModal}>取消</Button>
          <Button onClick={deleteArticle}>确定</Button>
        </DialogActions>
      </Dialog>
    </TableRow>
  );
};
