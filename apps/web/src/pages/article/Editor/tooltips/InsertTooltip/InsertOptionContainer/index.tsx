import { styled } from '@mui/material';
import { useSelector } from 'react-redux';
import InsertLinkOption from './InsertLinkOption';
import InsertPictureOption from './InsertPictureOption';
import { useAppSelector } from '../../../../../../app/store';

interface StyledInsertOptionContainerProps {
  position: Partial<DOMRect>;
}

const StyledInsertOptionContainer = styled('div')<StyledInsertOptionContainerProps>((props) => ({
  position: 'absolute',
  // border: 1px solid ${(props) => props.theme.borderColor};
  borderRadius: '6.4px',
  // box-shadow: 0 0 6px ${(props) => props.theme.shadowColor};
  // background-color: ${(props) => props.theme.foregroundColor};
  top: 0,
  left: 0,
  width: '150px',
  transform: `translate(${props.position.left}px, ${props.position.top}px)`,
  // transition: ${(props) => props.theme.transition};
  userSelect: 'none',
  zIndex: 9,
}));

export const StyledOption = styled('div')((props) => ({
  display: 'flex',
  padding: '0.5em',
  borderRadius: ' 6.4px',
  cursor: 'pointer',

  '& > *': {
    marginRight: '1em',
  },

  '&:hover': {
    // color: ${(props) => props.theme.hoverColor};
    // background-color: ${(props) => props.theme.surfaceColor};
  },

  '&:active': {
    // color: ${(props) => props.theme.activeColor};
    // background-color: ${(props) => props.theme.surfaceColor};
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
