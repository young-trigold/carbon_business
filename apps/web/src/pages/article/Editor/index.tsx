import { useEffect, useRef } from 'react';

import { Paper, styled } from '@mui/material';
import { Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { useAppDispatch } from '../../../app/store';
import { setEditorStore } from '../../../app/store/pages/article';
import { presetNodeExtensions, presetPlainExtensions } from './extensions';
import { Extension } from './extensions/type';
import { EditorStore, HandleDOMEvents } from './store';
import InsertTooltip from './tooltips/InsertTooltip';

const EditorContainer = styled(Paper)((props) => ({
  flex: '1 1 760px',
  minWidth: '350px',
  minHeight: 'calc(100vh - 300px)',
  zIndex: 2,
  position: 'relative',
  margin: '1em',
  // backgroundColor: props.theme.foregroundColor,
  // background-image: linear-gradient(
  //     to right,
  //     ${(props) => props.theme.shadowColor} ${px()},
  //     transparent 0
  //   ),
  //   linear-gradient(to bottom, ${(props) => props.theme.shadowColor} ${px()}, transparent 0);
  // background-size: 1.2em 1.2em,
  // background-position-x: 0.6em,
  borderRadius: '6.4px',
  padding: '1.5em 2em 0.5em 2em',
  overflowWrap: 'break-word',
  caretColor: props.theme.palette.warning.main,

  '@media (max-width: 530px)': {
    borderRadius: 0,
    padding: '1.5em 1em 0.5em 1em',
  },

  // 上下标
  'sub, sup': {
    fontSize: '8px',
    position: 'relative',
    verticalAlign: 'unset',
  },

  sup: {
    bottom: '0.6em',
  },

  // 下划线
  u: {
    textDecorationColor: props.theme.palette.primary.main,
  },

  // 段落
  p: {
    textIndent: '2em',

    '& img': {
      display: 'block',
      margin: '0 auto',
      maxWidth: '100%',
    },

    '& code': {
      fontSize: '14px',
      fontStyle: 'italic',
      fontWeight: 'bold',
      color: props.theme.palette.primary.main,
      fontFamily: 'source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace',
      borderRadius: '4px',
    },
  },

  // 列表
  'ol,ul': {
    '& p': {
      textIndent: 'unset',
    },
  },

  // // 代码块
  // .cm-editor {
  //   font-size: 14px;
  //   border-radius: 6.4px;
  //   box-shadow: 0 0 4px ${(props) => props.theme.shadowColor};
  //   background-color: ${(props) => props.theme.foregroundColor};
  //   transition: ${(props) => props.theme.transition};

  //   &.cm-focused {
  //     outline: none;
  //   }

  //   // gutters
  //   .cm-gutters {
  //     color: ${(props) => props.theme.textColor};
  //     background-color: ${(props) => props.theme.surfaceColor};
  //     border-radius: 6.4px;
  //     border-top-right-radius: 0;
  //     border-bottom-right-radius: 0;
  //     border-right-color: ${(props) => props.theme.borderColor};
  //     user-select: none;

  //     .cm-gutterElement.cm-activeLineGutter {
  //       color: ${(props) => props.theme.primaryColor};
  //     }
  //   }
  // }
}));

interface EditorProps {
  editable: boolean;
  autoFocus?: boolean;
  onChange?: (view: EditorView, tr: Transaction) => void;
  extensions?: Extension[];
  doc?: string;
  handleDOMEvents?: HandleDOMEvents;
}

export const Editor: React.FC<EditorProps> = (props) => {
  const {
    extensions = [],
    editable = false,
    autoFocus = true,
    onChange,
    handleDOMEvents,
    doc,
  } = props;

  const editorContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const finalExtensions = [
      ...presetPlainExtensions.map((Extension) => new Extension()),
      ...presetNodeExtensions.map((Extension) => new Extension()),
      ...extensions,
    ];
    const editorStore = new EditorStore(finalExtensions);
    const state = editorStore.createEditorState(doc);
    const editorView = editorStore.createEditorView(editorContainerRef.current!, {
      state,
      editable,
      autoFocus,
      onChange,
      handleDOMEvents,
    });
    dispatch(setEditorStore(editorStore));

    return () => {
      editorView.destroy();
      dispatch(setEditorStore(null));
    };
  }, []);

  return (
    <EditorContainer ref={editorContainerRef}>
      {editable && (
        <>
          <InsertTooltip />
        </>
      )}
      {/* {!editable && <SelectionCommentTooltip />} */}
    </EditorContainer>
  );
};
