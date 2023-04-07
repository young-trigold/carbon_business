import { PropsWithChildren, useEffect, useState } from 'react';
import getCurrentHeadingId from '../editor/utils/getCurrentHeadingId';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { styled } from '@mui/material';
import { setCurrentHeadingId } from '../../../app/store/pages/article';

const StyledContentContainer = styled("div")(() => ({
	maxHeight: `calc(100vh - 60px)`,
	overflow: "overlay",
	scrollPaddingTop: "2em",
}));

const ContentContainer: React.FC<PropsWithChildren> = (props) => {
	const { children } = props;
	const dispatch = useAppDispatch();

	const onScroll: React.UIEventHandler<HTMLDivElement> = (event) => {
		const { target } = event;
		if (!(target instanceof HTMLDivElement)) return;
		const currentHeadingId = getCurrentHeadingId(target);
		if (currentHeadingId) dispatch(setCurrentHeadingId(currentHeadingId));
	};

	const { catalog, editor } = useAppSelector((state) => state.articlePage);
	const { headings } = catalog;
	const { editorStore } = editor;
	useEffect(() => {
		if (!editorStore) return;
		const { view: editorView } = editorStore;
		if (!editorView) return;
		const currentHeadingId = getCurrentHeadingId(editorView.dom);
		if (currentHeadingId) dispatch(setCurrentHeadingId(currentHeadingId));
	}, [editorStore?.view?.state.doc.content]);

	const [first, setFirst] = useState(true);
	useEffect(() => {
		if (!new window.URL(window.location.href).searchParams.get('currentHeadingId') && first) {
			if (headings.length) {
				dispatch(setCurrentHeadingId(headings[0].headingId));
				setFirst(false);
			}
		}
	}, [headings]);

	return <StyledContentContainer onScroll={onScroll}>{children}</StyledContentContainer>;
};

export default ContentContainer;
