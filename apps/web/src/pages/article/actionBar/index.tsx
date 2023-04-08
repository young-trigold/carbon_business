import axios from 'axios';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PublishIcon from '@mui/icons-material/Publish';
import { Fab, styled } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { setMessageState } from '../../../app/store/message';

const StyledActionBar = styled('aside')((props) => ({
  width: '100px',
  position: 'absolute',
  right: '48px',
  bottom: '148px',
}));

const ActionBar: React.FC = () => {
  const { articleId } = useParams();
  const { editorStore } = useAppSelector((state) => state.articlePage.editor);
  const { hasLogin, userInfo } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const publish = async () => {
    if (!hasLogin) {
     
      dispatch(setMessageState({visible: true, text: '请先登录!', state: 'warning'}))
      return;
    }
    if (userInfo?.permission !== 'admin') {
      dispatch(setMessageState({visible: true, text: '权限不足!', state: 'warning'}))
      return;
    }
    if (!editorStore) return;
    const { view: editorView } = editorStore;
    if (!editorView) return;
    const { state: editorState } = editorView;
    const token = localStorage.getItem('token');

    try {
      await axios.put(
        `/api/articles/${articleId}`,
        {
          content: JSON.stringify(editorState.doc.toJSON()),
        },
        {
          headers: {
            contentType: 'text/plain',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      dispatch(setMessageState({visible: true, text: '发布成功!', state: 'success'}))
    } catch (error) {
      // if (axios.isAxiosError(error))
      //   return message.error((error.response?.data as { message: string })?.message);
      // if (error instanceof Error) return message.error(error.message);
      // return message.error(JSON.stringify(error));
      dispatch(setMessageState({visible: true, text: '发布失败!', state: 'error'}))
    }
  };

  const navigate = useNavigate();

  // const handleCancel = useCallback(() => {
  //   navigate(`/${isChapter ? 'chapters' : 'articles'}/${articleId}`);
  // }, [isChapter, articleId]);

  return (
    <StyledActionBar>
      <Fab
        color="primary"
        aria-label="publish"
        onClick={publish}
      >
        <PublishIcon></PublishIcon>
      </Fab>
    </StyledActionBar>
  );
};

export default ActionBar;
