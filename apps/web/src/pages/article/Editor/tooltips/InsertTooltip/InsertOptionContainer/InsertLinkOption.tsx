import { memo, useCallback } from 'react';

import { useAppDispatch } from '@/app/store';
import { CurrentModal, openModal } from '@/app/store/modals';
import LinkIconSrc from '@/static/icon/link.png';
import { StyledOption } from '.';

const InsertLinkOption = () => {
	const dispatch = useAppDispatch();
	const handleOptionClick = () => {
		dispatch(openModal(CurrentModal.InsertLink));
	};

	return (
		<StyledOption onClick={handleOptionClick}>
			<img src={LinkIconSrc} alt="链接" width={24} />
			<span>插入链接</span>
		</StyledOption>
	);
};

export default memo(InsertLinkOption);
