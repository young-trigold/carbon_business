import { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { toggleCatalogVisible } from '@/app/store/pages/contentPage';
import { StyledFloatingActionButton } from '@/components/Button/FloatingActionButton';
import ListIcon from '@/static/icon/list.png';
import styled from 'styled-components';

const StyledCatalogButton = styled(StyledFloatingActionButton)`
	opacity: 0;
	transform: scaleY(0);

	@media (max-width: 1013.9px) {
		opacity: 1;
		transform: unset;
	}
`;

const CatalogButton: React.FC = () => {
	const dispatch = useDispatch();

	const handleClick = useCallback(() => {
		dispatch(toggleCatalogVisible());
	}, [toggleCatalogVisible]);

	return (
		<StyledCatalogButton rect={{ right: 32, bottom: 110 }} onClick={handleClick}>
			<img alt="目录" src={ListIcon} draggable={false} style={{ width: '100%' }} />
		</StyledCatalogButton>
	);
};

export default memo(CatalogButton);
