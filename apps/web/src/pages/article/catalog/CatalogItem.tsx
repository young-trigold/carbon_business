import { memo, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import findHeadingElementById from '../editor/utils/findHeadingElementById';
import { HeadingInfo } from './Catalog';
import { styled } from '@mui/material';
import { useAppSelector } from '../../../app/store';

interface StyledCatalogItemProps {
	level: number;
	isCurrent: boolean;
}

const StyledCatalogItem = styled("div")<StyledCatalogItemProps>((props) => ({
	position: "relative",
	margin: `3px ${(props.level - 1) * 1.5}em`,
	paddingLeft: `1em`,
	marginRight: 0,
	color: (props.isCurrent ? props.theme.palette.primary.main : 'inherit'),
	cursor: "pointer",
	overflow: "hidden",
	textOverflow: "ellipsis",
	whiteSpace: "nowrap",

	"&::before": {
		display: "block",
		position: "absolute",
		transformOrigin: `0 0`,
		transform: `translateX(-1em) ${(props.isCurrent ? '' : 'scaleY(0)')}`,
		content: '',
		width: '5px',
		height: '1.2em',
		borderRadius: '4px',
		backgroundColor: props.theme.palette.primary.main,
	
	},

	"&:active": {
		color: props.theme.palette.warning.main,
	},

	"&:hover": {
		color: props.theme.palette.warning.main,
	},
}));

export interface CatalogItemProps {
	heading: HeadingInfo;
}

const CatalogItem: React.FC<CatalogItemProps> = (props) => {
	const { heading } = props;

	const onClick: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
		const currentHeadingElement = findHeadingElementById(heading.headingId);
		currentHeadingElement?.scrollIntoView();
	}, [heading.headingId]);

	const currentHeadingId = useAppSelector(
		(state) => state.articlePage.catalog.currentHeadingId,
	);

	const [isCurrent, setIsCurrent] = useState(false);

	useEffect(() => {
		setIsCurrent(currentHeadingId === heading.headingId);
	}, [currentHeadingId]);

	return (
		<StyledCatalogItem isCurrent={isCurrent} level={heading.level} onClick={onClick}>
			{heading.content}
		</StyledCatalogItem>
	);
};

export default memo(CatalogItem);
