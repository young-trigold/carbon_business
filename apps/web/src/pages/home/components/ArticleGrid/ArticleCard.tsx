import { Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import { Article } from 'lib';

export const ArticleCard: React.FC<Article> = (props) => {
  const { title, subtitle, source, date, backgroundImgURL, link } = props;

  const onClick = () => {
    window.location.href = link;
  };

  return (
    <Card
      sx={{
        height: '160px',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <Stack direction="row">
        <CardMedia
          component="img"
          sx={{ width: '180px', padding: '0.5em' }}
          image={`${backgroundImgURL}`}
        />
        <CardContent sx={{ padding: '0.5em' }}>
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
