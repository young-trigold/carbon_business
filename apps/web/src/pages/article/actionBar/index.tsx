import axios from 'axios';
import { memo, useCallback, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../app/store';

const ActionBar: React.FC = () => {
  const { articleId } = useParams();
  const { editorStore } = useAppSelector((state) => state.articlePage.editor);
  const { hasLogin, userInfo } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const handlePublish = useCallback(async () => {
    if (!hasLogin) {
      // dispatch(openModal(CurrentModal.Login));
      // message.warn('请先登录!');
      return;
    }
    if (userInfo?.permission !== 'admin') {
      // dispatch(openModal(CurrentModal.Login));
      // message.warn('权限不足, 请重新登录!');
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
      // message.success('发布成功!');
    } catch (error) {
      // if (axios.isAxiosError(error))
      //   return message.error((error.response?.data as { message: string })?.message);
      // if (error instanceof Error) return message.error(error.message);
      // return message.error(JSON.stringify(error));
    }
  }, [editorStore, hasLogin, userInfo, articleId]);

  const navigate = useNavigate();
  // const handleCancel = useCallback(() => {
  //   navigate(`/${isChapter ? 'chapters' : 'articles'}/${articleId}`);
  // }, [isChapter, articleId]);

  return (
    <aside>
     
    </aside>
  );
};

export default (ActionBar);
