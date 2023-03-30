import { styled, useTheme } from '@mui/material';

const UploadImageContainer = styled('label')(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  // height: '100px',
  border: '0.5px solid grey',
  borderRadius: '4px',
  padding: '1em',
  cursor: 'pointer',
  transition: 'all 0.3s',

  '&:hover': {
    borderColor: 'white',
  },

  '&:active': {
    borderColor: theme.palette.primary.main,
  }
}));

export const UploadImage = () => {
  const { palette } = useTheme();

  return (
    <UploadImageContainer>
      上传图片
      <input type="file" accept="image/*" hidden></input>
    </UploadImageContainer>
  );
};
