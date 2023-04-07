import { styled } from '@mui/material';
import { useCallback } from 'react';
import { store } from '../../../../../../../../app/store';

const StyledHeadingOptionContainer = styled('div')((props) => ({
  position: 'absolute',
  top: '100%',
  left: '-50%',
  whiteSpace: 'nowrap',
  backgroundColor: props.theme.palette.background.paper,
  borderRadius: '6.4px',
  transition: `${props.theme.transitions.duration.standard}ms ${props.theme.transitions.easing.easeOut}`,
  userSelect: 'none',
  fontSize: '16px',
  padding: '1px',
  transformOrigin: '0 0',
  opacity: 0,
  pointerEvents: 'none',
  transform: 'scale(1, 0)',
  boxShadow: props.theme.shadows[2],
}));

const StyledHeadingOption = styled('div')((props) => ({
  padding: ' 2px 4px',
  transition: `${props.theme.transitions.duration.standard}ms ${props.theme.transitions.easing.easeOut}`,
  borderRadius: '6.4px',
  cursor: 'pointer',

  ':hover': {
    backgroundColor: props.theme.palette.action.hover,
  },

  ':active': {
    backgroundColor: props.theme.palette.action.active,
  },
}));

const StyledHeadingDecoration = styled('div')(() => ({
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '30px',
  fontSize: '20px',
  borderRadius: '6.4px',
  fontFamily: 'Times New Roman',

  '&:hover': {
    '&>div': {
      opacity: 'unset',
      pointerEvents: 'unset',
      transform: 'unset',
    },
  },
}));

export const HeadingDecoration = () => {
  const { editorStore } = store.getState().articlePage.editor;

  const toggleHeadingLevel1 = useCallback(() => {
    if (!editorStore?.view) return;
    const { commands } = editorStore;
    commands.heading.toggle(1);
  }, [editorStore]);

  const toggleHeadingLevel2 = useCallback(() => {
    if (!editorStore?.view) return;
    const { commands } = editorStore;
    commands.heading.toggle(2);
  }, [editorStore]);

  const toggleHeadingLevel3 = useCallback(() => {
    if (!editorStore?.view) return;
    const { commands } = editorStore;
    commands.heading.toggle(3);
  }, [editorStore]);

  return (
    <StyledHeadingDecoration>
      <span>H</span>
      <StyledHeadingOptionContainer>
        <StyledHeadingOption onClick={toggleHeadingLevel1}>
          <span>1 级标题</span>
        </StyledHeadingOption>
        <StyledHeadingOption onClick={toggleHeadingLevel2}>
          <span>2 级标题</span>
        </StyledHeadingOption>
        <StyledHeadingOption onClick={toggleHeadingLevel3}>
          <span>3 级标题</span>
        </StyledHeadingOption>
      </StyledHeadingOptionContainer>
    </StyledHeadingDecoration>
  );
};
