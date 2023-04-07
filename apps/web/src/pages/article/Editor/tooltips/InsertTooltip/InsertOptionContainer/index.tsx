import { styled } from '@mui/material';
import { useAppSelector } from '../../../../../../app/store';
import InsertLinkOption from './InsertLinkOption';
import InsertPictureOption from './InsertPictureOption';

interface StyledInsertOptionContainerProps {
  position: Partial<DOMRect>;
}

const StyledInsertOptionContainer = styled('div')<StyledInsertOptionContainerProps>((props) => ({
  position: 'absolute',
  borderRadius: '6.4px',
  boxShadow: props.theme.shadows[2],
  backgroundColor: props.theme.palette.background.paper,
  top: 0,
  left: 0,
  transform: `translate(${props.position.left}px, ${props.position.top}px)`,
  transition: `${props.theme.transitions.duration.standard}ms ${props.theme.transitions.easing.easeOut}`,
  userSelect: 'none',
  zIndex: 9,
}));

export const StyledOption = styled('div')((props) => ({
  borderRadius: '6.4px',
  cursor: 'pointer',
  margin: '4px',
  padding: '4px 0.5em',

  '&:hover': {
    backgroundColor: props.theme.palette.action.hover,
  },

  '&:active': {
    backgroundColor: props.theme.palette.action.active,
  },
}));

interface InsertOptionContainerProps {}

const InsertOptionContainer = (props: InsertOptionContainerProps) => {
  const { canInsertBlock, position } = useAppSelector(
    (state) => state.articlePage.editor.plugin.insertTooltip,
  );

  const onClick: React.MouseEventHandler = (event) => {
    event.stopPropagation();
  };

  return (
    <StyledInsertOptionContainer
      onClick={onClick}
      position={position}
      onMouseDown={(event) => {
        event.stopPropagation();
      }}
    >
      <InsertLinkOption />
      {canInsertBlock && <InsertPictureOption />}
    </StyledInsertOptionContainer>
  );
};

export default InsertOptionContainer;
