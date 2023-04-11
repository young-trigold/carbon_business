import { MenuItem, MenuList, useTheme } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../app/store';
import { setCurrentBodyIndex } from '../../../../app/store/pages/admin';
import { tabs } from '../..';

export const AdminMenuList = () => {
  const dispatch = useAppDispatch();
  const { currentBodyIndex } = useAppSelector((state) => state.adminPage);
  const { palette } = useTheme();

  return (
    <MenuList
      sx={{
        width: '100px',
        position: 'sticky',
        top: 0,
        height: 'fit-content',
      }}
    >
      {tabs.map((tab, index) => (
        <MenuItem
          onClick={() => dispatch(setCurrentBodyIndex(index))}
          key={tab.text}
          sx={{
            padding: '1em',
            backgroundColor: currentBodyIndex === index ? palette.primary.main : 'unset',
          }}
        >
          {tab.text}
        </MenuItem>
      ))}
    </MenuList>
  );
};
