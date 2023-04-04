import { memo, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { AppState } from '@/app/store';
import findHeadingElementById from '../editor/utils/findHeadingElementById';
import { HeadingInfo } from './Catalog';

interface StyledCatalogItemProps {
	level: number;
	isCurrent: boolean;
}

const StyledCatalogItem = styled.div<StyledCatalogItemProps>`
	position: relative;
	margin: 3px ${(props) => `${(props.level - 1) * 1.5}em`};
	padding-left: 1em;
	margin-right: 0;
	color: ${(props) => (props.isCurrent ? props.theme.primaryColor : 'inherit')};
	transition: ${(props) => props.theme.transition};
	cursor: pointer;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	&::before {
		display: block;
		position: absolute;
		transform-origin: 0 0;
		transform: translateX(-1em) ${(props) => (props.isCurrent ? '' : 'scaleY(0)')};
		content: '';
		width: 5px;
		height: 1.2em;
		border-radius: 4px;
		background-color: ${(props) => props.theme.primaryColor};
		transition: ${(props) => props.theme.transition};
	}

	&:active {
		color: ${(props) => props.theme.activeColor};
	}

	&:hover {
		color: ${(props) => props.theme.hoverColor};
	}
`;

export interface CatalogItemProps {
	heading: HeadingInfo;
}

const CatalogItem: React.FC<CatalogItemProps> = (props) => {
	const { heading } = props;

	const onClick: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
		const currentHeadingElement = findHeadingElementById(heading.headingId);
		currentHeadingElement?.scrollIntoView();
	}, [heading.headingId]);

	const currentHeadingId = useSelector(
		(state: AppState) => state.contentPage.catalog.currentHeadingId,
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
