import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { Article } from 'lib';
import { useNavigate } from 'react-router-dom';

export const ArticleCard: React.FC<Article> = (props) => {
  const { title, subtitle, source, date, backgroundImgURL, link, id } = props;

  const navigate = useNavigate();

  const onClick = () => {
    if (link) window.open(link);
    else navigate(`articles/${id}`);
  };

  return (
    <Card
      sx={{
        cursor: 'pointer',
        margin: '0.5em 0',
        overflow: 'hidden',
      }}
      onClick={onClick}
    >
      <Stack direction="row">
        {backgroundImgURL && (
          <Box sx={{ display: 'flex' }} margin="0.5em">
            <img src={backgroundImgURL} width={200} />
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1 }}>
          <Stack>
            <Typography variant="h6">
              {title.length > 30 ? title.slice(0, 30) + '...' : title}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Typography variant="caption">来自：{source}</Typography>
              <Typography variant="caption">发表于：{date}</Typography>
            </Stack>
            <Typography variant="body2">{subtitle}</Typography>
          </Stack>
        </CardContent>
      </Stack>
    </Card>
  );
};
