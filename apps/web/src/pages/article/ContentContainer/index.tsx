import { PropsWithChildren, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { setCurrentHeadingId } from '@/app/store/pages/contentPage';
import { HeaderHeight } from '@/components/Header';
import getCurrentHeadingId from '../editor/utils/getCurrentHeadingId';

const StyledContentContainer = styled.div`
	max-height: ${() => `calc(100vh - ${HeaderHeight}px)`};
	overflow: overlay;
	scroll-padding-top: 2em;
`;

const ContentContainer: React.FC<PropsWithChildren> = (props) => {
	const { children } = props;
	const dispatch = useAppDispatch();

	const onScroll: React.UIEventHandler<HTMLDivElement> = (event) => {
		const { target } = event;
		if (!(target instanceof HTMLDivElement)) return;
		const currentHeadingId = getCurrentHeadingId(target);
		if (currentHeadingId) dispatch(setCurrentHeadingId(currentHeadingId));
	};

	const { catalog, editor } = useAppSelector((state) => state.contentPage);
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
