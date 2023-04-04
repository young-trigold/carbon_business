import styled from 'styled-components';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { setHeadings } from '@/app/store/pages/contentPage';
import { memo, useEffect } from 'react';
import { HeadingExtension } from '../editor/extensions';
import CatalogItem from './CatalogItem';

export interface HeadingInfo {
	level: number;
	content: string;
	headingId: string;
}

interface StyledCatalogProps {
	catalogVisible: boolean;
}

const StyledCatalog = styled.div<StyledCatalogProps>`
	flex: 0 0 300px;
	max-height: 550px;
	background-color: ${(props) => props.theme.foregroundColor};
	border-radius: 6.4px;
	padding: 1em;
	user-select: none;
	position: sticky;
	transition: ${(props) => props.theme.transition};
	overflow-y: auto;
	margin: 0 1em;
	top: 2em;
	overscroll-behavior: contain;

	@media (max-width: 1014px) {
		z-index: 4;
		position: fixed;
		width: 300px;
		margin: unset;
		top: unset;
		bottom: 160px;
		right: 50%;
		max-height: 450px;
		transform: translate(50%, 0) ${(props) => (props.catalogVisible ? '' : 'scaleY(0)')};
		opacity: ${(props) => (props.catalogVisible ? 1 : 0)};
		background-color: ${(props) => props.theme.foregroundColor};
		box-shadow: ${(props) => `0 0 6px ${props.theme.shadowColor}`};
	}
`;

interface CatalogProps {}

const Catalog: React.FC<CatalogProps> = (props) => {
	const { visible: catalogVisible } = useAppSelector((state) => state.contentPage.catalog);

	// =============================== heading ===============================
	const { catalog, editor } = useAppSelector((state) => state.contentPage);
	const { headings } = catalog;
	const { editorStore } = editor;

	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!editorStore) return;
		const { view: editorView } = editorStore;
		if (!editorView) return;
		const { state: editorState } = editorView;
		const { doc } = editorState;
		const currentHeadings: HeadingInfo[] = [];

		doc.content.forEach((node) => {
			if (node.type.name === HeadingExtension.extensionName) {
				const { headingId, level } = node.attrs;
				currentHeadings.push({ level, headingId, content: node.textContent });
			}
		});
		dispatch(setHeadings(currentHeadings));
	}, [editorStore?.view?.state.doc.content]);

	return (
		<StyledCatalog catalogVisible={catalogVisible}>
			{headings
				.filter((heading) => heading.content)
				.map((heading) => (
					<CatalogItem heading={heading} key={heading.headingId} />
				))}
		</StyledCatalog>
	);
};

export default memo(Catalog);
