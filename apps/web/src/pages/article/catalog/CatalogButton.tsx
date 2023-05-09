import MenuIcon from '@mui/icons-material/Menu';
import { Fab } from '@mui/material';
import { useDispatch } from 'react-redux';
import { toggleCatalogVisible } from '../../../app/store/pages/article';

export const CatalogButton: React.FC = () => {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(toggleCatalogVisible());
  };

  return (
    <Fab
      color="primary"
      aria-label="menu"
      sx={{
        position: 'absolute',
        right: '48px',
        top: '60%',
        opacity: 0,
        transform: "scaleY(0)",
      
       "@media (max-width: 1013.9px)": {
          opacity: 1,
          transform: "unset",
        },
      }}
      onClick={onClick}
    >
      <MenuIcon></MenuIcon>
    </Fab>
  );
};
