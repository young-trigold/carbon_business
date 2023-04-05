import { memo } from 'react';
import { StyledOption } from '.';

const InsertLinkOption = () => {
  // const dispatch = useAppDispatch();
  // const handleOptionClick = () => {
  //   dispatch(openModal(CurrentModal.InsertLink));
  // };

  return (
   
      <StyledOption onClick={() => {}}>
        
        <span>插入链接</span>
      </StyledOption>
 
  );
};

export default memo(InsertLinkOption);
