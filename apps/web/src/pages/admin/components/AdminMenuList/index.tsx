import { MenuItem, MenuList, useTheme } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../app/store';
import { setCurrentBodyIndex } from '../../../../app/store/pages/admin';

const options = [
  { text: '文章管理', bodyIndex: 0 },
  { text: '数据管理', bodyIndex: 1 },
  { text: '用户管理', bodyIndex: 2 },
];

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
      {options.map((option, index) => (
        <MenuItem
          onClick={() => dispatch(setCurrentBodyIndex(option.bodyIndex))}
          key={option.text}
          sx={{
            padding: '1em',
            backgroundColor: currentBodyIndex === index ? palette.primary.main : 'unset',
          }}
        >
          {option.text}
        </MenuItem>
      ))}
    </MenuList>
  );
};
