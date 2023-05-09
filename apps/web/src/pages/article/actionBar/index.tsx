import PublishIcon from '@mui/icons-material/Publish';
import { Fab, Tooltip, styled } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { setMessageState } from '../../../app/store/message';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

const StyledActionBar = styled('aside')((props) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  right: '48px',
  top: '60%',
  "&>button": {
    marginBottom: '2em'
  }
}));

const ActionBar: React.FC = () => {
  const { articleId } = useParams();
  const { editorStore } = useAppSelector((state) => state.articlePage.editor);
  const { hasLogin, userInfo } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const publish = async () => {
    if (!hasLogin) {
      dispatch(setMessageState({ visible: true, text: '请先登录!', state: 'warning' }));
      return;
    }
    if (userInfo?.permission !== 'admin') {
      dispatch(setMessageState({ visible: true, text: '权限不足!', state: 'warning' }));
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
      dispatch(setMessageState({ visible: true, text: '发布成功!', state: 'success' }));
      location.href = '/';
    } catch (error) {
      dispatch(setMessageState({ visible: true, text: '发布失败!', state: 'error' }));
    }
  };

  const navigate = useNavigate();

  const navigateToQAPage = () => {
    navigate(`/articles/645a30c5ac8134096f9b7c52`);
  };

  return (
    <StyledActionBar>
      <Tooltip title="帮助">
        <Fab color="primary" aria-label="question" onClick={navigateToQAPage}>
          <QuestionMarkIcon></QuestionMarkIcon>
        </Fab>
      </Tooltip>
      <Tooltip title="发布">
        <Fab color="primary" aria-label="publish" onClick={publish}>
          <PublishIcon></PublishIcon>
        </Fab>
      </Tooltip>
    </StyledActionBar>
  );
};

export default ActionBar;
