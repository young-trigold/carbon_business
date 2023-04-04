import { AppState, useAppSelector } from '@/app/store';
import CommentIcon from '@/static/icon/comment.png';
import { TextSelection } from 'prosemirror-state';
import { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

interface StyledSelectionCommentTooltipProps {
	visible: boolean;
	position: Pick<DOMRect, 'left' | 'top'>;
}

const StyledSelectionCommentTooltip = styled.div<StyledSelectionCommentTooltipProps>`
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	width: 36px;
	height: 36px;
	visibility: ${(props) => (props.visible ? 'unset' : 'hidden')};
	opacity: ${(props) => (props.visible ? 1 : 0)};
	top: ${(props) => `${props.position.top - 40}px`};
	left: ${(props) => `${props.position.left - 18}px`};
	border-radius: 6.4px;
	border: 1px solid ${(props) => props.theme.borderColor};
	box-shadow: 0 0 6px ${(props) => props.theme.shadowColor};
	background-color: ${(props) => props.theme.foregroundColor};
	transition: ${(props) => props.theme.transition};
	user-select: none;
	padding: 6px;
	z-index: 1;

	&:active {
		transform: translateY(2px);
	}
`;

const SelectionCommentTooltip = () => {
	const { position, visible } = useSelector(
		(state: AppState) => state.contentPage.editor.plugin.selectionTooltip,
	);
	const { editorStore } = useAppSelector((state) => state.contentPage.editor);

	const onClick = () => {
		if (!editorStore) return;
		const { view: editorView, commands } = editorStore;
		if (!editorView) return;
		const { state: editorState } = editorView;
		const { selection, doc } = editorState;
		if (selection instanceof TextSelection) {
			const { from, to } = selection;
			console.debug(doc.content.textBetween(from, to));
		}
	};

	return (
		<StyledSelectionCommentTooltip visible={visible} position={position} onClick={onClick}>
			<img src={CommentIcon} alt="评论" style={{ width: '100%' }} />
		</StyledSelectionCommentTooltip>
	);
};

export default memo(SelectionCommentTooltip);
