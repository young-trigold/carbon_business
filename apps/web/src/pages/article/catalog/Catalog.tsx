import { memo, useEffect } from 'react';
import { HeadingExtension } from '../editor/extensions';
import CatalogItem from './CatalogItem';
import { Paper, styled } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { setHeadings } from '../../../app/store/pages/article';

export interface HeadingInfo {
	level: number;
	content: string;
	headingId: string;
}

interface StyledCatalogProps {
	catalogVisible: boolean;
}

const StyledCatalog = styled(Paper)<StyledCatalogProps>((props) => ({
  flex: '0 0 300px',
	maxHeight: '550px',
	// backgroundColor: ${(props) => props.theme.foregroundColor};
	borderRadius: '6.4px',
	padding: '1em',
	userSelect: 'none',
	position: 'sticky',
	overflowY: 'auto',
	margin: '0 1em',
	top: '2em',
	overscrollBehavior: "contain",

	// @media (max-width: 1014px) {
	// 	z-index: 4;
	// 	position: fixed;
	// 	width: 300px;
	// 	margin: unset;
	// 	top: unset;
	// 	bottom: 160px;
	// 	right: 50%;
	// 	max-height: 450px;
	// 	transform: translate(50%, 0) ${(props) => (props.catalogVisible ? '' : 'scaleY(0)')};
	// 	opacity: ${(props) => (props.catalogVisible ? 1 : 0)};
	// 	background-color: ${(props) => props.theme.foregroundColor};
	// 	box-shadow: ${(props) => `0 0 6px ${props.theme.shadowColor}`};
	// }
}));

interface CatalogProps {}

const Catalog: React.FC<CatalogProps> = (props) => {
	const { visible: catalogVisible } = useAppSelector((state) => state.articlePage.catalog);

	// =============================== heading ===============================
	const { catalog, editor } = useAppSelector((state) => state.articlePage);
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
