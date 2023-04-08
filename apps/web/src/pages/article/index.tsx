import { Skeleton, styled } from '@mui/material';
import axios from 'axios';
import { Article } from 'lib';
import { Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useQuery } from 'react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store';
import {
  setCurrentHeadingId,
  setInsertTooltip,
  setInsertTooltipVisible,
  setSelectionTooltip,
  setSelectionTooltipVisible,
} from '../../app/store/pages/article';
import { Header } from '../../components/Header';
import ContentContainer from './ContentContainer';
import ActionBar from './actionBar';
import { Catalog, CatalogButton } from './catalog';
import { Editor } from './editor';
import {
  BoldExtension,
  CodeBlockExtension,
  CodeExtension,
  HeadingExtension,
  ItalicExtension,
  LinkExtension,
  SubExtension,
  SupExtension,
  UnderlineExtension,
} from './editor/extensions';
import { ImageExtension } from './editor/extensions/nodeExtensions/ImageExtension';
import { ListExtensions } from './editor/extensions/nodeExtensions/listExtensions';
import { TableExtensions } from './editor/extensions/nodeExtensions/tableExtensions';
import { SelectionTooltipExtension } from './editor/extensions/plainExtensions/SelectionTooltipExtension';
import { HandleDOMEvents } from './editor/store';
import findHeadingElementById from './editor/utils/findHeadingElementById';

const StyledContentPage = styled('div')(() => ({
  maxHeight: '100%',
  position: 'relative',
  whiteSpace: 'pre-wrap',
  height: '100vh',
}));

const MainContainer = styled('main')(() => ({
  position: 'relative',
  display: 'flex',
  alignItems: ' flex-start',
}));

interface ContentPageProps {
  editable: boolean;
}

const ArticlePage: React.FC<ContentPageProps> = (props) => {
  const { editable } = props;
  const { articleId } = useParams();
  const dispatch = useAppDispatch();

  const { catalog } = useAppSelector((state) => state.articlePage);
  const [currentHeadingIdSearchParam, setCurrentHeadingIdSearchParam] = useSearchParams();
  const isFirstRef = useRef(true);
  useEffect(() => {
    if (!isFirstRef.current) return;
    const initialHeadingIdFromURL = currentHeadingIdSearchParam.get('currentHeadingId');
    const currentHeadingElement = findHeadingElementById(initialHeadingIdFromURL ?? '');
    if (currentHeadingElement) {
      currentHeadingElement.scrollIntoView();
      isFirstRef.current = false;
      dispatch(setCurrentHeadingId(initialHeadingIdFromURL!));
    }
  });

  useEffect(() => {
    const { currentHeadingId } = catalog;
    if (!currentHeadingId) return;
    setCurrentHeadingIdSearchParam({ currentHeadingId }, { replace: true });
  }, [catalog.currentHeadingId]);

  // // unmount
  // useEffect(() => {
  //   return () => {
  //     dispatch(resetContentPage());
  //   };
  // }, []);

  const selectionTooltipExtension = useMemo(() => new SelectionTooltipExtension(), []);

  const extensions = useMemo(
    () => {
      const base = [
        new BoldExtension(),
        new ItalicExtension(),
        new UnderlineExtension(),
        new LinkExtension(),
        new SubExtension(),
        new SupExtension(),
        new CodeExtension(),
        new HeadingExtension(),
        new CodeBlockExtension(),
        new ImageExtension(),
        ...ListExtensions.map((Extension) => new Extension()),
        ...TableExtensions.map((Extension) => new Extension()),
      ];
      return editable ? [...base, selectionTooltipExtension] : base;
    }, 
    [],
  );

  const onChange = useCallback((view: EditorView, tr: Transaction) => {
    const { state } = view;
    // 更新 insert tooltip
    const { selection } = state;
    const { $head, empty } = selection;
    const { nodeAfter, nodeBefore } = $head;
    const canInsertBlock = nodeAfter === null || nodeBefore === null;
    const cursorPositionToViewPort = view.coordsAtPos($head.pos);
    const editorContainerPositionToViewPort = view.dom.parentElement!.getBoundingClientRect();
    dispatch(
      setInsertTooltip({
        visible: empty,
        canInsertBlock,
        position: {
          left: cursorPositionToViewPort.left - editorContainerPositionToViewPort.left,
          top: cursorPositionToViewPort.bottom - editorContainerPositionToViewPort.top,
        },
      }),
    );

    dispatch(
      setSelectionTooltip({
        position: {
          left: cursorPositionToViewPort.left - editorContainerPositionToViewPort.left,
          top: cursorPositionToViewPort.top - editorContainerPositionToViewPort.top,
        },
        visible: !empty && tr.getMeta(selectionTooltipExtension.pluginKey)?.selectionTooltipVisible,
      }),
    );

    view.updateState(view.state.apply(tr));
  }, []);

  const handleDOMEvents: HandleDOMEvents = useMemo(
    () => ({
      blur: () => {
        dispatch(setInsertTooltipVisible(false));
        dispatch(setSelectionTooltipVisible(false));
      },
    }),
    [],
  );

  const {
    isLoading,
    isError,
    error,
    data: item,
  } = useQuery({
    queryKey: ['articles', articleId],
    queryFn: async () => {
      const url = `/api/articles/${articleId}`;
      const res = await axios.get<{ article: Article }>(url);
      return res.data.article;
    },
  });

  if (isLoading) return <Skeleton />;
  if (isError) return <span>{(error as Error).message}</span>;

  return (
    <StyledContentPage>
      <Header />
      <ContentContainer>
        <MainContainer>
          <Catalog />
          <Editor
            extensions={extensions}
            doc={item?.content}
            editable={editable}
            autoFocus={true}
            onChange={onChange}
            handleDOMEvents={handleDOMEvents}
          />
          {/* <CommentList /> */}

          <CatalogButton />
        </MainContainer>
        {/* <Footer /> */}
      </ContentContainer>
      {editable && <ActionBar />}
    </StyledContentPage>
  );
};

export default ArticlePage;
